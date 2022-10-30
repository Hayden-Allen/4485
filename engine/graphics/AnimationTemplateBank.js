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
  new AnimationTemplateInfo('Blank', 0, ['/sprites/MissingTexture.svg']),
  ...global.alphabetSort([
    new AnimationTemplateInfo('Link', 0, [
      'https://art.pixilart.com/840bcbc293e372f.png',
    ]),
    new AnimationTemplateInfo('Item', 0, [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYrGPqKAnwSbc1AwWvieLvCe5gy2LASXWOg&usqp=CAU',
    ]),
    new AnimationTemplateInfo('Link & Item', 500, [
      'https://art.pixilart.com/840bcbc293e372f.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYrGPqKAnwSbc1AwWvieLvCe5gy2LASXWOg&usqp=CAU',
    ]),
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
