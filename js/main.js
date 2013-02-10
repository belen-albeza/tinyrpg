function startGame(container) {
  var game = new Game(container),
    stats = document.getElementById( 'stats' ),
    gameover = document.getElementById( 'game_over' ),
    victory = document.getElementById('victory');
  game.addEventListener( 'heroChanged', onHeroChanged, false );
  game.addEventListener( 'gameover', onGameOver, false);
  game.addEventListener( 'victory', onVictory, false);

  gameover.addEventListener( 'transitionend', onTransitionEnd, false );
  victory.addEventListener( 'transitionend', onTransitionEnd, false );
  gameover.addEventListener( 'webkitTransitionEnd', onTransitionEnd, false );
  victory.addEventListener( 'webkitTransitionEnd', onTransitionEnd, false );

  game.start();

  function onHeroChanged( e ) {
    var money = formatMoney( e.hero.inventory.money );
    var energy = e.hero.energy;
    stats.innerHTML = 'Money: ' + money;
    stats.innerHTML += ' Energy: ' + energy;
  }

  function onGameOver( e ) {
    var money = formatMoney( e.hero.inventory.money );
    gameover.style.opacity = 1;
  gameover.style.visibility = 'visible';  
    gameover.querySelector('span.money').innerHTML = money;
  }

  function onVictory( e ) {
    var money = formatMoney( e.hero.inventory.money );
    victory.style.opacity = 1;
  victory.style.visibility = 'visible';
    victory.querySelector('span.money').innerHTML = money;
  }

  function formatMoney( amount ) {
    return '§'+amount;
  }

  function onTransitionEnd( e ) {
    if( this.style.opacity == 0 ) {
      this.style.visibility = 'collapse';
    }
  }
}

window.onload = function() {
  var container = document.getElementById('game');
  var soundTrack = document.getElementById( 'soundtrack' );
  var loading = document.getElementById('loading');
  soundTrack.addEventListener('canplaythrough', function( e ) {
    soundTrack.play();
    container.style.display = 'block';
    loading.style.display = 'none';
    setTimeout(function() {
      startGame(container);
    }, 0);
  }, false);
  soundTrack.volume = 0.2;
  soundTrack.load();
}
