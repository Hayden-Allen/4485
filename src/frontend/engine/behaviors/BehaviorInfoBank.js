import lunr from 'lunr'
import TopDownMove from '%behaviors/TopDownMove.js'
import PlatformerMove from '%behaviors/PlatformerMove.js'
import PlatformerJump from '%behaviors/PlatformerJump.js'

class BehaviorInfo {
  constructor(name, description, script) {
    this.name = name
    this.description = description
    this.script = script
  }
}

export const behaviorInfoBank = [
  new BehaviorInfo(
    'TopDownMove',
    'Moves your character with WASD',
    TopDownMove
  ),
  new BehaviorInfo(
    'PlatformerMove',
    'Moves your character with AD',
    PlatformerMove
  ),
  new BehaviorInfo('PlatformerJump', 'Jumps', PlatformerJump),
].sort((a, b) => (a.name > b.name ? 1 : -1))

export const behaviorInfoIndex = lunr(function () {
  this.field('name')
  this.field('description')
  this.ref('id')

  behaviorInfoBank.forEach((info, i) => {
    this.add({
      id: i,
      name: info.name,
      description: info.description,
    })
  })
})
