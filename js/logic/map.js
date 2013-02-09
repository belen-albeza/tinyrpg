function Map(tileSize) {
  var scope = this;
  scope.tileSize = tileSize;

  scope.graph = new Graph();
  scope.graph.generate();

  scope.sprite = new MapSprite(tileSize, scope.graph.nodes);

  this.isValidPosition = function( index ) {
    return (index >= 0) && (index < scope.graph.graphLength());
  };

  this.getSlot = function(index) {
    return scope.graph.nodes[index];
  };

  this.swapSlot = function(slot, newSlot) {
    newSlot.index = slot.index;
    scope.graph.nodes[slot.index] = newSlot;
    scope.sprite.updateGeometry(slot.index);
  };
}
