import lunr from 'lunr'
import MoveBehaviorScript from '%behaviors/MoveBehaviorScript.js'

export const behaviorInfoBank = [
  {
    name: 'Move',
    description: 'Moves your character with WASD',
    script: MoveBehaviorScript,
  },
].sort((a, b) => (a.name > b.name ? 1 : -1))

export const behaviorInfoIndex = lunr(function () {
  this.field('name')
  this.field('description')
  this.ref('id')

  for (let i = 0; i < behaviorInfoBank.length; ++i) {
    this.add({
      id: i,
      name: behaviorInfoBank[i].name,
      description: behaviorInfoBank[i].description,
    })
  }
})
