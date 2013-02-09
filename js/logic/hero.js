function Hero( map ) {
  var scope = this;
  EventDispatcher.call(this);
  scope.positionIndex = 0;

  scope.sprite = new HeroSprite( map.tileSize );
  scope.sprite.position.z = 10;

  scope.inventory = {
    weapon: null,
    shield: null,
    helmet: null,
    armor: null,
    money: 0
  };

  this.setPositionIndex = function(index) {
    if( ! map.isValidPosition( index ) ) {
      return;
    }
    scope.positionIndex = index;
    scope.sprite.position.x = index * map.tileSize;

    var slot = map.getSlot(scope.positionIndex);
    scope.dispatchEvent({
      type: 'arrived',
      slot: slot
    }); 
  };

  this.moveForward = function() {
    this.setPositionIndex( scope.positionIndex + 1);
  };

  this.moveBackwards = function() {
    this.setPositionIndex( scope.positionIndex - 1);
  };

  this.earnMoney = function(amount) {
    scope.inventory.money += amount;
    console.log('money', scope.inventory.money);
  };
}
