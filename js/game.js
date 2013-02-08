function Map() {
  this.graph = new Graph();
  this.graph.generate();

  

  this.draw = function() {

  }
}


function Game(container) {
  var scope = this;

  function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    scope.camera.left = -width / 2;
    scope.camera.right = width / 2;
    scope.camera.top = height / 2;
    scope.camera.bottom = -height / 2;
    scope.camera.updateProjectionMatrix();

    scope.renderer.setSize(width, height);
  }

  this.start = function() {
    scope.map = new Map();
    scope.renderer = new THREE.WebGLRenderer({
      clearColor: 0x000000,
      clearAlpha: 1
    });
    //scope.renderer = new THREE.WebGLRenderer({ antialias: true });
    //scope.renderer.setSize( 320, 240 );
    //scope.renderer.setClearColorHex( 0x000000, 1 );
    scope.scene = new THREE.Scene();
    scope.camera = new THREE.OrthographicCamera(-320, 320, 200, -200, 1, 1000);
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();

    container.appendChild(scope.renderer.domElement);
    scope.render();
  };

  this.update = function() {

  };

  this.render = function() {
    requestAnimationFrame(scope.render);
    scope.renderer.render(scope.scene, scope.camera);
  };
}


