import { System } from './System.js'
import { global } from '%engine/Global.js'

class RenderCommandOptions {
  constructor({ alpha, theta, width } = {}) {
    this.alpha = alpha == undefined ? 1 : alpha
    this.theta = theta == undefined ? 0 : theta
    this.width = width == undefined ? 1 : width
  }
}

class RenderCommand {
  constructor(method, options, args) {
    this.method = method
    this.options = new RenderCommandOptions(options)
    this.args = args || []
  }
}

export class Renderer extends System {
  constructor(clearColor) {
    super('Renderer')
    this.clearColor = clearColor
    this.renderCommands = []
  }
  /**
   * System overrides
   */
  preUpdate() {
    // clear the screen as the first command of each frame (subsequent clears can be at any point in the render command queue)
    this.renderCommands.unshift(new RenderCommand('clear', []))
    this.components.forEach((component) => {
      component.scale()
    })
  }
  handleGlobalOptions(component, options) {
    component.ctx.globalAlpha = options.alpha
    component.ctx.lineWidth = options.width
  }
  innerUpdate(deltaTime, component) {
    for (var command of this.renderCommands) {
      this.handleGlobalOptions(component, command.options)
      this[command.method + 'Impl'](component, ...command.args, command.options)
    }
  }
  postUpdate() {
    this.renderCommands = []
  }
  /**
   * Drawing interface
   * @HATODO make immediate?
   */
  addRenderCommand(method, options, ...args) {
    this.renderCommands.push(new RenderCommand(method, options, args))
  }
  clear() {
    this.renderCommands.push(new RenderCommand('clear', []))
  }
  drawLine(x0, y0, x1, y1, color, options) {
    this.addRenderCommand('drawLine', options, x0, y0, x1, y1, color, options)
  }
  drawRect(x, y, w, h, color, options) {
    this.addRenderCommand('drawRect', options, x, y, w, h, color)
  }
  drawText(message, x, y, fontFamily, fontSize, color, options) {
    this.addRenderCommand(
      'drawText',
      options,
      message,
      x,
      // make (x, y) the top left corner of the text
      y + fontSize,
      fontFamily,
      fontSize,
      color
    )
  }
  drawCenteredText(message, x, y, fontFamily, fontSize, color, options) {
    this.addRenderCommand(
      'drawCenteredText',
      options,
      message,
      x,
      y,
      fontFamily,
      fontSize,
      color
    )
  }
  /**
   * Drawing implementation
   * @HATODO remove?
   */
  clearImpl(component) {
    const w = global.canvas.targetWidth
    const h = global.canvas.targetHeight
    component.ctx.clearRect(0, 0, w, h)
    this.drawRectImpl(component, 0, 0, w, h, this.clearColor)
  }
  drawLineImpl(component, x0, y0, x1, y1, color, options) {
    let ctx = component.ctx
    ctx.strokeStyle = color
    ctx.lineWidth = options.width
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
    ctx.closePath()
  }
  drawRectImpl(component, x, y, w, h, color) {
    component.ctx.fillStyle = color
    component.ctx.fillRect(x, y, w, h)
  }
  drawTextImpl(component, message, x, y, fontFamily, fontSize, color) {
    component.ctx.fillStyle = color
    component.ctx.font = `${fontSize}px ${fontFamily}`
    component.ctx.fillText(message, x, y)
  }
  drawCenteredTextImpl(
    component,
    message,
    x,
    y,
    fontFamily,
    fontSize,
    color,
    options
  ) {
    let ctx = component.ctx
    ctx.fillStyle = color
    ctx.textBaseline = 'middle'
    ctx.font = `${fontSize}px ${fontFamily}`

    component.rotate(x, y, options.theta)
    ctx.fillText(message, x - ctx.measureText(message).width / 2, y)
    component.rotate(x, y, -options.theta)

    // reset to default
    ctx.textBaseline = 'alphabetic'
  }
}
