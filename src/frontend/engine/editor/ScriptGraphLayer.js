import { Layer } from '%window/Layer.js'
import { ScriptGraphVisualizer } from './ScriptGraphVisualizer.js'
import { global } from '%engine/Global.js'

export class ScriptGraphLayer extends Layer {
  constructor(window, playerScript) {
    super('ScriptGraphLayer')
    this.graphvis = new ScriptGraphVisualizer(window.ctx, playerScript)
    this.graphvis.arrangeX()
    this.graphvis.arrangeY()
    this.changed = true
    this.zoom = 1
    this.maxZoom = 10
    this.minZoom = 0.1
    this.zoomSpeed = 0.01
    this.mouseX = 0
    this.mouseY = 0
    this.dragStartX = -1
    this.dragStartY = -1
    this.dragOffsetX = 0
    this.dragOffsetY = 0
    this.offsetX = 0
    this.offsetY = 0
  }
  onMouseScroll(e) {
    this.zoom -= e.y * this.zoomSpeed * (this.zoom / this.maxZoom)
    this.zoom = global.clamp(this.zoom, this.minZoom, this.maxZoom)
  }
  onMouseDown(e) {
    if (e.button === 2) {
      this.dragStartX = this.mouseX
      this.dragStartY = this.mouseY
      this.rmb = true
    }
  }
  onMouseUp(e) {
    if (e.button === 2) {
      this.rmb = false
      this.offsetX += this.dragOffsetX
      this.offsetY += this.dragOffsetY
      this.dragOffsetX = 0
      this.dragOffsetY = 0
    }
  }
  onMouseMove(e) {
    this.mouseX = e.x
    this.mouseY = e.y
    if (this.rmb) {
      this.dragOffsetX = this.mouseX - this.dragStartX
      this.dragOffsetY = this.mouseY - this.dragStartY
    }
  }
  onRender(e) {
    e.window.ctx.resetTransform()
    e.window.clear()
    e.window.ctx.setTransform(
      this.zoom,
      0,
      0,
      this.zoom,
      this.offsetX + this.dragOffsetX,
      this.offsetY + this.dragOffsetY
    )

    if (this.rmb) e.window.canvas.style.cursor = 'move'
    else e.window.canvas.style.cursor = 'default'

    this.graphvis.draw(e.window, 0, 0, this.zoom)
  }
}
