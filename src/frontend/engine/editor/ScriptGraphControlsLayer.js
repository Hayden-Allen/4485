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
  }
  onMouseScroll(e) {
    this.zoom -= e.y * this.zoomSpeed * (this.zoom / this.maxZoom)
    this.zoom = global.clamp(this.zoom, this.minZoom, this.maxZoom)
  }
  onMouseMove() {
    if (this.input.rightMousePressed) {
      this.input.dragOffsetX /= Math.max(this.zoom, 1)
      this.input.dragOffsetY /= Math.max(this.zoom, 1)
    }
  }
  computeTranslation() {
    let dx = this.input.offsetX * this.zoom + this.window.canvas.width / 2
    let dy = this.input.offsetY * this.zoom + this.window.canvas.height / 2
    if (this.input.rightMousePressed) {
      dx += this.input.dragOffsetX * this.zoom
      dy += this.input.dragOffsetY * this.zoom
    }
    return { dx, dy }
  }
  setTransform(ctx) {
    const { dx, dy } = this.computeTranslation()
    ctx.setTransform(this.zoom, 0, 0, this.zoom, dx, dy)
  }
}
