function Game(container) {
  var scope = this;
  var TILE_SIZE = 50;

  function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var cameraTarget = new THREE.Vector3(0, 0, 0);

    scope.camera.left = 0;
    scope.camera.right = width;
    scope.camera.top = 0;
    scope.camera.bottom = height;
    scope.camera.updateProjectionMatrix();
    scope.camera.position.z = 100;
    scope.camera.lookAt(cameraTarget);

    scope.renderer.setSize(width, height);

    scope.rootDrawable.position.x = TILE_SIZE;
    scope.rootDrawable.position.y = height / 2;
  }

  function onKeyUp( e ) {
    var keyCode = e.keyCode;

    if( keyCode == 37 ) {
      scope.hero.moveBackwards();
    } else if( keyCode == 39 ) {
      scope.hero.moveForward();
    }
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

    scope.rootDrawable = new THREE.Object3D();
    scope.scene.add(scope.rootDrawable);

    scope.map = new Map(TILE_SIZE);
    scope.rootDrawable.add(scope.map.sprite);

    scope.hero = new Hero( scope.map );
    scope.rootDrawable.add(scope.hero.sprite);

	scope.rootDrawable.add( buildAxes( 1000 ) );

    onWindowResize();
    scope.render();

    setInterval(scope.update, 1000.0 / 30.0);

    window.addEventListener( 'keyup', onKeyUp, false );
  };

  this.update = function() {
  };

  this.render = function() {
    requestAnimationFrame(scope.render);
    scope.renderer.render(scope.scene, scope.camera);
  };
}


