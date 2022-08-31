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
  setTransform(ctx) {
    let dx = this.input.offsetX
    let dy = this.input.offsetY
    if (this.input.rightMousePressed) {
      dx += this.input.dragOffsetX
      dy += this.input.dragOffsetY
    }
    ctx.setTransform(this.zoom, 0, 0, this.zoom, dx, dy)
    return ctx.getTransform()
  }
}
