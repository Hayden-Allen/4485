import { Layer } from '%window/Layer.js'
import { global } from '%engine/Global.js'
import * as mat3 from '%glMatrix/mat3.js'

export class ScriptControlsLayer extends Layer {
  constructor(input) {
    super('ScriptLayerControls')
    this.input = input
    this.zoom = 1
    this.maxZoom = 2
    this.minZoom = 0.5
    this.zoomSpeed = 0.0025
    this.viewProj = mat3.create()
  }
  onMouseScroll(e) {
    this.zoom -= e.y * this.zoomSpeed * (this.zoom / this.maxZoom)
    this.zoom = global.clamp(this.zoom, this.minZoom, this.maxZoom)
    this.input.dragSpeed = 1 / this.zoom
  }
  setTransform(ctx) {
    const z = this.zoom
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    const ox = this.input.offsetX + this.input.dragOffsetX
    const oy = this.input.offsetY + this.input.dragOffsetY
    // This explanation is here not because I'm proud of this stupidly simple computation, but because I am too stupidly simple to remember it
    // zoom:
    // | z 0 0 |   | x |   | z*x |
    // | 0 z 0 | * | y | = | z*y |
    // | 0 0 1 |   | 1 |   |  1  |
    //
    // zoom on center of canvas (point at [w/2, h/2] stays in place):
    // | z 0 a |   | w/2 |   | w/2 |
    // | 0 z b | * | h/2 | = | h/2 |
    // | 0 0 1 |   |  1  |   |  1  |
    //
    // zw/2 + a = w/2 => a = w/2 - zw/2 = (1 - z)w/2
    // zh/2 + b = h/2 => b = h/2 - zh/2 = (1 - z)h/2
    //
    // apply offset from dragging mouse:
    // | z 0 a |   | w/2 |   | w/2 + z(ox) |
    // | 0 z b | * | h/2 | = | h/2 + z(oy) |
    // | 0 0 1 |   |  1  |   |      1      |
    //
    // zw/2 + a = w/2 + z(ox) => a = (1 - z)w/2 + z(ox)
    // zh/2 + b = h/2 + z(oy) => b = (1 - z)h/2 + z(oy)
    ctx.setTransform(
      z,
      0,
      0,
      z,
      (1 - z) * (w / 2) + z * ox,
      (1 - z) * (h / 2) + z * oy
    )
    return ctx.getTransform()
  }
}
