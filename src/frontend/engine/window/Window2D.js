import { global } from '%engine/Global.js'
import { Window } from './Window.js'

function _roundRectPolyfill(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
  ctx.closePath()
}

export class Window2D extends Window {
  constructor(canvas, clearColor, { doScaling = true } = {}) {
    super(canvas, clearColor)
    this.doScaling = doScaling
  }
  setCanvas(canvas) {
    super.setCanvas(canvas)
    if (this.ctx) return
    this.ctx = canvas.getContext('2d')
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
  setCompositeOperation(s) {
    this.ctx.globalCompositeOperation = s
  }
  resetCompositeOperation() {
    this.ctx.globalCompositeOperation = 'source-over'
  }
  drawLine(x0, y0, x1, y1, color, width) {
    const prevWidth = this.ctx.lineWidth
    this.ctx.lineWidth = width

    const [cx0, cy0] = this.scaleCoords(x0, y0)
    const [cx1, cy1] = this.scaleCoords(x1, y1)
    this.ctx.strokeStyle = color
    this.ctx.lineCap = 'round'
    this.ctx.beginPath()
    this.ctx.moveTo(cx0, cy0)
    this.ctx.lineTo(cx1, cy1)
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.lineWidth = prevWidth
  }
  drawTransparentLine(x0, y0, x1, y1, color, width, alpha) {
    const prevWidth = this.ctx.lineWidth
    this.ctx.lineWidth = width

    const prevAlpha = this.ctx.globalAlpha
    this.ctx.globalAlpha = alpha
    this.drawLine(x0, y0, x1, y1, color, width)

    this.ctx.globalAlpha = prevAlpha
    this.ctx.lineWidth = prevWidth
  }
  drawRect(x, y, w, h, color) {
    const [cx, cy] = this.scaleCoords(x, y)
    const [cw, ch] = this.scaleDims(w, h)
    this.ctx.fillStyle = color
    this.ctx.fillRect(cx, cy, cw, ch)
  }
  strokeRect(x, y, w, h, color, width) {
    const prevWidth = this.ctx.lineWidth
    this.ctx.lineWidth = width

    const [cx, cy] = this.scaleCoords(x, y)
    const [cw, ch] = this.scaleDims(w, h)
    this.ctx.strokeStyle = color
    this.ctx.strokeRect(cx, cy, cw, ch)

    this.ctx.lineWidth = prevWidth
  }
  drawTransparentRect(x, y, w, h, color, alpha) {
    const prevAlpha = this.ctx.globalAlpha
    this.ctx.globalAlpha = alpha
    this.drawRect(x, y, w, h, color)
    this.ctx.globalAlpha = prevAlpha
  }
  strokeTransparentRect(x, y, w, h, color, width, alpha) {
    const prevWidth = this.ctx.lineWidth
    this.ctx.lineWidth = width
    const prevAlpha = this.ctx.globalAlpha
    this.ctx.globalAlpha = alpha

    const [cx, cy] = this.scaleCoords(x, y)
    const [cw, ch] = this.scaleDims(w, h)
    this.ctx.strokeStyle = color
    this.ctx.strokeRect(cx, cy, cw, ch)

    this.ctx.lineWidth = prevWidth
    this.ctx.globalAlpha = prevAlpha
  }
  drawImage(img, x, y, w, h) {
    this.ctx.drawImage(img, x, y, w, h)
  }
  strokeRoundRect(x, y, w, h, r, color, width, alpha) {
    const prevAlpha = this.ctx.globalAlpha

    const [cx, cy] = this.scaleCoords(x, y)
    const [cw, ch] = this.scaleDims(w, h)
    const [cr] = this.scaleDims(r)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.globalAlpha = alpha
    _roundRectPolyfill(this.ctx, cx, cy, cw, ch, cr, false, true)

    this.ctx.globalAlpha = prevAlpha
  }
  drawRoundRect(x, y, w, h, r, color) {
    const [cx, cy] = this.scaleCoords(x, y)
    const [cw, ch] = this.scaleDims(w, h)
    const [cr] = this.scaleDims(r)
    this.ctx.fillStyle = color
    _roundRectPolyfill(this.ctx, cx, cy, cw, ch, cr, true, false)
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
  drawTransparentArc(x, y, r, startAngle, endAngle, color, alpha) {
    const prevAlpha = this.ctx.globalAlpha
    this.ctx.globalAlpha = alpha
    const [cx, cy] = this.scaleCoords(x, y)
    const [cr] = this.scaleDims(r)
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(cx, cy, cr, startAngle, endAngle)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.globalAlpha = prevAlpha
  }
  drawText(message, x, y, fontFamily, fontSize, color, fontWeight) {
    this.ctx.font =
      (fontWeight ? `${fontWeight} ` : '') +
      `${this.scaleFontSize(fontSize)}px ${fontFamily}`
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
  drawVerticalCenteredText(
    message,
    x,
    y,
    fontFamily,
    fontSize,
    color,
    options = {}
  ) {
    this.ctx.font = `${this.scaleFontSize(fontSize)}px ${fontFamily}`
    this.ctx.fillStyle = color
    this.ctx.textBaseline = 'middle'

    const [cx, cy] = this.scaleCoords(x, y)
    if (options.theta) this.rotate(cx, cy, options.theta)
    this.ctx.fillText(message, cx, cy)
    if (options.theta) this.rotate(cx, cy, -options.theta)
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
  textMetrics(string, fontFamily, fontSize, fontWeight) {
    this.ctx.font =
      (fontWeight ? `${fontWeight} ` : '') + `${fontSize}px ${fontFamily}`
    return this.ctx.measureText(string)
  }
  getScalingFactor() {
    if (!this.doScaling) return 1
    const xs = this.canvas.width / global.canvas.targetWidth
    const ys = this.canvas.height / global.canvas.targetHeight
    return Math.min(xs, ys)
  }
  // world->window
  // this.ctx.transform is applied automatically during rendering, which converts window->screen
  scaleCoords(x, y) {
    const s = this.getScalingFactor()
    return [x * s, y * s]
  }
  scaleDims(w, h) {
    const s = this.getScalingFactor()
    return [w * s, h * s]
  }
  scaleFontSize(size) {
    const s = this.getScalingFactor()
    return s * size
  }
}
