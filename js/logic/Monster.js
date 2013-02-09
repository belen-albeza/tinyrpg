function Monster( type ) {
  var types = {};
  types[Monster.TYPE_SLIME] = {
      attack: 5,
      defense: 2,
      energy: 10
    };
 
  types[Monster.TYPE_BICHO] = {
      attack: 10,
      defense: 4,
      energy: 30
    };

  types[Monster.TYPE_TRONCHO] = {
      attack: 20,
      defense: 8,
      energy: 80
    };
  

  this.type = type;
  this.defense = types[type].defense;
  this.attack = types[type].attack;
  this.energy = types[type].energy;

  this.addEnergy = function( value ) {
    this.energy = Math.min(
                    Math.max( 0, this.energy + value ),
                    types[type].energy
                  );
  }

  this.isDead = function() {
    return this.energy <= 0;
  }
}

Monster.TYPE_SLIME = 'slime';
Monster.TYPE_BICHO = 'bicho';
Monster.TYPE_TRONCHO = 'troncho';
