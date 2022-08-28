import { Layer } from '%window/Layer.js'
import { global } from '%engine/Global.js'

export class ScriptGraphControlsLayer extends Layer {
  constructor(input) {
    super('ScriptGraphLayerControls')
    this.input = input
    this.zoom = 1
    this.maxZoom = 2
    this.minZoom = 0.5
    this.zoomSpeed = 0.0025
  }
  onMouseScroll(e) {
    this.zoom -= e.y * this.zoomSpeed * (this.zoom / this.maxZoom)
    this.zoom = global.clamp(this.zoom, this.minZoom, this.maxZoom)
  }
  computeTranslation() {
    let dx = this.input.offsetX + this.window.canvas.width / 2
    let dy = this.input.offsetY + this.window.canvas.height / 2
    if (this.input.rightMousePressed) {
      dx += this.input.dragOffsetX
      dy += this.input.dragOffsetY
    }
    return { dx, dy }
  }
  setTransform(ctx) {
    const { dx, dy } = this.computeTranslation()
    ctx.setTransform(this.zoom, 0, 0, this.zoom, dx, dy)
  }
}
