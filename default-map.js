colorMapper = function(hex) {
  switch (hex) {
    case '000000':
    case 'ffffff': return false; break;
    case '21bf64': return 1;
    case '-bf40c': return false; // black
    case 'f2f2f2': return false;
    case '278bce': return 2;
    case '273c51': return 4;
    case 'd97115': return 6; break; // goal color
    default: console.log('Oops, need to match ' + hex); return 5;
  }
}


var THE_MAP = window.THE_MAP = {};

var position = {x:0, y:0, z:0}; // Offset for the map loader

addVoxel = function(voxel, c) {
  var x = '' + voxel[0];
  var y = '' + voxel[1];
  var z = '' + voxel[2];

  if (THE_MAP[x] == null) THE_MAP[x] = {};
  if (THE_MAP[x][y] == null) THE_MAP[x][y] = {};
  THE_MAP[x][y][z] = c;
}

var voxels = [[-1,0,-1,"21bf64"],[-1,0,0,"21bf64"],[0,0,0,"21bf64"],[0,0,-1,"21bf64"],[0,0,-2,"21bf64"],[-1,0,-2,"21bf64"],[-2,0,-1,"21bf64"],[-2,0,0,"21bf64"],[-1,0,1,"21bf64"],[0,0,1,"21bf64"],[1,0,0,"21bf64"],[1,0,-1,"21bf64"],[9,0,-3,"-bf40c"],[9,1,-3,"-bf40c"],[9,2,-3,"-bf40c"],[8,0,9,"-bf40c"],[8,1,9,"-bf40c"],[8,2,9,"-bf40c"],[6,0,-10,"-bf40c"],[6,1,-10,"-bf40c"],[6,2,-10,"-bf40c"],[6,3,-10,"-bf40c"],[6,4,-10,"-bf40c"],[6,5,-10,"-bf40c"],[-10,0,-10,"-bf40c"],[-10,1,-10,"-bf40c"],[-10,2,-10,"-bf40c"],[-10,3,-10,"-bf40c"],[-10,4,-10,"-bf40c"],[-10,5,-10,"-bf40c"],[-10,6,-10,"-bf40c"],[-10,7,-10,"-bf40c"],[-10,8,-10,"-bf40c"],[-10,9,-10,"21bf64"],[-10,9,-9,"21bf64"],[-10,9,-2,"21bf64"],[-10,9,1,"21bf64"],[-10,9,6,"21bf64"],[-9,9,0,"-bf40c"],[-8,9,0,"-bf40c"],[-7,9,0,"-bf40c"],[-6,9,0,"-bf40c"],[-5,9,0,"-bf40c"],[-4,9,0,"-bf40c"],[-3,9,0,"-bf40c"],[-9,9,2,"-bf40c"],[-8,9,2,"-bf40c"],[-7,9,2,"-bf40c"],[-6,9,2,"-bf40c"],[-5,9,2,"-bf40c"],[-4,9,2,"-bf40c"],[-3,9,2,"-bf40c"],[-2,9,2,"-bf40c"],[-1,9,2,"-bf40c"],[0,9,2,"-bf40c"],[1,9,2,"-bf40c"],[2,9,2,"-bf40c"],[3,9,2,"-bf40c"],[4,9,2,"-bf40c"],[5,9,2,"-bf40c"],[6,9,2,"-bf40c"],[7,9,2,"-bf40c"],[8,9,2,"-bf40c"],[9,9,2,"21bf64"],[-9,9,-3,"-bf40c"],[-8,9,-3,"-bf40c"],[-7,9,-3,"-bf40c"],[-6,9,-3,"-bf40c"],[-5,9,-3,"21bf64"],[-9,9,-5,"-bf40c"],[-8,9,-5,"-bf40c"],[-7,9,-5,"-bf40c"],[-6,9,-5,"-bf40c"],[-5,9,-5,"-bf40c"],[-4,9,-5,"-bf40c"],[-3,9,-5,"-bf40c"],[-2,9,-5,"-bf40c"],[-1,9,-5,"21bf64"],[0,9,-5,"21bf64"],[-9,9,-6,"-bf40c"],[-8,9,-6,"-bf40c"],[-7,9,-6,"21bf64"],[-9,9,-8,"-bf40c"],[-8,9,-8,"-bf40c"],[-7,9,-8,"-bf40c"],[-6,9,-8,"-bf40c"],[-5,9,-8,"-bf40c"],[-4,9,-8,"-bf40c"],[-3,9,-8,"-bf40c"],[-2,9,-8,"-bf40c"],[-1,9,-8,"-bf40c"],[0,9,-8,"-bf40c"],[1,9,-8,"-bf40c"],[2,9,-8,"-bf40c"],[3,9,-8,"-bf40c"],[4,9,-8,"-bf40c"],[5,9,-8,"-bf40c"],[6,9,-8,"-bf40c"],[7,9,-8,"21bf64"],[4,9,-7,"21bf64"],[2,9,3,"21bf64"],[-4,9,3,"-bf40c"],[-4,9,4,"-bf40c"],[-4,9,5,"-bf40c"],[-3,9,4,"21bf64"],[-5,9,5,"21bf64"],[-4,9,6,"-bf40c"],[-4,9,7,"-bf40c"],[-4,9,8,"-bf40c"],[-3,9,7,"21bf64"],[-4,9,9,"21bf64"],[1,9,3,"-bf40c"],[1,9,4,"-bf40c"],[1,9,5,"-bf40c"],[1,9,6,"-bf40c"],[1,9,7,"-bf40c"],[1,9,8,"21bf64"],[-1,9,-4,"21bf64"],[8,3,9,"278bce"],[7,3,9,"278bce"],[6,3,9,"278bce"],[5,3,9,"278bce"],[9,3,-3,"278bce"],[9,3,-2,"278bce"],[9,3,-4,"278bce"],[6,6,-10,"273c51"],[5,6,-10,"273c51"],[-1,9,0,"d97115"],[0,9,0,"d97115"],[-1,9,-1,"d97115"],[0,9,-1,"d97115"],[-1,10,0,"d97115"],[-1,10,-1,"d97115"],[0,10,0,"d97115"],[0,10,-1,"d97115"],[1,9,0,"d97115"],[1,9,-1,"d97115"],[1,9,1,"d97115"],[0,9,1,"d97115"],[-1,9,1,"d97115"],[1,9,-2,"d97115"],[-1,9,-2,"d97115"],[0,9,-2,"d97115"],[-2,9,-2,"d97115"],[-2,9,-1,"d97115"],[-2,9,0,"d97115"],[-2,9,1,"d97115"]];var dimensions = [19,10,19];

voxels.map(function(voxel) {if (colorMapper(voxel[3])) { addVoxel([position.x + voxel[0], position.y + voxel[1], position.z + voxel[2]], colorMapper(voxel[3])) }});

module.exports = {
  textures: [
    ['grass', 'dirt', 'grass_dirt'],
    'obsidian',
    'brick',
    'grass',
    'plank',
    'whitewool',
    'whitewool-l',
    'whitewool-r',
    'whitewool-t',
    'whitewool-b'
  ],
  map: function(i,j,k) {
    var x = THE_MAP['' + i];
    if (!x) { return 0; }
    var y = x['' + j];
    if (!y) { return 0; }
    var z = y['' + k];
    return z || 0;
  }
}
