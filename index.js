var createGame = require('voxel-engine')
var toolbar = require('toolbar')
// var highlight = require('voxel-highlight')
// var toolbar = require('toolbar')
var player = require('voxel-player')
// var toolbar = require('toolbar')
var skin = require('minecraft-skin')
// var blockSelector = toolbar({el: '#tools'})
var voxel = require('voxel')
var voxelView = require('voxel-view');

var collideTerrain = require('./collide-terrain')
var mapConfig = require('./my-map')
var myMap = mapConfig.map
var myTextures = mapConfig.textures

var THREE = createGame.THREE;
var view = new voxelView(THREE, { ortho: true, width: window.innerWidth, height: window.innerHeight });

view.camera.position.z = 1000; // so the camera is never "inside" the voxels. Should change based on the min/max depth when camera is rotated
view.camera.scale.set(.5, .5, .5);

// Stupid negative modulo in JS
Number.prototype.mod = function(n) { return ((this%n)+n)%n; }

createGame.prototype.gravity = [0, -0.0000090, 0]
// other -
// bbox - player bbox
// vec -
// resting -
createGame.prototype.collideTerrain = collideTerrain;





// setup the game and add some trees
var game = createGame({
  view: view,
  generate: myMap,// voxel.generator['Hill'],
  chunkDistance: 2,
  materials: myTextures,
  worldOrigin: [0, 0, 0],
  controls: { discreteFire: true }
})

window.game = game // for debugging

var container = document.querySelector('#container')

game.appendTo(container)

// var maxogden = skin(game.THREE, 'maxogden.png')
// window.maxogden = maxogden
// maxogden.mesh.position.set(0, 2, -20)
// maxogden.head.rotation.y = 1.5
// maxogden.mesh.rotation.y = Math.PI
// maxogden.mesh.scale.set(0.04, 0.04, 0.04)
// game.scene.add(maxogden.mesh)
//

// create the player from a minecraft skin file and tell the
// game to use it as the main player
var createPlayer = player(game)
var substack = createPlayer('substack.png')
substack.possess()
var initialCoords = [0,5,0];
substack.yaw.position.set(initialCoords[0], initialCoords[1], initialCoords[2]);



var rotatingCameraTo = null;
var rotatingCameraDir = 0;

game.on('tick', function(){

  if (this.controlling.aabb().base[1] < -20) {
    alert('You died a horrible death. Try again.');
    this.controlling.moveTo(initialCoords[0], initialCoords[1], initialCoords[2]);
  }

  // player debugging
  boxes = ''

  var cameraType = this.controlling.rotation.y / Math.PI * 2;
  cameraType = Math.round(cameraType).mod(4);

  var cameraDir = 1;
  var cameraAxis;
  var cameraPerpendicAxis;
  if (cameraType >= 2) { cameraDir = -1; }
  if (cameraType.mod(2) == 0)  { cameraAxis = 0/*x*/; cameraPerpendicAxis = 2; }
  else                      { cameraAxis = 2/*z*/; cameraPerpendicAxis = 0; }

  playerX = Math.floor(this.controlling.aabb().base[cameraAxis]);
  playerY = Math.floor(this.controlling.aabb().base[1]);
  for (var i = -2; i <= 2; i++) {
    for (var j = -2; j <= 2; j++) {
      boxY = playerY + (-1 * i);
      boxX = playerX + (j);
      var block = this.sparseCollisionMap[cameraType]['' + boxX + '|' + boxY];
      if (block) {
        if (block < 10) {
          boxes += '0' + block;
        } else {
          boxes += block;
        }
      } else {
        boxes += '--';
      }
      if    (i == 0 && j == -1) { boxes += '['; }
      else if (i ==0 && j == 0) { boxes += ']'; }
      else {boxes += ' ';}

    }
    boxes += '<br/>'
  }
  boxes += 'me = [' + Math.floor(this.controlling.aabb().base[0]) + ', ' + Math.floor(this.controlling.aabb().base[1]) + ', ' + Math.floor(this.controlling.aabb().base[2]) + ']';
  boxes += '<br/>cameraAxis = ' + cameraAxis;
  boxes += '<br/>cameraDir = ' + cameraDir;

  document.getElementById('player-boxes').innerHTML = boxes;

  if (rotatingCameraDir) {
    game.controlling.rotation.y += rotatingCameraDir * Math.PI / 50;

    if (rotatingCameraDir > 0 && game.controlling.rotation.y - rotatingCameraTo > 0) {
      game.controlling.rotation.y = rotatingCameraTo;
      rotatingCameraDir = 0;
    }

    if (rotatingCameraDir < 0 && game.controlling.rotation.y - rotatingCameraTo < 0) {
      game.controlling.rotation.y = rotatingCameraTo;
      rotatingCameraDir = 0;
    }

  }
})


window.addEventListener('keydown', function(ev) {
  if (ev.keyCode === 'Q'.charCodeAt(0)) {
    // Rotating the avatar implicitly rotates the camera in it's head
    // snap to 90degrees
    y = game.controlling.rotation.y;
    y = Math.round(y * 2 / Math.PI);
    y -= 1;
    console.log('rotating to ', y);
    rotatingCameraDir = -1;
    rotatingCameraTo = y * Math.PI / 2;
    //game.controlling.rotation.y = y * Math.PI / 2;
    game.controlling.rotation.x = 0;
    game.controlling.rotation.z = 0;
    // buildCollisionMap(y);
  }

  if (ev.keyCode === 'E'.charCodeAt(0)) {
    // snap to 90degrees
    y = game.controlling.rotation.y;
    y = Math.round(y * 2 / Math.PI);
    y += 1;
    console.log('rotating to ', y);
    rotatingCameraDir = 1;
    rotatingCameraTo = y * Math.PI / 2;
    // game.controlling.rotation.y = y * Math.PI / 2;
    game.controlling.rotation.x = 0;
    game.controlling.rotation.z = 0;
    // buildCollisionMap(y);
  }

})


var buildCollisionMap = function() {
  game.sparseCollisionMap = [{}, {}, {}, {}];
  for (var dir = 0; dir < 4; dir++) {

    // dir is 0, 1, 2, 3 depending on the rotation
    // build a sparse array for each location
    for (var y = 0; y < 50; y++) { // 20 is enough for the top of the hill

      for (var a = -50; a < 50; a++) {
        var block = null;
        var prevBlockBelow = null;
        for (var b = -50; b < 50; b++) {
          var pos;
          var B = b;
          if (dir < 2) { B = -b; }
          if (dir % 2 == 0) {pos = [a, y, B]; }
          if (dir % 2 == 1) {pos = [B, y, a]; }

          block = game.getBlock(pos);
          if (block) { break; }
        }
        if (block) {
          game.sparseCollisionMap[dir]['' + a + '|' + y] = B
        }
      }
    }
  }

};

// Build initial collision map
buildCollisionMap();
