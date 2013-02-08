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
  this.nodes = [];

  this.generate = function() {
    this.nodes.push(new GraphNode(GraphNode.TYPE_START), 3);
    this.nodes.push(new GraphNode(GraphNode.TYPE_TREASURE), 2);
    this.nodes.push(new GraphNode(GraphNode.TYPE_SHOP), 8);
    this.nodes.push(new GraphNode(GraphNode.TYPE_LOCK), 0);
    this.nodes.push(new GraphNode(GraphNode.TYPE_BOSS), 0);
    this.nodes.push(new GraphNode(GraphNode.TYPE_TREASURE), 0);
    this.nodes.push(new GraphNode(GraphNode.TYPE_END), 0);
  }
}

