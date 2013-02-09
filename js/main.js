
window.onload = function() {
  var game = new Game(document.getElementById('game')),
    stats = document.getElementById( 'stats' ),
    gameover = document.getElementById( 'game_over' ),
    victory = document.getElementById('victory');

  game.addEventListener( 'statsChanged', onStatsChanged, false );
  game.addEventListener( 'gameover', onGameOver, false);
  game.addEventListener( 'victory', onVictory, false);

  game.start();

  function onStatsChanged( e ) {
    var money = '$' + e.hero.inventory.money;
    var energy = (Math.floor(e.hero.energy * 100 / e.hero.MAX_ENERGY)) + '%';
    stats.innerHTML = 'Money: ' + money;
    stats.innerHTML += ' Energy: ' + energy;
  }

  function onGameOver( e ) {
    var money = '$' + e.hero.inventory.money;
    gameover.style.display = 'block';
    gameover.querySelector('span.money').innerHTML = money;
  }

  function onVictory( e ) {
    var money = '$' + e.hero.inventory.money;
    victory.style.display = 'block';
    victory.querySelector('span.money').innerHTML = money;
  }
}
