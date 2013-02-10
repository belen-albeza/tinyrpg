function Monster( type, sprite, size ) {
  var scope = this;
  var types = {};
  types[Monster.TYPE_SLIME] = {
      attack: 6,
      defense: 2,
      energy: 10
  };

  types[Monster.TYPE_BICHO] = {
      attack: 10,
      defense: 1,
      energy: 30
  };

  types[Monster.TYPE_TRONCHO] = {
      attack: 20,
      defense: 8,
      energy: 80
  };

  this.type = type;
  this.sprite = sprite;
  this.size = size;
  this.energyBar = new ProgressBar(size, size / 10.0, 0x000000);
  this.energyBar.position.y = -size;
  this.sprite.add(this.energyBar);

  this.defense = types[type].defense;
  this.attack = types[type].attack;
  this.energy = types[type].energy;

  EventDispatcher.call( this );

  this.addEnergy = function( value ) {
    var oldEnergy = this.energy;
    this.energy = Math.min(
                    Math.max( 0, this.energy + value ),
                    types[type].energy
    );
    if (oldEnergy != this.energy) {
      this.updateEnergyBar();
    }
    scope.dispatchEvent({
      type: 'energyChanged',
      oldEnergy: oldEnergy,
      energy: scope.energy,
      requestedEnergyDelta: value
    });
  }

  this.isDead = function() {
    return this.energy <= 0;
  }

  this.updateEnergyBar = function() {
    scope.energyBar.setValue(scope.energy / types[type].energy);
  };
}

Monster.TYPE_SLIME = 'slime';
Monster.TYPE_BICHO = 'bicho';
Monster.TYPE_TRONCHO = 'troncho';

