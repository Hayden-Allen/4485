import lunr from 'lunr'
import Move from '%behaviors/Move.js'

class BehaviorInfo {
  constructor(name, description, script) {
    this.name = name
    this.description = description
    this.script = script
  }
}

export const behaviorInfoBank = [
  new BehaviorInfo('Move', 'Moves your character with WASD', Move),
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
