function GraphNode(type, distance) {
  this.distance = distance;
  this.type = type;

}

GraphNode.TYPE_TREASURE = 0;
GraphNode.TYPE_BOSS = 1;
GraphNode.TYPE_LOCK = 2;
GraphNode.TYPE_END = 3;
GraphNode.TYPE_SHOP = 4;
GraphNode.TYPE_START = 5;

function Graph() {
  var scope = this;

  this.nodes = [];
  this.graphLength = 0;

  function addNode( node ) {
    scope.nodes.push( node );
    scope.graphLength += node.distance + 1;
  }

  this.generate = function() {
    addNode(new GraphNode(GraphNode.TYPE_START, 3));
    addNode(new GraphNode(GraphNode.TYPE_TREASURE, 2));
    addNode(new GraphNode(GraphNode.TYPE_SHOP, 8));
    addNode(new GraphNode(GraphNode.TYPE_LOCK, 0));
    addNode(new GraphNode(GraphNode.TYPE_BOSS, 0));
    addNode(new GraphNode(GraphNode.TYPE_TREASURE, 0));
    addNode(new GraphNode(GraphNode.TYPE_END, 0));
  }
}

