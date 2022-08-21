import { Component } from './Component.js'

// this represents an HTML5 canvas
export class Canvas extends Component {
  constructor(canvas) {
    super('Canvas')

    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
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
