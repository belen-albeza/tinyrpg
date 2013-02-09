
window.onload = function() {
  var game = new Game(document.getElementById('game')),
    stats = document.getElementById( 'stats' ),
    gameover = document.getElementById( 'game_over' ),
    victory = document.getElementById('victory');

  game.addEventListener( 'heroChanged', onHeroChanged, false );
  game.addEventListener( 'gameover', onGameOver, false);
  game.addEventListener( 'victory', onVictory, false);

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
    gameover.querySelector('span.money').innerHTML = money;
  }

  function onVictory( e ) {
    var money = formatMoney( e.hero.inventory.money );
    victory.style.opacity = 1;
    victory.querySelector('span.money').innerHTML = money;
  }

  function formatMoney( amount ) {
	  return '§'+amount;
  }
}
