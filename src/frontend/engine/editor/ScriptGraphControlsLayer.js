import { Layer } from '%window/Layer.js'
import { global } from '%engine/Global.js'

export class ScriptGraphControlsLayer extends Layer {
  constructor(input) {
    super('ScriptGraphLayerControls')
    this.input = input
    this.zoom = 1
    this.maxZoom = 10
    this.minZoom = 0.1
    this.zoomSpeed = 0.01
    this.dragStartX = 0
    this.dragStartY = 0
    this.dragOffsetX = 0
    this.dragOffsetY = 0
    this.offsetX = 0
    this.offsetY = 0
  }
  onMouseScroll(e) {
    this.zoom -= e.y * this.zoomSpeed * (this.zoom / this.maxZoom)
    this.zoom = global.clamp(this.zoom, this.minZoom, this.maxZoom)
    this.redraw = true
  }
  onMouseDown(e) {
    if (e.button === 2) {
      this.dragStartX = this.input.mouseX
      this.dragStartY = this.input.mouseY
    }
  }
  onMouseUp(e) {
    if (e.button === 2) {
      this.offsetX += this.dragOffsetX
      this.offsetY += this.dragOffsetY
      this.dragOffsetX = 0
      this.dragOffsetY = 0
    }
  }
  onMouseMove() {
    if (this.input.rightMousePressed) {
      // we want to allow zooming to less than 1, but without asymptotically increasing pan speed
      this.dragOffsetX =
        (this.input.mouseX - this.dragStartX) / Math.max(this.zoom, 1)
      this.dragOffsetY =
        (this.input.mouseY - this.dragStartY) / Math.max(this.zoom, 1)
    }
  }
  computeTranslation() {
    const dx =
      (this.offsetX + this.dragOffsetX) * this.zoom +
      this.window.canvas.width / 2
    const dy =
      (this.offsetY + this.dragOffsetY) * this.zoom +
      this.window.canvas.height / 2
    return { dx, dy }
  }
  setTransform(ctx) {
    const { dx, dy } = this.computeTranslation()
    ctx.setTransform(this.zoom, 0, 0, this.zoom, dx, dy)
  }
}
