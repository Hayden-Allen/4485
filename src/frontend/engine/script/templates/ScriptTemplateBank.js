import lunr from 'lunr'
import { global } from '%engine/Global.js'
import BlankScript from '%script/templates/BlankScript.js'
import TopDownMove from '%script/templates/TopDownMove.js'
import PlatformerMove from '%script/templates/PlatformerMove.js'
import PlatformerMove2 from '%script/templates/PlatformerMove2.js'
import PlatformerJump from '%script/templates/PlatformerJump.js'
import ChangeStateOnKey from '%script/templates/ChangeStateOnKey.js'
import MaxSpeedX from '%script/templates/MaxSpeedX.js'
import MaxSpeedY from '%script/templates/MaxSpeedY.js'
import MinVelocityX from '%script/templates/MinVelocityX.js'
import MaxVelocityX from '%script/templates/MaxVelocityX.js'
import MinVelocityY from '%script/templates/MinVelocityY.js'
import MaxVelocityY from '%script/templates/MaxVelocityY.js'
import HitWall from '%script/templates/HitWall.js'
import BounceWall from '%script/templates/BounceWall.js'
import GoombaMove from '%script/templates/GoombaMove.js'
import ChangeStateOnHitWall from '%script/templates/ChangeStateOnHitWall.js'
import CameraFollow from '%script/templates/CameraFollow.js'
import OnMouseScrollY from '%script/templates/OnMouseScrollY.js'
import SetAnimationFromVelocityX from '%script/templates/SetAnimationFromVelocityX.js'
import SetAnimationFromVelocityX2 from '%script/templates/SetAnimationFromVelocityX2.js'
import PongMove from '%script/templates/PongMove.js'
import PongScore from '%script/templates/PongScore.js'
import PongBall from '%script/templates/PongBall.js'

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
  new ScriptTemplateInfo('Moves your character with AD', PlatformerMove2),
  new ScriptTemplateInfo('Moves your character with WASD', TopDownMove),
  new ScriptTemplateInfo('Sets maximum x-axis speed', MaxSpeedX),
  new ScriptTemplateInfo('Sets maximum y-axis speed', MaxSpeedY),
  new ScriptTemplateInfo('Sets maximum left x-axis velocity', MinVelocityX),
  new ScriptTemplateInfo('Sets maximum right x-axis velocity', MaxVelocityX),
  new ScriptTemplateInfo('Sets maximum downward y-axis velocity', MinVelocityY),
  new ScriptTemplateInfo('Sets maximum upward y-axis velocity', MaxVelocityY),
  new ScriptTemplateInfo('Does something when a wall is hit', HitWall),
  new ScriptTemplateInfo('Bounces when a wall is hit', BounceWall),
  new ScriptTemplateInfo('Moves like a goomba', GoombaMove),
  new ScriptTemplateInfo(
    'Changes to given state when a wall is hit',
    ChangeStateOnHitWall
  ),
  new ScriptTemplateInfo('Makes the camera follow this entity', CameraFollow),
  new ScriptTemplateInfo(
    'Runs when the mouse wheel is scrolled up or down',
    OnMouseScrollY
  ),
  new ScriptTemplateInfo(
    'Sets animation based on x velocity',
    SetAnimationFromVelocityX
  ),
  new ScriptTemplateInfo(
    'Sets animation based on x velocity',
    SetAnimationFromVelocityX2
  ),
  new ScriptTemplateInfo('Move up or down', PongMove),
  new ScriptTemplateInfo('Score when the ball hits the back wall', PongScore),
  new ScriptTemplateInfo('Bounce when hitting walls or players', PongBall),
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
