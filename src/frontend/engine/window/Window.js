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

    this.setCanvas(canvas)
    this.clearColor = clearColor || undefined
  }
  setCanvas(canvas) {
    if (this.canvas === canvas) {
      return
    }

    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')

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
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      e.stopPropagation()
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
    if (this.clearColor) {
      this.drawRect(0, 0, w, h, this.clearColor)
    } else {
      this.ctx.clearRect(0, 0, w, h)
    }
  }
  drawLine(x0, y0, x1, y1, color, options = {}) {
    const [cx0, cy0] = this.transformCoords(x0, y0)
    const [cx1, cy1] = this.transformCoords(x1, y1)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = options.width
    this.ctx.lineCap = 'round'
    this.ctx.beginPath()
    this.ctx.moveTo(cx0, cy0)
    this.ctx.lineTo(cx1, cy1)
    this.ctx.stroke()
    this.ctx.closePath()
  }
  drawRect(x, y, w, h, color, stroke) {
    const [cx, cy] = this.transformCoords(x, y)
    const [cw, ch] = this.transformDims(w, h)
    if (stroke) {
      this.ctx.strokeStyle = color
      this.ctx.strokeRect(cx, cy, cw, ch)
    } else {
      this.ctx.fillStyle = color
      this.ctx.fillRect(cx, cy, cw, ch)
    }
  }
  drawRoundRect(x, y, w, h, r, color, stroke, shadowOptions) {
    const [cx, cy] = this.transformCoords(x, y)
    const [cw, ch] = this.transformDims(w, h)
    const [cr] = this.transformDims(r)
    this.ctx.beginPath()
    if (shadowOptions) {
      const [csb, cso] = this.transformDims(
        shadowOptions.blur,
        shadowOptions.offsetY
      )
      this.ctx.shadowBlur = csb
      this.ctx.shadowOffsetY = cso
      this.ctx.shadowColor = color
      this.ctx.fillColor = color
      this.ctx.roundRect(cx, cy, cw, ch, [cr])
      this.ctx.fill()
      this.ctx.shadowBlur = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.shadowColor = 'transparent'
    } else if (stroke) {
      this.ctx.strokeStyle = color
      this.ctx.roundRect(cx, cy, cw, ch, [cr])
      this.ctx.stroke()
    } else {
      this.ctx.fillStyle = color
      this.ctx.roundRect(cx, cy, cw, ch, [cr])
      this.ctx.fill()
    }
    this.ctx.closePath()
  }
  drawArc(x, y, r, startAngle, endAngle, color, stroke) {
    const [cx, cy] = this.transformCoords(x, y)
    const [cr] = this.transformDims(r)
    this.ctx.beginPath()
    if (stroke) {
      this.ctx.strokeStyle = color
      this.ctx.arc(cx, cy, cr, startAngle, endAngle)
      this.ctx.stroke()
    } else {
      this.ctx.fillStyle = color
      this.ctx.arc(cx, cy, cr, startAngle, endAngle)
      this.ctx.fill()
    }
    this.ctx.closePath()
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
    const [cs] = this.transformDims(fontSize)
    this.ctx.fillStyle = color
    this.ctx.textBaseline = 'middle'
    this.ctx.font = `${cs}px ${fontFamily}`

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
