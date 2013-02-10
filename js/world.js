function GraphNode(type, contents) {
  this.type = type;
  this.contents = contents || {};
  this.index = -1;
}

GraphNode.TYPE_TREASURE = 'treasure';
GraphNode.TYPE_BOSS = 'boss';
GraphNode.TYPE_LOCK = 'lock';
GraphNode.TYPE_END = 'end';
GraphNode.TYPE_SHOP = 'shop';
GraphNode.TYPE_START = 'start';
GraphNode.TYPE_ROAD = 'road';

function Graph() {
  var scope = this;

  this.nodes = [];
  this.graphLength = 0;

  function addNode( node ) {
    node.index = scope.nodes.length;
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

    addNode(new GraphNode(GraphNode.TYPE_BOSS, { type: Monster.TYPE_BICHO, reward: { money:100 } } ));

    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_BOSS, { type: Monster.TYPE_SLIME, reward: { money:100 } } ));


    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));

    addNode(new GraphNode(GraphNode.TYPE_SHOP));

    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_ROAD));
    addNode(new GraphNode(GraphNode.TYPE_BOSS, { type: Monster.TYPE_TRONCHO, reward: { money: 1000 } } ));
    addNode(new GraphNode(GraphNode.TYPE_TREASURE, {money: 1000}));
    addNode(new GraphNode(GraphNode.TYPE_END));
  }
}

