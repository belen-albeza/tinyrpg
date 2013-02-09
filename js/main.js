
window.onload = function() {
  var game = new Game(document.getElementById('game')),
  stats = document.getElementById( 'stats' ),
  gameover = document.getElementById( 'game_over' );

  game.addEventListener( 'statsChanged', onStatsChanged, false );
  game.addEventListener( 'gameover', onGameOver, false);

  game.start();

  function onStatsChanged( e ) {
    var money = '$' + e.hero.inventory.money;
    var energy = (Math.floor(e.hero.energy * 100 / e.hero.MAX_ENERGY)) + '%';
    stats.innerHTML = 'Money: ' + money;
    stats.innerHTML += ' Energy: ' + energy;
  }

  function onGameOver( e ) {
    gameover.style.display = 'block';
  }
}
