function Hero( map ) {
  var scope = this;
  EventDispatcher.call(this);
  scope.MAX_ENERGY = 100;
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

  scope.energy = scope.MAX_ENERGY;

  function addEnergy(value) {
    var oldEnergy = scope.energy;

    scope.energy += value;
    scope.energy = Math.max(0, Math.min(scope.energy, scope.MAX_ENERGY));
    if (scope.energy <= 0) {
      die();
    }

    if (oldEnergy != scope.energy) {
      scope.dispatchEvent({
        type: 'statsChanged',
        hero: scope
      });
    }
  }

  function die() {
    console.log('DEATH');
    scope.dispatchEvent({
      type: 'heroDied',
      hero: scope
    });
  }

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
    addEnergy(-1);
  };

  this.moveBackwards = function() {
    this.setPositionIndex( scope.positionIndex - 1);
    addEnergy(-1);
  };

  this.earnMoney = function(amount) {
    scope.inventory.money += amount;
    console.log('money', scope.inventory.money);
  };

}
