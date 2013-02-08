function Map(size) {
  var scope = this;

  console.log(GraphNode);
  console.log(GraphNode.TYPE_START);
  
  var colors = [];
  colors[GraphNode.TYPE_START] =  0xffffff;
  colors[GraphNode.TYPE_END] = 0x00ffff;
  colors[GraphNode.TYPE_TREASURE] = 0xffff00;
  colors[GraphNode.TYPE_BOSS] =  0xff0000;
  colors[GraphNode.TYPE_LOCK] =  0xcccccc;
  colors[GraphNode.TYPE_SHOP] =  0x00ff0;

  this.graph = new Graph();
  this.graph.generate();


  var size = 50;
  var quad = new THREE.CubeGeometry(size, size, size);

  this.rootDrawable = new THREE.Object3D();
  var offsetX = 0;
  console.log(scope.graph.nodes);
  scope.graph.nodes.forEach(function(node) {
    var material = new THREE.MeshBasicMaterial({
      color: colors[node.type]});
    var drawable = new THREE.Mesh(quad, material);
    drawable.position.set(offsetX, 0, 1);
    scope.rootDrawable.add(drawable);

    console.log(node.type, offsetX);

    offsetX += (node.distance + 1) * size;
  });

  var line = new THREE.Mesh(new THREE.CubeGeometry(offsetX, size / 4, size),
                            new THREE.MeshBasicMaterial({color: 0xaaaaaa}));
  line.position.x = offsetX / 2 - size / 2;
  scope.rootDrawable.add(line);
}


function Game(container) {
  var scope = this;
  var TILE_SIZE = 50;

  function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var cameraTarget = new THREE.Vector3(0, 0, 0);

    scope.camera.left = 0;
    scope.camera.right = width;
    scope.camera.top = 0 //height / 2;
    scope.camera.bottom = height; //-height / 2;
    scope.camera.updateProjectionMatrix();
    scope.camera.position.z = 100;
    scope.camera.lookAt(cameraTarget);

    scope.renderer.setSize(width, height);

    scope.map.rootDrawable.position.x = TILE_SIZE;
    scope.map.rootDrawable.position.y = height / 2;
  }

  this.start = function() {
    scope.renderer = new THREE.WebGLRenderer({
      clearColor: 0x000000,
      clearAlpha: 1
    });
    scope.scene = new THREE.Scene();
    scope.camera = new THREE.OrthographicCamera(-320, 320, 200, -200, 1, 1000);
    window.addEventListener('resize', onWindowResize, false);
    container.appendChild(scope.renderer.domElement);

    scope.map = new Map(TILE_SIZE);
    scope.scene.add(scope.map.rootDrawable);

    onWindowResize();
    scope.render();
  };

  this.update = function() {

  };

  this.render = function() {
    requestAnimationFrame(scope.render);
    scope.renderer.render(scope.scene, scope.camera);
  };
}


