import lunr from 'lunr'
import TopDownMove from '%script/templates/TopDownMove.js'
import PlatformerMove from '%script/templates/PlatformerMove.js'
import PlatformerJump from '%script/templates/PlatformerJump.js'
import ChangeStateOnKey from '%script/templates/ChangeStateOnKey.js'

class ScriptTemplateInfo {
  constructor(description, script) {
    this.name = script.name
    this.description = description
    this.script = script
  }
}

export const scriptTemplateBank = [
  new ScriptTemplateInfo('Moves your character with WASD', TopDownMove),
  new ScriptTemplateInfo('Moves your character with AD', PlatformerMove),
  new ScriptTemplateInfo('Jumps', PlatformerJump),
  new ScriptTemplateInfo(
    'Changes to a new state when a key is pressed',
    ChangeStateOnKey
  ),
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
