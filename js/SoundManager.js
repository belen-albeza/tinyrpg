/*
 * toLoad = [ { url: 'data/sound.wav', name: sound } ]
 */ 
function SoundManager( toLoad ) {
  var scope = this,
    audioElements = {},
    soundsToLoad = [];

  toLoad.forEach(function( sound ) {
    soundsToLoad.push({ url: sound.url, name: sound.name, loaded: false });
  });

  loadNextSound();

  function loadNextSound() {

    if( soundsToLoad.length == 0 ) {
      return;
    }

    var soundToLoad = soundsToLoad.shift(),
      audioElement = document.createElement( 'audio' ),
      sourceElement = document.createElement( 'source' );

    audioElement.preload = 'auto';

    audioElement.addEventListener( 'canplaythrough', function onAudioLoaded() {
      audioElement.removeEventListener( 'canplaythrough', onAudioLoaded, false );
      soundToLoad.loaded = true;
      soundToLoad.audioElement = audioElement;
      audioElements[ soundToLoad.name ] = soundToLoad;
      loadNextSound();
    }, false );
      
    sourceElement.src = soundToLoad.url;
    audioElement.appendChild( sourceElement );
    audioElement.load();

    document.body.appendChild( audioElement );

    if( soundsToLoad.length > 0) {
      loadNextSound();
    }

  }

  this.playSound = function( soundName ) {
    var sound = audioElements[ soundName ];
    if( sound === undefined ) {
      return;
    }

    scope.stopSound( soundName );

    var cloned = sound.audioElement.cloneNode( true );
    sound.clonedElement = cloned;
    cloned.play();
  }

  this.stopSound = function( soundName ) {
    var sound = audioElements[ soundName ];
    if( sound === undefined ) {
      return;
    }
    if ( sound.clonedElement !== undefined ) {
      sound.clonedElement.pause();
    }
  }
}
