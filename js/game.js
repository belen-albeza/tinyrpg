function Game(container) {
  var scope = this;
  var TILE_SIZE = 128;
  var cameraTarget = new THREE.Vector3(0, 0, 0);

  var STATE_EXPLORE = 'play';
  var STATE_COMBAT = 'combat';
  var STATE_GAMEOVER = 'gameover';
  var STATE_VICTORY = 'victory';

  var gameState = STATE_EXPLORE;
  var combatTimeout = null;

  var soundManager = new SoundManager([
      { name: 'hero_steps', url: 'data/sounds/steps.wav' },
      { name: 'hero_attack', url: 'data/sounds/hero_attack.wav' },
      { name: 'hero_damaged', url: 'data/sounds/hero_damaged.wav' },
      { name: 'monster_attack', url: 'data/sounds/monster_attack.wav' },
      { name: 'monster_damaged', url: 'data/sounds/monster_damaged.wav' },
      { name: 'monster_dies', url: 'data/sounds/monster_dies.wav' },
      { name: 'treasure_drop', url: 'data/sounds/treasure_drop.wav' },
      { name: 'treasure_pick', url: 'data/sounds/treasure_pick.wav' },
      { name: 'hero_dies', url: 'data/sounds/hero_dies.wav' },
    ]);

  EventDispatcher.call(this);

  function onWindowResize() {
    scope.width = window.innerWidth;
    scope.height = window.innerHeight;

    scope.camera.left = 0;
    scope.camera.right = scope.width;
    scope.camera.top = 0;
    scope.camera.bottom = scope.height;
    scope.camera.updateProjectionMatrix();
    scope.camera.position.z = 1000;
    scope.camera.lookAt(cameraTarget);

    scope.renderer.setSize(scope.width, scope.height);

    scope.rootDrawable.position.x = 0;
    scope.rootDrawable.position.y = scope.height / 2;

    followHero();
  }

  function followHero() {
    scope.camera.position.x = scope.rootDrawable.position.x +
      scope.hero.sprite.position.x - scope.width / 2;
    cameraTarget.x = scope.camera.position.x;
    scope.camera.lookAt(cameraTarget);
    console.log('follow hero camera x', scope.camera.position.x);
  }

  function onKeyUp( e ) {
    var keyCode = e.keyCode;
    if (gameState == STATE_EXPLORE) {
      if( keyCode == 37 ) {
        scope.hero.moveBackwards();
        followHero();
        soundManager.playSound( 'hero_steps' );
      } else if( keyCode == 39 ) {
        scope.hero.moveForward();
        followHero();
        soundManager.playSound( 'hero_steps' );
      }
    }
    else if (gameState == STATE_GAMEOVER) {

    }
  }

  function onHeroChanged( e ) {
    scope.dispatchEvent({ type: 'heroChanged', hero: e.hero });
  }

  function onCombatStarted( e ) {
    if( gameState != STATE_EXPLORE ) {
      return;
    }

    gameState = STATE_COMBAT;

    if( combatTimeout !== null ) {
      clearTimeout( combatTimeout );
    }

    var monster = new Monster( e.slot.contents.type, scope.map.sprite.getSlotSprite( e.slot.index ), TILE_SIZE );

    monster.addEventListener('energyChanged', onMonsterEnergyChanged, false);

    combatRound( monster, e.slot );
  }

  function combatRound( monster, slot ) {
    console.log('Combat round hero =', scope.hero.energy, 'monster=', monster.energy );
    console.log('Scope hero attack', scope.hero.attack, 'monster defense', monster.defense);
    var heroSprite = scope.hero.sprite,
        monsterSprite = monster.sprite,
        easing = TWEEN.Easing.Elastic.In,
        easingBack = TWEEN.Easing.Elastic.Out,
        offset = TILE_SIZE * 0.5,
        duration = 250,
        heroTween = new TWEEN.Tween( heroSprite.position )
          .to({ x: heroSprite.position.x + offset }, duration )
          .easing( easing )
          .onStart( function() {
              soundManager.stopSound( 'hero_steps' );
              soundManager.playSound( 'hero_attack' );
          })
          .onComplete(heroAttacks),
        heroTweenBack = new TWEEN.Tween( heroSprite.position )
          .to({ x: heroSprite.position.x }, duration )
          .easing( easingBack )
          .onComplete( monsterMayAttackHero ),
        monsterTween = new TWEEN.Tween( monsterSprite.position )
          .to({ x: monsterSprite.position.x - offset }, duration )
          .delay( duration )
          .easing( easing )
          .onStart(function() {
              monsterSprite.position.z = 300;
			  soundManager.stopSound( 'monster_damaged' );
			  soundManager.playSound( 'monster_attack' );
          })
          .onComplete(monsterAttacks),
        monsterTweenBack = new TWEEN.Tween( monsterSprite.position )
          .to({ x: monsterSprite.position.x }, duration )
          .easing( easingBack )
          .onComplete(function() {
            monsterSprite.position.z = 10;
            fightAnotherRound();
          });

    heroTween.chain( heroTweenBack );
    monsterTween.chain( monsterTweenBack );


    heroTween.start();

    function heroAttacks() {
      var heroInflictedDamage = Math.max( 0,
        scope.hero.attack - monster.defense );
      monster.addEnergy( - heroInflictedDamage );
      console.log('heroinflicteddamage', heroInflictedDamage);
      soundManager.playSound( 'monster_damaged' );
    }

    function monsterAttacks() {
      var monsterInflictedDamage = Math.max( 0, 
          monster.attack - scope.hero.defense );
      scope.hero.addEnergy( - monsterInflictedDamage );
      console.log( 'monsterInflictedDamage', monsterInflictedDamage);
	  soundManager.playSound( 'hero_damaged' );
    }

    function monsterMayAttackHero() {
      if( !monster.isDead() ) {
        monsterTween.start();
      }
      else {
		if( monster.isDead() ) {
			soundManager.stopSound( 'monster_damaged' );
			soundManager.playSound( 'monster_dies' );
		}
        checkCombatWon();
      }
    }

    function fightAnotherRound() {
      if (!checkCombatWon() && !scope.hero.isDead()) {
        setTimeout( function() { combatRound( monster, slot ); }, 500 );
      }
    }

    function checkCombatWon() {
      if (!scope.hero.isDead() && monster.isDead()) {
        gameState = STATE_EXPLORE;
        var newSlot;
        if( slot.contents.reward !== undefined ) {
          newSlot = new GraphNode( GraphNode.TYPE_TREASURE, {
            money: slot.contents.reward.money
          });
		  soundManager.playSound( 'treasure_drop' );
        } else {
          newSlot = new GraphNode( GraphNode.TYPE_ROAD );
        }

        scope.map.swapSlot( slot, newSlot );
        monster.removeEventListener('energyChanged', onMonsterEnergyChanged);
        return true;
      }
      else {
        return false;
      }
    }
  }

  function onHeroEnergyChanged( e ) {
    if (gameState == STATE_COMBAT || e.requestedEnergyDelta > 0) {
      followHero(); // update camera
      renderTextEnergy(e.requestedEnergyDelta, scope.hero.sprite, TILE_SIZE);
    }
    console.log('Hero energy change', e.energy - e.oldEnergy);
  }

  function onMonsterEnergyChanged( e ) {
    var monster = e.target;
    renderTextEnergy(e.requestedEnergyDelta, monster.sprite, TILE_SIZE);
    console.log('Monster energy change', e.energy - e.oldEnergy);
  }

  function onHeroDied( e ) {
    scope.dispatchEvent({
      type: 'gameover',
      hero: scope.hero
    });
	soundManager.playSound( 'hero_dies' );
    gameState = STATE_GAMEOVER;
  }

  function onSlotArrived(e) {
    var slot = e.slot;
    switch (slot.type) {
      case GraphNode.TYPE_TREASURE:
        console.log('Treasure', slot.contents);
        scope.hero.earnMoney(slot.contents.money);
		soundManager.playSound( 'treasure_pick' );
        followHero(); // update camera
        renderCharacterText('§' + slot.contents.money, '#ffff00',
          scope.hero.sprite, TILE_SIZE);
        scope.map.swapSlot(slot, new GraphNode(GraphNode.TYPE_ROAD));
        break;
      case GraphNode.TYPE_END:
        console.log('Victory!');
        gameState = STATE_VICTORY;
        scope.dispatchEvent({
          type: 'victory',
          hero: scope.hero
        });
        break;
      case GraphNode.TYPE_SHOP:
        console.log('Shop');
        scope.hero.restoreEnergy();
        break;
    }
  }

  function localToWorld(obj) {
    var local = obj.position.clone();
    local.add(scope.rootDrawable.position);
    console.log('local x', local.x);
    return local;
  }

  function worldToScreen(position) {
    var res = position;
    res.x -= scope.camera.position.x;
    return res;
  }

  function renderTextEnergy(amount, sprite, size) {
    var color = amount < 0 ? '#ff0000' : '#00ff00';
    renderCharacterText(String(Math.abs(amount)), color, sprite, size);
  }

  // TODO: change the name of this function
  function renderCharacterText(text, color, sprite, size) {
    var position = worldToScreen(localToWorld(sprite));

    renderText(text, position.x - size / 2,
      position.y - size, {
      css: {
        'font-size': '32px',
        'color': color,
        'width': size + 'px',
        'text-align': 'center'
      },
      animatedCss: {
        'top': position.y - size * 2 + 'px',
        'opacity': 0
      },
      animatedClass: 'fast',
      destroyTime: 1000
    });
  }

  function renderText(text, x, y, options) {
    if (!options) options = {};
    var element = document.createElement('div');
    element.style.position = 'absolute';
    if (options.css) {
      for (property in options.css) {
        element.style[property] = options.css[property];
      }
    }
    element.style.left = x + 'px';
    element.innerHTML = text;
    element.style.top = y + 'px';
    console.log(element);
    container.appendChild(element);

    if (options.animatedCss) {
      element.classList.add('animated');
      if (options.animatedClass) element.classList.add(options.animatedClass);
      setTimeout(function() {
        for (property in options.animatedCss) {
          element.style[property] = options.animatedCss[property];
        }
      }, 0);
    }

    if (options.destroyTime) {
      setTimeout(function() {
        container.removeChild(element);
      }, options.destroyTime);
    }
  }

  this.start = function() {
    scope.renderer = new THREE.WebGLRenderer({
      clearColor: 0x000000,
      clearAlpha: 0
    });
    scope.scene = new THREE.Scene();
    scope.camera = new THREE.OrthographicCamera(-320, 320, 200, -200, 1, 1000);
    window.addEventListener('resize', onWindowResize, false);
    container.appendChild(scope.renderer.domElement);

    scope.rootDrawable = new THREE.Object3D();
    scope.scene.add(scope.rootDrawable);

    scope.map = new Map(TILE_SIZE);
    scope.rootDrawable.add(scope.map.sprite);

    scope.hero = new Hero( scope.map );
    scope.rootDrawable.add(scope.hero.sprite);

    scope.hero.addEventListener('arrived', onSlotArrived, false);
    scope.hero.addEventListener('statsChanged', onHeroChanged, false);
    scope.hero.addEventListener('inventoryChanged', onHeroChanged, false);
    scope.hero.addEventListener('heroDied', onHeroDied, false);
    scope.hero.addEventListener('combatStarted', onCombatStarted, false);
    scope.hero.addEventListener('energyChanged', onHeroEnergyChanged, false);

    scope.rootDrawable.add( buildAxes( 10000 ) );

    onWindowResize();
    onHeroChanged( { hero: scope.hero });

    scope.render();

    setInterval(scope.update, 1000.0 / 30.0);

    window.addEventListener( 'keyup', onKeyUp, false );
  };

  this.update = function() {
  };

  this.render = function() {
    requestAnimationFrame(scope.render);
    TWEEN.update();

    scope.renderer.render(scope.scene, scope.camera);
  };
}


