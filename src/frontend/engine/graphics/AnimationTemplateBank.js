import lunr from 'lunr'
import { global } from '%engine/Global.js'

class AnimationTemplateInfo {
  constructor(name, frameTime, urls) {
    this.name = name
    this.frameTime = frameTime
    this.urls = urls
  }
}

export const animationTemplateBank = [
  new AnimationTemplateInfo('Blank', 0, ['/MissingTexture.svg']),
  ...global.alphabetSort([
    new AnimationTemplateInfo('Player (Idle)', 0, [
      '/sprites/character_0000.png',
    ]),
    new AnimationTemplateInfo('Player (Walk)', 125, [
      '/sprites/character_0000.png',
      '/sprites/character_0001.png',
    ]),
    new AnimationTemplateInfo('Item', 0, ['/sprites/tile_0009.png']),
  ]),
]

export const animationTemplateIndex = lunr(function () {
  this.field('name')
  this.ref('id')

  animationTemplateBank.forEach((info, i) => {
    this.add({
      id: i,
      name: info.name,
    })
  })
})
