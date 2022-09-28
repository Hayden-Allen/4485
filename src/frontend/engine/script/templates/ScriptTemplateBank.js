import lunr from 'lunr'
import TopDownMove from '%script/templates/TopDownMove.js'
import PlatformerMove from '%script/templates/PlatformerMove.js'
import PlatformerJump from '%script/templates/PlatformerJump.js'

class ScriptTemplateInfo {
  constructor(name, description, script) {
    this.name = name
    this.description = description
    this.script = script
  }
}

export const scriptTemplateBank = [
  new ScriptTemplateInfo(
    'TopDownMove',
    'Moves your character with WASD',
    TopDownMove
  ),
  new ScriptTemplateInfo(
    'PlatformerMove',
    'Moves your character with AD',
    PlatformerMove
  ),
  new ScriptTemplateInfo('PlatformerJump', 'Jumps', PlatformerJump),
].sort((a, b) => (a.name > b.name ? 1 : -1))

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
