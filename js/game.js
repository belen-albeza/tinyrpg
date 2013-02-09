function Game(container) {
  var scope = this;
  var TILE_SIZE = 100;
  var cameraTarget = new THREE.Vector3(0, 0, 0);

  var STATE_EXPLORE = 'play';
  var STATE_COMBAT = 'combat';
  var STATE_GAMEOVER = 'gameover';
  var STATE_VICTORY = 'victory';

  var gameState = STATE_EXPLORE;
  var combatTimeout = null;

  EventDispatcher.call(this);

  function onWindowResize() {
    scope.width = window.innerWidth;
    scope.height = window.innerHeight;

    scope.camera.left = 0;
    scope.camera.right = scope.width;
    scope.camera.top = 0;
    scope.camera.bottom = scope.height;
    scope.camera.updateProjectionMatrix();
    scope.camera.position.z = 100;
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
  }

  function onKeyUp( e ) {
    var keyCode = e.keyCode;
    if (gameState == STATE_EXPLORE) {
      if( keyCode == 37 ) {
        scope.hero.moveBackwards();
        followHero();
      } else if( keyCode == 39 ) {
        scope.hero.moveForward();
        followHero();
      }
    }
    else if (gameState == STATE_GAMEOVER) {

    }
  }

  function onStatsChanged( e ) {
    scope.dispatchEvent(e);
  }

  function onCombatStarted( e ) {
    if( gameState != STATE_EXPLORE ) {
      return;
    }

    gameState = STATE_COMBAT;

    if( combatTimeout !== null ) {
      clearTimeout( combatTimeout );
    }

    var monster = new Monster( e.slot.contents.type );
    
    combatRound( monster );
  }

  function combatRound( monster ) {
console.log('Combat round hero =', scope.hero.energy, 'monster=', monster.energy );
console.log('Scope hero attack', scope.hero.attack, 'monster defense', monster.defense);
    var heroInflictedDamage = Math.max( 0, scope.hero.attack - monster.defense );
    monster.addEnergy( - heroInflictedDamage );
console.log('heroinflicteddamage', heroInflictedDamage);
    if( !monster.isDead() ) {
      var monsterInflictedDamage = Math.max( 0, monster.attack - scope.hero.defense );
      scope.hero.addEnergy( - monsterInflictedDamage );
      console.log( 'monsterInflictedDamage', monsterInflictedDamage);
    }

    if( !scope.hero.isDead() && !monster.isDead() ) {
      setTimeout( function() { combatRound( monster ); }, 2000 );
    }

  }

  function onHeroDied( e ) {
    scope.dispatchEvent({
      type: 'gameover',
      hero: scope.hero
    });
    gameState = STATE_GAMEOVER;
  }

  function onSlotArrived(e) {
    var slot = e.slot;
    switch (slot.type) {
      case GraphNode.TYPE_TREASURE:
        console.log('Treasure', slot.contents);
        scope.hero.earnMoney(slot.contents.money);
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

  this.start = function() {
    scope.renderer = new THREE.WebGLRenderer({
      clearColor: 0x000000,
      clearAlpha: 1
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
    scope.hero.addEventListener('statsChanged', onStatsChanged, false);
    scope.hero.addEventListener('heroDied', onHeroDied, false);
    scope.hero.addEventListener('combatStarted', onCombatStarted, false);

    scope.rootDrawable.add( buildAxes( 10000 ) );

    onWindowResize();
    scope.dispatchEvent({
      type: 'statsChanged',
      hero: scope.hero
    });

    scope.render();

    setInterval(scope.update, 1000.0 / 30.0);

    window.addEventListener( 'keyup', onKeyUp, false );
  };

  this.update = function() {
    if( gameState == STATE_COMBAT ) {
      
    }
  };

  this.render = function() {
    requestAnimationFrame(scope.render);
    scope.renderer.render(scope.scene, scope.camera);
  };
}


