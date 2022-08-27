import { Layer } from '%window/Layer.js'
import { ScriptGraphVisualizer } from './ScriptGraphVisualizer.js'
import { global } from '%engine/Global.js'

export class ScriptGraphLayer extends Layer {
  constructor(input, controls, playerScript) {
    super('ScriptGraphLayer')
    this.input = input
    this.controls = controls
    this.redraw = true
    this.capturedRightClick = false
    this.graphvis = undefined
    this.playerScript = playerScript
  }
  onAttach() {
    // need this.window to be valid, so can't call in constructor
    this.graphvis = new ScriptGraphVisualizer(this.window, this.playerScript)
    this.graphvis.arrangeX()
    this.graphvis.arrangeY()
  }
  onMouseScroll() {
    this.redraw = true

    const hit = this.checkIntersection()
    if (hit) this.input.cursor = 'default'
  }
  onMouseMove() {
    this.redraw = this.input.rightMousePressed && !this.capturedRightClick

    const hit = this.checkIntersection()
    if (hit) this.input.cursor = 'default'
    return this.capturedRightClick && hit
  }
  onMouseDown(e) {
    const hit = this.checkIntersection()
    if (hit) {
      this.input.cursor = 'default'
      this.capturedRightClick = e.button === 2
    }
    return hit
  }
  onMouseUp(e) {
    const hit = this.checkIntersection()
    if (hit) this.input.cursor = 'default'
    if (e.button === 2) this.capturedRightClick = false
    return hit
  }
  onResize() {
    this.redraw = true
  }
  onRender(e) {
    /**
     * @HATODO sometimes the draw doesn't show up, even if this check passes
     */
    if (!this.redraw) return
    this.redraw = false

    e.window.ctx.resetTransform()
    e.window.clear()
    this.controls.setTransform(e.window.ctx)
    this.graphvis.draw(e.window, this.zoom)
  }
  checkIntersection() {
    const mx = this.input.mouseX,
      my = this.input.mouseY

    let hit = false
    const t = this.window.ctx.getTransform()
    this.graphvis.proxies.forEach((proxy) => {
      if (hit) return

      let [px, py] = this.window.transformCoords(proxy.x, proxy.y)
      px = t.a * px + t.e
      py = t.d * py + t.f
      let [pw, ph] = this.window.transformDims(proxy.w, proxy.h)
      pw *= t.a
      ph *= t.d

      if (global.rectIntersect(mx, my, px, py, pw, ph)) hit = true
    })

    return hit
  }
}
