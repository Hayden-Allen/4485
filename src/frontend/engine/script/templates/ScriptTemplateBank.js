import lunr from 'lunr'
import { global } from '%engine/Global.js'
import BlankScript from '%script/templates/BlankScript.js'
import TopDownMove from '%script/templates/TopDownMove.js'
import PlatformerMove from '%script/templates/PlatformerMove.js'
import PlatformerJump from '%script/templates/PlatformerJump.js'
import ChangeStateOnKey from '%script/templates/ChangeStateOnKey.js'
import MaxSpeedX from '%script/templates/MaxSpeedX.js'
import MaxSpeedY from '%script/templates/MaxSpeedY.js'
import MinVelocityX from '%script/templates/MinVelocityX.js'
import MaxVelocityX from '%script/templates/MaxVelocityX.js'
import MinVelocityY from '%script/templates/MinVelocityY.js'
import MaxVelocityY from '%script/templates/MaxVelocityY.js'
import ConstantVelocityX from '%script/templates/ConstantVelocityX.js'
import ChangeStateOnCollideX from '%script/templates/ChangeStateOnCollideX.js'
import CameraFollow from '%script/templates/CameraFollow.js'
import SetAnimationFromVelocityX from '%script/templates/SetAnimationFromVelocityX.js'
import Pickup from '%script/templates/Pickup.js'
import ChangeStateAfterTime from '%script/templates/ChangeStateAfterTime.js'
import DestroySelfOnSwitch from '%script/templates/DestroySelfOnSwitch.js'
import SetTimeOnSwitch from '%script/templates/SetTimeOnSwitch.js'
import PlaySoundOnSwitch from '%script/templates/PlaySoundOnSwitch.js'
import CircularMove from '%script/templates/CircularMove.js'
/*
import PongMove from '%script/templates/PongMove.js'
import PongScore from '%script/templates/PongScore.js'
import PongBall from '%script/templates/PongBall.js'
*/

class ScriptTemplateInfo {
  constructor(description, script) {
    this.name = script.name
    this.description = description
    this.script = script
  }
}

export const blankScriptTemplate = new ScriptTemplateInfo(
  'Create a custom script from scratch',
  BlankScript
)

export const scriptTemplateBank = global.alphabetSort([
  new ScriptTemplateInfo(
    'Changes to a new state when a key is pressed',
    ChangeStateOnKey
  ),
  new ScriptTemplateInfo('Jumps', PlatformerJump),
  new ScriptTemplateInfo('Moves your character with AD', PlatformerMove),
  new ScriptTemplateInfo('Moves your character with WASD', TopDownMove),
  new ScriptTemplateInfo('Sets maximum x-axis speed', MaxSpeedX),
  new ScriptTemplateInfo('Sets maximum y-axis speed', MaxSpeedY),
  new ScriptTemplateInfo('Sets maximum left x-axis velocity', MinVelocityX),
  new ScriptTemplateInfo('Sets maximum right x-axis velocity', MaxVelocityX),
  new ScriptTemplateInfo('Sets maximum downward y-axis velocity', MinVelocityY),
  new ScriptTemplateInfo('Sets maximum upward y-axis velocity', MaxVelocityY),
  new ScriptTemplateInfo(
    'Sets X velocity to a constant value',
    ConstantVelocityX
  ),
  new ScriptTemplateInfo(
    'Changes to given state when entity collides on the X axis (useful for bouncing between walls)',
    ChangeStateOnCollideX
  ),
  new ScriptTemplateInfo('Makes the camera follow this entity', CameraFollow),
  new ScriptTemplateInfo(
    'Sets animation based on x velocity',
    SetAnimationFromVelocityX
  ),
  new ScriptTemplateInfo(
    'Destroy an item and play a sound when collected',
    Pickup
  ),
  new ScriptTemplateInfo(
    'Destroys this entity when it switches to the attached state',
    DestroySelfOnSwitch
  ),
  new ScriptTemplateInfo(
    'Sets a variable to the current time when this entity switches to the attached state',
    SetTimeOnSwitch
  ),
  new ScriptTemplateInfo(
    'Changes to another state after specified duration',
    ChangeStateAfterTime
  ),
  new ScriptTemplateInfo(
    'Plays a sound when this entity switches to the attached state',
    PlaySoundOnSwitch
  ),
  new ScriptTemplateInfo('Move in a circle at a fixed speed', CircularMove),
  /*
  new ScriptTemplateInfo('Move up or down', PongMove),
  new ScriptTemplateInfo('Score when the ball hits the back wall', PongScore),
  new ScriptTemplateInfo('Bounce when hitting walls or players', PongBall),
  */
])

export const scriptTemplateIndex = lunr(function () {
  this.field('name')
  this.field('description')
  this.ref('id')

  scriptTemplateBank.forEach((info, i) => {
    this.add({
      id: i,
      name: info.name,
      description: info.description,
    })
  })
})
