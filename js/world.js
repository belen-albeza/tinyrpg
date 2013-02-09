function GraphNode(type, contents) {
  this.type = type;
  this.contents = contents || {};
}

GraphNode.TYPE_TREASURE = 0;
GraphNode.TYPE_BOSS = 1;
GraphNode.TYPE_LOCK = 2;
GraphNode.TYPE_END = 3;
GraphNode.TYPE_SHOP = 4;
GraphNode.TYPE_START = 5;
GraphNode.TYPE_ROAD = 6;

function Graph() {
  var scope = this;

  this.nodes = [];
  this.graphLength = 0;

  function addNode( node ) {
    scope.nodes.push( node );
  }

  this.graphLength = function() {
    return scope.nodes.length;
  }

  this.generate = function() {
    addNode(new GraphNode(GraphNode.TYPE_START));

    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));

    addNode(new GraphNode(GraphNode.TYPE_TREASURE, {money: 100}));

    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));

    addNode(new GraphNode(GraphNode.TYPE_SHOP));

    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));

    addNode(new GraphNode(GraphNode.TYPE_LOCK));
    addNode(new GraphNode(GraphNode.TYPE_BOSS));
    addNode(new GraphNode(GraphNode.TYPE_TREASURE, {money: 1000}));
    addNode(new GraphNode(GraphNode.TYPE_END));
  }
}

