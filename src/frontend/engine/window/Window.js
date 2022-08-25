import {
  KeyDownEvent,
  KeyUpEvent,
  MouseMoveEvent,
  MouseScrollEvent,
  MouseDownEvent,
  MouseUpEvent,
  AppTickEvent,
  RenderEvent,
} from './Event.js'
import { global } from '%engine/Global.js'

export class Window {
  constructor(canvas, clearColor) {
    this.layers = []

    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.clearColor = clearColor

    this.canvas.addEventListener('keydown', (e) => {
      this.propagateEvent('onKeyDown', new KeyDownEvent(e))
    })
    this.canvas.addEventListener('keyup', (e) => {
      this.propagateEvent('onKeyUp', new KeyUpEvent(e))
    })
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - Math.floor(rect.x),
        y = e.clientY - Math.floor(rect.y)
      this.propagateEvent('onMouseMove', new MouseMoveEvent(e, x, y))
    })
    this.canvas.addEventListener('mousedown', (e) => {
      this.propagateEvent('onMouseDown', new MouseDownEvent(e))
    })
    this.canvas.addEventListener('mouseup', (e) => {
      this.propagateEvent('onMouseUp', new MouseUpEvent(e))
    })
    this.canvas.addEventListener('wheel', (e) => {
      this.propagateEvent('onMouseScroll', new MouseScrollEvent(e))
    })
  }
  pushLayer(layer) {
    this.layers.push(layer)
  }
  removeLayer(layer) {
    this.layers = this.layers.filter((l) => l.debugName !== layer.debugName)
  }
  propagateEvent(fn, e) {
    // start from the top of the layer stack and continue until the event has been handled
    for (var i = this.layers.length - 1; i >= 0; i--)
      if (this.layers[i][fn](e)) break
  }
  update(deltaTime) {
    // update everything
    this.propagateEvent('onAppTick', new AppTickEvent(deltaTime))
    // draw everything
    this.propagateEvent('onRender', new RenderEvent(this))
  }

  rotate(centerX, centerY, theta) {
    this.ctx.translate(centerX, centerY)
    this.ctx.rotate(theta)
    this.ctx.translate(-centerX, -centerY)
  }
  clear() {
    const w = global.canvas.targetWidth
    const h = global.canvas.targetHeight
    this.ctx.clearRect(0, 0, w, h)
    this.drawRect(0, 0, w, h, this.clearColor)
  }
  drawLine(x0, y0, x1, y1, color, options = {}) {
    const [cx0, cy0] = this.transformCoords(x0, y0)
    const [cx1, cy1] = this.transformCoords(x1, y1)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = options.width
    this.ctx.beginPath()
    this.ctx.moveTo(cx0, cy0)
    this.ctx.lineTo(cx1, cy1)
    this.ctx.stroke()
    this.ctx.closePath()
  }
  drawRect(x, y, w, h, color) {
    const [cx, cy] = this.transformCoords(x, y)
    const [cw, ch] = this.transformDims(w, h)
    this.ctx.fillStyle = color
    this.ctx.fillRect(cx, cy, cw, ch)
  }
  drawText(message, x, y, fontFamily, fontSize, color) {
    const [cx, cy] = this.transformCoords(x, y)
    const [cs] = this.transformDims(fontSize)
    this.ctx.fillStyle = color
    this.ctx.font = `${cs}px ${fontFamily}`
    this.ctx.textBaseline = 'top'
    this.ctx.fillText(message, cx, cy)
    // reset to default
    this.ctx.textBaseline = 'alphabetic'
  }
  drawCenteredText(message, x, y, fontFamily, fontSize, color, options = {}) {
    const [cx, cy] = this.transformCoords(x, y)
    this.ctx.fillStyle = color
    this.ctx.textBaseline = 'middle'
    this.ctx.font = `${fontSize}px ${fontFamily}`

    if (options.theta) this.rotate(cx, cy, options.theta)
    this.ctx.fillText(message, cx - this.ctx.measureText(message).width / 2, cy)
    if (options.theta) this.rotate(cx, cy, -options.theta)

    // reset to default
    this.ctx.textBaseline = 'alphabetic'
  }
  transformCoords(x, y) {
    const xs = this.canvas.width / global.canvas.targetWidth
    const ys = this.canvas.height / global.canvas.targetHeight
    return [Math.floor(x * xs), Math.floor(y * ys)]
  }
  transformDims(w, h) {
    const xs = this.canvas.width / global.canvas.targetWidth
    const ys = this.canvas.height / global.canvas.targetHeight
    return [Math.ceil(w * xs), Math.ceil(h * ys)]
  }
}
