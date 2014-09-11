// other -
// bbox - player bbox
// vec -
// resting -

// collideTerrain
module.exports = function(other, bbox, vec, resting) {
  var self = this
  var axes = ['x', 'y', 'z']
  var vec3 = [vec.x, vec.y, vec.z]
  var hit = function (axis, tile, coords, dir, edge) {
    /* Collision cases:

    - I am falling and there is a flattened block below me: move my depth
    - I am walking and there is a flattened block next to me: move me in front of that block (may start falling)
    - walking and I am behind a block: do not move my depth

    */

    var newDepth = null;

    var cameraType = this.controlling.rotation.y / Math.PI * 2;
    cameraType = Math.round(cameraType).mod(4);

    var scaleJustToBeSafe = 1.5;
    var cameraDir = 1;
    var cameraAxis;
    var cameraPerpendicAxis;
    if (cameraType >= 2) { cameraDir = -1; }
    if (cameraType.mod(2) == 0)  { cameraAxis = 0/*x*/; cameraPerpendicAxis = 2; }
    else                         { cameraAxis = 2/*z*/; cameraPerpendicAxis = 0; }

    y = coords[1];
    blockDepth = this.sparseCollisionMap[cameraType]['' + coords[cameraAxis] + '|' + y];
    belowBlockDepth = this.sparseCollisionMap[cameraType]['' + coords[cameraAxis] + '|' + (y - 1)];
    myBlock = this.sparseCollisionMap[cameraType]['' + Math.floor(bbox.base[cameraAxis]) + '|' + y];


    isCameraAxis = axis == cameraAxis;
    isVectorAxis = vec3[axis] != 0;
    // isDirOfMovement = dir * vec3[cameraAxis] > 0;


    var isBehind = function(depth) {
      return cameraDir * (bbox.base[cameraPerpendicAxis] - depth) < 0;
    }

    var isInside = function(depth) {
      return Math.floor(bbox.base[cameraPerpendicAxis]) == depth;
    }


    /* Collision cases:

    - I am falling and there is a flattened block below me: move my depth
    - I am walking and there is a flattened block next to me: move me in front of that block
    - walking and I am behind a block: do not move my depth

    */

    if (isVectorAxis) {
      if (axis == 1 && dir == -1) {
        // I am falling ...
        if (blockDepth != null && coords[1] != Math.floor(bbox.base[1])) { // the last bit checks to make sure we are actually falling instead of just checking the current voxel where the player is.
          // .. and there is a flattened block below me
          // console.log('falling and block below');

          // If I am going to land on ground then do not change the depth
          if (!tile) {
            console.log('fallingg......');
            newDepth = blockDepth + 0.5;
            tile = true; // HACK to tell the game there's a collision
          }
        }
      }

      else if (isCameraAxis && !isBehind(myBlock) && blockDepth != null) {
        // I am walking and there is a flattened block next to me
        console.log('walking and block next to me');
        if (isBehind(blockDepth) || isInside(blockDepth)) {
          newDepth = blockDepth + cameraDir + 0.5
        }
        tile = false;
      }

      else if (isCameraAxis && isBehind(myBlock)) {
        // I am walking and I am behind a block
        console.log('walking behind a block');
        tile = false;
      }

    }

    if (newDepth != null && newDepth != this.controlling.aabb().base[cameraPerpendicAxis]) {
      var newCoords = this.controlling.aabb().base;
      newCoords[cameraPerpendicAxis] = newDepth;
      console.log('moving from:', this.controlling.aabb().base);
      console.log('moving to  :', newCoords);
      this.controlling.moveTo(newCoords[0], newCoords[1], newCoords[2]);
    }


    if (!tile) { return; }


    // boilerplate code?
    if (Math.abs(vec3[axis]) < Math.abs(edge)) return
    vec3[axis] = vec[axes[axis]] = edge
    other.acceleration[axes[axis]] = 0
    resting[axes[axis]] = dir
    other.friction[axes[(axis + 1) % 3]] = other.friction[axes[(axis + 2) % 3]] = axis === 1 ? self.friction  : 1
    return true
  };
  this.collideVoxels(bbox, vec3, hit.bind(this));
}
