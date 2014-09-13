module.exports = new class MovementHelper
  isWalking: ->
    state = window.game.controls.state
    state.left or state.right

  isRunning: ->
    false

  isJumping: ->
    window.game.controlling.velocity.y > 0
