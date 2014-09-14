# other -
# bbox - player bbox
# vec -
# resting -

# collideTerrain
module.exports = (other, bbox, vec, resting) ->
  self = this
  axes = [
    "x"
    "y"
    "z"
  ]
  vec3 = [
    vec.x
    vec.y
    vec.z
  ]
  hit = (axis, tile, coords, dir, edge) ->

    # Collision cases:
    #
    #    - I am falling and there is a flattened block below me: move my depth
    #    - I am walking and there is a flattened block next to me: move me in front of that block (may start falling)
    #    - walking and I am behind a block: do not move my depth
    #
    #
    newDepth = null
    cameraType = @controlling.rotation.y / Math.PI * 2
    cameraType = Math.round(cameraType).mod(4)
    scaleJustToBeSafe = 1.5
    cameraDir = 1
    cameraAxis = undefined
    cameraPerpendicAxis = undefined
    cameraDir = -1  if cameraType >= 2
    if cameraType.mod(2) is 0 #x
      cameraAxis = 0
      cameraPerpendicAxis = 2
    else #z
      cameraAxis = 2
      cameraPerpendicAxis = 0
    y = coords[1]
    blockDepth = @sparseCollisionMap[cameraType]["" + coords[cameraAxis] + "|" + y]
    belowBlockDepth = @sparseCollisionMap[cameraType]["" + coords[cameraAxis] + "|" + (y - 1)]
    myBlock = @sparseCollisionMap[cameraType]["" + Math.floor(bbox.base[cameraAxis]) + "|" + y]
    isCameraAxis = axis is cameraAxis
    isVectorAxis = vec3[axis] isnt 0

    # isDirOfMovement = dir * vec3[cameraAxis] > 0;
    isBehind = (depth) ->
      cameraDir * (bbox.base[cameraPerpendicAxis] - depth) < 0

    isInside = (depth) ->
      Math.floor(bbox.base[cameraPerpendicAxis]) is depth


    # Collision cases:
    #
    #    - I am falling and there is a flattened block below me: move my depth
    #    - I am walking and there is a flattened block next to me: move me in front of that block
    #    - walking and I am behind a block: do not move my depth
    #
    #
    if isVectorAxis
      if axis is 1 and dir is -1

        # I am falling ...
        if blockDepth? and coords[1] isnt Math.floor(bbox.base[1]) # the last bit checks to make sure we are actually falling instead of just checking the current voxel where the player is.
          # .. and there is a flattened block below me
          # console.log('falling and block below');

          # If I am going to land on ground then do not change the depth
          unless tile
            console.log "fallingg......"
            newDepth = blockDepth + 0.5
            tile = true # HACK to tell the game there's a collision
      else if isCameraAxis and not isBehind(myBlock) and blockDepth?

        # I am walking and there is a flattened block next to me
        console.log "walking and block next to me"
        newDepth = blockDepth + cameraDir + 0.5  if isBehind(blockDepth) or isInside(blockDepth)
        tile = false
      else if isCameraAxis and isBehind(myBlock)

        # I am walking and I am behind a block
        console.log "walking behind a block"
        tile = false
    if newDepth? and newDepth isnt @controlling.aabb().base[cameraPerpendicAxis]
      newCoords = @controlling.aabb().base
      newCoords[cameraPerpendicAxis] = newDepth
      console.log "moving from:", @controlling.aabb().base
      console.log "moving to  :", newCoords
      @controlling.moveTo newCoords[0], newCoords[1], newCoords[2]
    return  unless tile

    # boilerplate code?
    return if Math.abs(vec3[axis]) < Math.abs(edge)
    vec3[axis] = vec[axes[axis]] = edge
    other.acceleration[axes[axis]] = 0
    resting[axes[axis]] = dir
    other.friction[axes[(axis + 1) % 3]] = other.friction[axes[(axis + 2) % 3]] = (if axis is 1 then self.friction else 1)
    true

  @collideVoxels bbox, vec3, hit.bind(this)
  return
