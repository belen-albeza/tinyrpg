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
    slot.remove(slot.children[0]);
    slot.add(geometry);
  };

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

  }

  this.setPosition = function(x, y, z) {
    scope.position.x = x;
    scope.position.y = y;
    if (z != undefined) scope.position.z = z;
  };
}

HeroSprite.prototype = Object.create( THREE.Object3D.prototype );


