function MapSprite(size, nodes) {
  var scope = this;
  var quad = new THREE.PlaneGeometry(size, size), offsetX = 0;

  THREE.Object3D.call( this );

  generateGeometry();

  function generateNodeGeometry(node) {
    var colors = [];
    colors[GraphNode.TYPE_START] =  0xffffff;
    colors[GraphNode.TYPE_END] = 0x00ffff;
    colors[GraphNode.TYPE_TREASURE] = 0xffff00;
    colors[GraphNode.TYPE_BOSS] =  0xff0000;
    colors[GraphNode.TYPE_LOCK] =  0xcccccc;
    colors[GraphNode.TYPE_SHOP] =  0x00ff00;

    var drawable = null;
    if (node.type != GraphNode.TYPE_ROAD) {
      var material = new THREE.MeshBasicMaterial({color: colors[node.type]});
      drawable = new THREE.Mesh(quad, material);
      drawable.rotation.x = - Math.PI;
    }
    return drawable;
  }

  this.updateGeometry = function(index) {
    var geometry = generateNodeGeometry(nodes[index]);
    var slot = scope.slots.children[index];
	var existingGeometry = slot,
		easing = TWEEN.Easing.Exponential.Out,
		duration = 500;

	var s = 0.01;
	var tweenDisappear = null,
		tweenAppear = null,
		tweenFinalScale = null;

	tweenDisappear = new TWEEN.Tween( existingGeometry.scale )
		.to({ x: s, y: s }, duration)
		.easing( TWEEN.Easing.Exponential.Out )
		.onComplete( function() {
			while( slot.children.length > 0 ) {
				slot.remove( slot.children[0] );
			}
			
			slot.add( geometry );
		} );

	tweenFinalScale = new TWEEN.Tween( existingGeometry.scale )
		.to({ x: 1, y: 1}, duration/2)
		.easing( TWEEN.Easing.Exponential.Out );

	tweenAppear = new TWEEN.Tween( existingGeometry.scale )
		.to({ x: 1.5, y: 1.5 }, duration )
		.easing( TWEEN.Easing.Elastic.In )
		.chain( tweenFinalScale );


	tweenDisappear.chain( tweenAppear ).start();

  };
  
  this.getSlotSprite = function( index ) {
    return scope.slots.children[index];
  }

  function generateGeometry() {
    scope.graph = new Graph();
    scope.graph.generate();

    scope.slots = new THREE.Object3D();
    scope.add( scope.slots );

    scope.graph.nodes.forEach(function(node) {
      var slot = new THREE.Object3D(),
          drawable = generateNodeGeometry(node);

      slot.add(drawable);
      slot.position.set(offsetX, 0, 1);
      scope.slots.add( slot );
      offsetX += 1 * size;
    });

    var line = new THREE.Mesh(new THREE.PlaneGeometry(offsetX, size / 4, size ),
                              new THREE.MeshBasicMaterial({color: 0x666666 }));
    line.position.x = offsetX / 2 - size / 2;
    line.rotation.x = - Math.PI;
    scope.add( line );
  }
}

MapSprite.prototype = Object.create( THREE.Object3D.prototype );

function HeroSprite(size) {
  var scope = this;

  THREE.Object3D.call( this );

  generateGeometry();

  function generateGeometry() {
    var geometry = new THREE.PlaneGeometry( size, size ),
        material = new THREE.MeshBasicMaterial({ color: 0xff00ff }),
        mesh = new THREE.Mesh( geometry, material );

    scope.add( mesh );
    mesh.rotation.x = - Math.PI;

    scope.energyBar = new ProgressBar(size, size / 10, 0x00ff00);
    scope.energyBar.position.y = -size;
    scope.add(scope.energyBar);
  }

  this.setPosition = function(x, y, z) {
    scope.position.x = x;
    scope.position.y = y;
    if (z != undefined) scope.position.z = z;
  };
}

HeroSprite.prototype = Object.create( THREE.Object3D.prototype );

function ProgressBar(width, height, color) {
  var scope = this;
  THREE.Object3D.call( this );

  var geometry = new THREE.PlaneGeometry(width, height);
  var material = new THREE.MeshBasicMaterial({color: color});
  var mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI;

  this.add(mesh);

  this.setValue = function(value) {
    mesh.scale.x = value || 0.0001;
    mesh.position.x = -(width - (value * width)) / 2;
  }; 
}


ProgressBar.prototype = Object.create ( THREE.Object3D.prototype );
