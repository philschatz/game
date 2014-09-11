defaultMap = require('./default-map');

var THE_MAP = window.THE_MAP = {};

addVoxel = function(x, y, z, c) {
  c = c + 1;

  var x = '' + x;
  var y = '' + y;
  var z = '' + z;

  if (THE_MAP[x] == null) THE_MAP[x] = {};
  if (THE_MAP[x][y] == null) THE_MAP[x][y] = {};
  THE_MAP[x][y][z] = c;
}

getVoxel = function(i,j,k) {
  var x = THE_MAP['' + i];
  if (!x) { return 0; }
  var y = x['' + j];
  if (!y) { return 0; }
  var z = y['' + k];
  return z || 0;
}

// https://gist.github.com/665235
function decode( string ) {
  var output = []
  string.split('').forEach( function ( v ) { output.push( "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf( v ) ) } )
  return output
}

function buildFromHash() {
  var hashMask = null;

  var hash = window.location.hash.substr( 1 ),
  hashChunks = hash.split(':'),
  chunks = {}

  animationFrames = []
  for( var j = 0, n = hashChunks.length; j < n; j++ ) {
    chunk = hashChunks[j].split('/')
    chunks[chunk[0]] = chunk[1]
  }

  if ( chunks['C'] )
  {
    // Ignore colors
  }
  var frameMask = 'A'

  if ( (!hashMask || hashMask == frameMask) && chunks[frameMask] ) {
    // decode geo
    var current = { x: 0, y: 0, z: 0, c: 0 }
    var data = decode( chunks[frameMask] )
    var i = 0, l = data.length

    while ( i < l ) {

      var code = data[ i ++ ].toString( 2 )
      if ( code.charAt( 1 ) == "1" ) current.x += data[ i ++ ] - 32
      if ( code.charAt( 2 ) == "1" ) current.y += data[ i ++ ] - 32
      if ( code.charAt( 3 ) == "1" ) current.z += data[ i ++ ] - 32
      if ( code.charAt( 4 ) == "1" ) current.c += data[ i ++ ] - 32
      if ( code.charAt( 0 ) == "1" ) {
        addVoxel(current.x, current.y, current.z, current.c)
      }
    }
  }
}

module.exports = function() {
  buildFromHash();
  return {
    map: getVoxel,
    textures: defaultMap.textures
  }
};
