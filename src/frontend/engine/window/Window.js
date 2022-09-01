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
import { InputCache } from './InputCache.js'

export class Window {
  constructor(canvas, clearColor) {
    this.layers = []
    this.inputCache = undefined
    this.setCanvas(canvas)
    this.clearColor = clearColor || undefined
  }
  setCanvas(canvas) {
    if (this.canvas === canvas) {
      return
    }

    this.canvas = canvas
    this.inputCache = new InputCache(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.ctx.lineCap = 'round'

    // necessary for key events to get sent to the canvas
    this.canvas.addEventListener('click', () => {
      this.canvas.focus({
        focusVisible: true,
      })
    })
    this.canvas.addEventListener('keydown', (e) => {
      this.propagateEvent('onKeyDown', new KeyDownEvent(e))
    })
    this.canvas.addEventListener('keyup', (e) => {
      this.propagateEvent('onKeyUp', new KeyUpEvent(e))
    })
    this.canvas.addEventListener('pointermove', (e) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - Math.floor(rect.x),
        y = e.clientY - Math.floor(rect.y)
      this.propagateEvent('onMouseMove', new MouseMoveEvent(e, x, y))
    })
    this.canvas.addEventListener('pointerdown', (e) => {
      this.canvas.setPointerCapture(e.pointerId)
      this.propagateEvent('onMouseDown', new MouseDownEvent(e))
    })
    this.canvas.addEventListener('pointerup', (e) => {
      this.canvas.releasePointerCapture(e.pointerId)
      this.propagateEvent('onMouseUp', new MouseUpEvent(e))
    })
    this.canvas.addEventListener('wheel', (e) => {
      this.propagateEvent('onMouseScroll', new MouseScrollEvent(e))
    })
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
  }
  pushLayer(layer) {
    this.layers.push(layer)
    layer.window = this
    layer.onAttach()
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
  clear() {
    const w = this.canvas.width
    const h = this.canvas.height
    if (this.clearColor) {
      this.ctx.fillStyle = this.clearColor
      this.ctx.fillRect(0, 0, w, h)
    } else {
      this.ctx.clearRect(0, 0, w, h)
    }
  }
  drawLine(x0, y0, x1, y1, color, width) {
    const [cx0, cy0] = this.scaleCoords(x0, y0)
    const [cx1, cy1] = this.scaleCoords(x1, y1)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.beginPath()
    this.ctx.moveTo(cx0, cy0)
    this.ctx.lineTo(cx1, cy1)
    this.ctx.stroke()
    this.ctx.closePath()
  }
  drawTransparentLine(x0, y0, x1, y1, color, width, alpha) {
    const prevAlpha = this.ctx.globalAlpha
    this.ctx.globalAlpha = alpha
    this.drawLine(x0, y0, x1, y1, color, width)
    this.ctx.globalAlpha = prevAlpha
  }
  drawRect(x, y, w, h, color) {
    const [cx, cy] = this.scaleCoords(x, y)
    const [cw, ch] = this.scaleDims(w, h)
    this.ctx.fillStyle = color
    this.ctx.fillRect(cx, cy, cw, ch)
  }
  strokeRect(x, y, w, h, color, width) {
    const [cx, cy] = this.scaleCoords(x, y)
    const [cw, ch] = this.scaleDims(w, h)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.strokeRect(cx, cy, cw, ch)
  }
  drawTransparentRect(x, y, w, h, color, alpha) {
    const prevAlpha = this.ctx.globalAlpha
    this.ctx.globalAlpha = alpha
    this.drawRect(x, y, w, h, color)
    this.ctx.globalAlpha = prevAlpha
  }
  strokeRoundRect(x, y, w, h, r, color, width, alpha) {
    const prevAlpha = this.ctx.globalAlpha

    const [cx, cy] = this.scaleCoords(x, y)
    const [cw, ch] = this.scaleDims(w, h)
    const [cr] = this.scaleDims(r)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.globalAlpha = alpha
    this.ctx.beginPath()
    this.ctx.roundRect(cx, cy, cw, ch, [cr])
    this.ctx.stroke()

    this.ctx.globalAlpha = prevAlpha
  }
  drawRoundRect(x, y, w, h, r, color) {
    const [cx, cy] = this.scaleCoords(x, y)
    const [cw, ch] = this.scaleDims(w, h)
    const [cr] = this.scaleDims(r)
    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.roundRect(cx, cy, cw, ch, [cr])
    this.ctx.fill()
    this.ctx.closePath()
  }
  drawRoundRectShadow(x, y, w, h, r, color, blur, offsetY) {
    const [csb, cso] = this.scaleDims(blur, offsetY)
    this.ctx.shadowBlur = csb
    this.ctx.shadowOffsetY = cso
    this.ctx.shadowColor = color
    this.drawRoundRect(x, y, w, h, r, color)
    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetY = 0
    this.ctx.shadowColor = 'transparent'
  }
  strokeArc(x, y, r, startAngle, endAngle, color) {
    const [cx, cy] = this.scaleCoords(x, y)
    const [cr] = this.scaleDims(r)
    this.ctx.strokeStyle = color
    this.ctx.beginPath()
    this.ctx.arc(cx, cy, cr, startAngle, endAngle)
    this.ctx.stroke()
    this.ctx.closePath()
  }
  drawArc(x, y, r, startAngle, endAngle, color) {
    const [cx, cy] = this.scaleCoords(x, y)
    const [cr] = this.scaleDims(r)
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(cx, cy, cr, startAngle, endAngle)
    this.ctx.fill()
    this.ctx.closePath()
  }
  drawText(message, x, y, fontFamily, fontSize, color) {
    this.ctx.font = `${this.scaleFontSize(fontSize)}px ${fontFamily}`
    this.ctx.fillStyle = color
    this.ctx.textBaseline = 'top'

    const [cx, cy] = this.scaleCoords(x, y)
    this.ctx.fillText(message, cx, cy)
  }
  rotate(cx, cy, theta) {
    this.ctx.translate(cx, cy)
    this.ctx.rotate(theta)
    this.ctx.translate(-cx, -cy)
  }
  drawCenteredText(message, x, y, fontFamily, fontSize, color, options = {}) {
    this.ctx.font = `${this.scaleFontSize(fontSize)}px ${fontFamily}`
    this.ctx.fillStyle = color
    this.ctx.textBaseline = 'middle'

    const [cx, cy] = this.scaleCoords(x, y)
    if (options.theta) this.rotate(cx, cy, options.theta)
    this.ctx.fillText(message, cx - this.ctx.measureText(message).width / 2, cy)
    if (options.theta) this.rotate(cx, cy, -options.theta)
  }
  textMetrics(string, fontFamily, fontSize) {
    this.ctx.font = `${fontSize}px ${fontFamily}`
    return this.ctx.measureText(string)
  }
  getScalingFactor() {
    const xs = this.canvas.width / global.canvas.targetWidth
    const ys = this.canvas.height / global.canvas.targetHeight
    return Math.min(xs, ys)
  }
  // world->window
  // this.ctx.transform is applied automatically during rendering, which converts window->screen
  scaleCoords(x, y) {
    const s = this.getScalingFactor()
    return [Math.floor(x * s), Math.floor(y * s)]
  }
  // screen->world
  inverseTransformCoords(x, y) {
    const t = this.ctx.getTransform()
    const screenX = (x - t.e) / t.a
    const screenY = (y - t.f) / t.d
    const s = this.getScalingFactor()
    return [Math.floor(screenX / s), Math.floor(screenY / s)]
  }
  scaleDims(w, h) {
    const s = this.getScalingFactor()
    return [Math.ceil(w * s), Math.ceil(h * s)]
  }
  scaleFontSize(size) {
    const s = this.getScalingFactor()
    return s * size
  }
}
