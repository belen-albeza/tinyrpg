function Map(tileSize) {
  var scope = this;
  
  scope.tileSize = tileSize;

  scope.graph = new Graph();
  scope.graph.generate();

  scope.sprite = new MapSprite(tileSize, scope.graph.nodes);

  this.isValidPosition = function( index ) {
    return (index >= 0) && (index < scope.graph.graphLength);
  }
}
