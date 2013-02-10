function MapSprite(size, nodes) {
  var scope = this;
  var offsetX = 0;
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
    var textures = {};
    textures[GraphNode.TYPE_BOSS] = {};
    textures[GraphNode.TYPE_BOSS][Monster.TYPE_BICHO] = 'bicho1.png';
    textures[GraphNode.TYPE_BOSS][Monster.TYPE_SLIME] = 'bicho2.png';
    textures[GraphNode.TYPE_BOSS][Monster.TYPE_TRONCHO] = 'bicho1.png';

    var drawable = null;
    var materialOptions = {color: colors[node.type]};
    if (node.type != GraphNode.TYPE_ROAD) {
      var texture = null;
      if (textures[node.type]) {
        var url = '/data/images/';
        url += (node.type == GraphNode.TYPE_BOSS) ?
          textures[node.type][node.contents.type] : textures[node.type];
        var texture = THREE.ImageUtils.loadTexture(url);
        materialOptions = {
          map: texture,
          color: 0xffffff,
          transparent: true
        };
      }

      console.log(materialOptions);
      var material = new THREE.MeshBasicMaterial(materialOptions);
      var geometry = new THREE.PlaneGeometry(size, size);
      drawable = new THREE.Mesh(geometry, material);
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

    var roadTexture = THREE.ImageUtils.loadTexture('data/road_texture.jpg' );
    var line = new THREE.Mesh(new THREE.PlaneGeometry( offsetX, size ),
                              new THREE.MeshBasicMaterial({
                                color: 0xffffff, map: roadTexture
                              }));
    line.position.x = offsetX / 2 - size / 2;
    line.rotation.x = - Math.PI;
    scope.add( line );

  roadTexture.wrapT = THREE.RepeatWrapping;
  roadTexture.wrapS = THREE.RepeatWrapping;
  roadTexture.repeat.set( scope.slots.children.length, 1 );
  }
}

MapSprite.prototype = Object.create( THREE.Object3D.prototype );

function HeroSprite(size) {
  var scope = this;

  THREE.Object3D.call( this );

  generateGeometry();

  function generateGeometry() {
    var texture = THREE.ImageUtils.loadTexture( 'data/images/hero.png' ),
        geometry = new THREE.PlaneGeometry( size, size ),
        material = new THREE.MeshBasicMaterial({
          color: 0xffffff, map: texture, transparent: true }),
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
  var tween = null;
  mesh.rotation.x = -Math.PI;

  this.add(mesh);

  this.setValue = function(value) {
 
  var finalX = value || 0.0001;

  if( tween !== null ) {
    tween.stop();
  }
  
  tween = new TWEEN.Tween( mesh.scale )
    .to({ x: finalX }, 200 )
    .easing( TWEEN.Easing.Exponential.InOut )
    .onUpdate(function() {
      mesh.position.x = -width * (1 - mesh.scale.x) * 0.5;
    })
    .start();

  }; 
}


ProgressBar.prototype = Object.create ( THREE.Object3D.prototype );
