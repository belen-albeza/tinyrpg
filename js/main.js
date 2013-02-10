
window.onload = function() {
  var game = new Game(document.getElementById('game')),
    stats = document.getElementById( 'stats' ),
    gameover = document.getElementById( 'game_over' ),
    victory = document.getElementById('victory'),
	soundTrack = document.getElementById( 'soundtrack' );

  soundTrack.volume = 0.2;

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
