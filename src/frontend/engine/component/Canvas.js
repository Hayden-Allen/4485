import { Component } from './Component.js'
import { global } from '%engine/Global.js'

// this represents an HTML5 canvas
export class Canvas extends Component {
  constructor(canvas) {
    super('Canvas')

    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
  }
  scale() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    // @HATODO pixel perfect
    const widthRatio = this.canvas.width / global.canvas.targetWidth,
      heightRatio = this.canvas.height / global.canvas.targetHeight
    this.ctx.scale(widthRatio, heightRatio)
  }
  rotate(centerX, centerY, theta) {
    this.ctx.translate(centerX, centerY)
    this.ctx.rotate(theta)
    this.ctx.translate(-centerX, -centerY)
  }
  getWidth() {
    return this.canvas.width
  }
  getHeight() {
    return this.canvas.height
  }
}
