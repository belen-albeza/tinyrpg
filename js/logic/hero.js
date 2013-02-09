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
  scope.attack = 5;
  scope.defense = 5;

  this.addEnergy = function(value) {
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
      updateEnergyBar();
    }
    scope.dispatchEvent({
      type: 'energyChanged',
      oldEnergy: oldEnergy,
      energy: scope.energy,
      requestedEnergyDelta: value
    });
  };

  function die() {
    console.log('DEATH');
    scope.dispatchEvent({
      type: 'heroDied',
      hero: scope
    });
  }

  function updateEnergyBar() {
    scope.sprite.energyBar.setValue(scope.energy / scope.MAX_ENERGY);
  }

  this.isDead = function() {
    return this.energy <= 0;
  }

  this.restoreEnergy = function(index) {
    this.addEnergy(scope.MAX_ENERGY);
  };

  this.setPositionIndex = function(index) {
    if( ! map.isValidPosition( index ) ) {
      return;
    }

    var slot = map.getSlot( index );

    if( slot.type == GraphNode.TYPE_BOSS ) {
      scope.dispatchEvent({
        type: 'combatStarted',
        slot: slot
      });
    } else {
      scope.positionIndex = index;
      scope.sprite.position.x = index * map.tileSize;

      scope.dispatchEvent({
        type: 'arrived',
        slot: slot
      });
    }
  };

  this.moveForward = function() {
    this.addEnergy(-1);
    this.setPositionIndex( scope.positionIndex + 1);
  };

  this.moveBackwards = function() {
    this.addEnergy(-1);
    this.setPositionIndex( scope.positionIndex - 1);
  };

  this.earnMoney = function(amount) {
    scope.inventory.money += amount;
    console.log('money', scope.inventory.money);
    scope.dispatchEvent({ type: 'inventoryChanged', hero: scope });
  };

}
