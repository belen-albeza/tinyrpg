function MapSprite(size, nodes) {
  var scope = this;
  generateGeometry();

  function generateGeometry() {
    var colors = [];
    colors[GraphNode.TYPE_START] =  0xffffff;
    colors[GraphNode.TYPE_END] = 0x00ffff;
    colors[GraphNode.TYPE_TREASURE] = 0xffff00;
    colors[GraphNode.TYPE_BOSS] =  0xff0000;
    colors[GraphNode.TYPE_LOCK] =  0xcccccc;
    colors[GraphNode.TYPE_SHOP] =  0x00ff0;

    scope.graph = new Graph();
    scope.graph.generate();

    var size = 50;
    var quad = new THREE.CubeGeometry(size, size, size);

    scope.rootDrawable = new THREE.Object3D();
    var offsetX = 0;
    scope.graph.nodes.forEach(function(node) {
      var material = new THREE.MeshBasicMaterial({
        color: colors[node.type]});
      var drawable = new THREE.Mesh(quad, material);
      drawable.position.set(offsetX, 0, 1);
      scope.rootDrawable.add(drawable);

      offsetX += (node.distance + 1) * size;
    });

    var line = new THREE.Mesh(new THREE.CubeGeometry(offsetX, size / 4, size),
                              new THREE.MeshBasicMaterial({color: 0x666666}));
    line.position.x = offsetX / 2 - size / 2;
    scope.rootDrawable.add(line);
  }
}

function HeroSprite(size) {
  var scope = this;
  generateGeometry();

  function generateGeometry() {
    scope.rootDrawable = new THREE.Mesh(new THREE.SphereGeometry(size / 2),
                                        new THREE.MeshBasicMaterial({
                                          color: 0xff00ff}));
  }

  this.setPosition = function(x, y, z) {
    scope.rootDrawable.position.x = x;
    scope.rootDrawable.position.y = y;
    if (z != undefined) scope.rootDrawable.position.z = z;
  };
}

