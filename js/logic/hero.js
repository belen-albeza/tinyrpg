function Hero( map ) {
  var scope = this;
  scope.positionIndex = 0;

  scope.sprite = new HeroSprite( map.tileSize );
  scope.sprite.rootDrawable.position.z = 10;

  this.setPositionIndex = function(x) {
    console.log( map );
    if( ! map.isValidPosition( x ) ) {
      return;
    }
    scope.positionIndex = x;
    scope.sprite.rootDrawable.position.x = x * map.tileSize;
  };

  this.moveForward = function() {
    this.setPositionIndex( scope.positionIndex + 1);
  }

  this.moveBackwards = function() {
    this.setPositionIndex( scope.positionIndex - 1);
  }
}
