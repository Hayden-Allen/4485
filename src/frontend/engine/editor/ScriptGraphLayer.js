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
    this.selected = undefined
    this.selectedX = 0
    this.selectedY = 0
  }
  onAttach() {
    // need this.window to be valid, so can't call in constructor
    this.graphvis = new ScriptGraphVisualizer(this.window, this.playerScript)
    this.graphvis.arrange()
  }
  onMouseScroll() {
    this.redraw = true

    const hit = this.checkIntersection()
    if (hit) this.input.cursor = 'default'
  }
  onMouseDown(e) {
    const hit = this.checkIntersection()
    if (e.button === 0) {
      this.redraw = true

      if (this.selected) this.selected.selected = false
      this.selected = hit
      if (this.selected) {
        this.selected.selected = true
        this.selectedX = this.selected.x
        this.selectedY = this.selected.y
      }
    }
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
  onMouseMove() {
    this.redraw = this.input.rightMousePressed && !this.capturedRightClick

    if (this.selected && this.input.leftMousePressed) {
      this.redraw = true
      this.controls.setTransform(this.window.ctx)
      const t = this.window.ctx.getTransform()
      // transform mouse screen->world
      const sx = (this.input.mouseX - t.e) / t.a
      const sy = (this.input.mouseY - t.f) / t.d
      // account for stretching
      let [wx, wy] = this.window.inverseTransformCoords(sx, sy)
      // move by center
      this.selected.x = wx - this.selected.w / 2
      this.selected.y = wy - this.selected.h / 2
    }

    const hit = this.checkIntersection()
    if (hit) this.input.cursor = 'default'
    return this.capturedRightClick && hit
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
    const [mx, my] = [this.input.mouseX, this.input.mouseY]

    let hit = undefined
    this.graphvis.proxies.forEach((proxy) => {
      if (hit) return

      const [px, py] = this.transformCoordsWorld2Screen(proxy.x, proxy.y)
      const [pw, ph] = this.transformDims(proxy.w, proxy.h)

      if (global.rectIntersect(mx, my, px, py, pw, ph)) hit = proxy
    })

    return hit
  }
  // world -> screen
  transformCoordsWorld2Screen(x, y) {
    this.controls.setTransform(this.window.ctx)
    const t = this.window.ctx.getTransform()
    let [tx, ty] = this.window.transformCoords(x, y)
    tx = t.a * tx + t.e
    ty = t.d * ty + t.f
    return [tx, ty]
  }
  // screen -> world
  transformCoordsScreen2World(x, y) {
    this.controls.setTransform(this.window.ctx)
    const t = this.window.ctx.getTransform()
    x = (x - t.e) / t.a
    y = (y - t.f) / t.d
    return [x, y]
  }
  // screen -> world
  transformCoordsScreen2World2(x, y) {
    this.controls.setTransform(this.window.ctx)
    const t = this.window.ctx.getTransform()
    let [tx, ty] = this.window.inverseTransformCoords(x, y)
    tx = (tx - t.e) / t.a
    ty = (ty - t.f) / t.d
    return [tx, ty]
  }
  transformDims(w, h) {
    this.controls.setTransform(this.window.ctx)
    const t = this.window.ctx.getTransform()
    let [tw, th] = this.window.transformDims(w, h)
    tw *= t.a
    th *= t.d
    return [tw, th]
  }
}
