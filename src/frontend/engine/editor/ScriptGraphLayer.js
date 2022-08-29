import { Layer } from '%window/Layer.js'
import { ScriptGraphVisualizer } from './ScriptGraphVisualizer.js'
import { global } from '%engine/Global.js'
import { Vec2 } from '%util/Vec2.js'

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
    // moving a node
    if (e.button === 0) {
      this.redraw = true

      if (this.selected) this.selected.selected = false
      this.selected = hit
      if (this.selected) {
        this.selected.selected = true
        this.selectedX = this.selected.x
        this.selectedY = this.selected.y
      }
    } else if (e.button === 2) {
      const edgeIndex = this.checkEdgeIntersection()
      if (edgeIndex > -1) this.graphvis.removeEdge(edgeIndex)
    }
    if (hit) {
      this.input.cursor = 'default'
      if (e.button === 2) {
        this.input.canDrag = false
        this.capturedRightClick = true
      }
    }
    return hit
  }
  onMouseUp(e) {
    this.input.canDrag = true
    const hit = this.checkIntersection()
    if (hit) this.input.cursor = 'default'
    if (e.button === 2) this.capturedRightClick = false
    return hit
  }
  onMouseMove() {
    this.redraw = this.input.rightMousePressed && !this.capturedRightClick

    // move selected node
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
  onKeyDown(e) {
    if (!e.repeat && e.ctrlPressed && e.key === 's') {
      this.graphvis.arrange()
      this.redraw = true
    }
  }
  onResize() {
    this.redraw = true
  }
  onRender(e) {
    // outline opacity changes over time
    if (this.selected) {
      this.redraw = true
    }

    // if (!this.redraw) return
    // this.redraw = false

    e.window.ctx.resetTransform()
    e.window.clear()
    this.controls.setTransform(e.window.ctx)
    this.graphvis.draw(e.window, this.controls.zoom)

    e.window.ctx.resetTransform()
    const mv = new Vec2(this.input.mouseX, this.input.mouseY)
    e.window.ctx.fillStyle = '#0f0'
    e.window.ctx.fillRect(mv.x - 2, mv.y - 2, 5, 5)
    this.graphvis.edgeProxies.forEach((proxy) => {
      // get edge bounds
      const { x: sx, y: sy } = proxy.getStartCoords()
      const { x: ex, y: ey } = proxy.getEndCoords()
      // transform into screen-space
      // edge (x, y) = (1 - t) * (ssx, ssy) + (sex, sey)
      let [ssx, ssy] = this.transformCoordsWorld2Screen(sx, sy)
      let [sex, sey] = this.transformCoordsWorld2Screen(ex, ey)

      // project mouse coords onto line
      const edgeOrigin = new Vec2(ssx, ssy)
      const edgeDir = new Vec2(ssx - sex, ssy - sey)
      const n = edgeDir.perpendicular().norm()
      const d = n.dot(edgeOrigin)

      e.window.ctx.strokeStyle = '#f00'
      e.window.ctx.beginPath()
      e.window.ctx.moveTo((ssx + sex) / 2, (ssy + sey) / 2)
      e.window.ctx.lineTo(
        (ssx + sex) / 2 + n.x * 10,
        (ssy + sey) / 2 + n.y * 10
      )
      e.window.ctx.stroke()
      e.window.ctx.closePath()

      const t = n.dot(mv) - d
      // if the cursor is within the horizontal span of the edge and a reasonable distance from it
      if (
        Math.abs(t) <= 10 &&
        mv.x >= Math.min(sex, ssx) &&
        mv.x <= Math.max(sex, ssx)
      ) {
        e.window.ctx.fillStyle = '#f0f'
        e.window.ctx.fillRect(ssx - 2, ssy - 2, 5, 5)
        e.window.ctx.fillRect(sex - 2, sey - 2, 5, 5)
      }
    })
  }
  checkIntersection() {
    let hit = undefined
    this.graphvis.proxies.forEach((proxy) => {
      if (hit) return

      const [px, py] = this.transformCoordsWorld2Screen(proxy.x, proxy.y)
      const [pw, ph] = this.transformDims(proxy.w, proxy.h)

      if (
        global.rectIntersect(
          this.input.mouseX,
          this.input.mouseY,
          px,
          py,
          pw,
          ph
        )
      )
        hit = proxy
    })

    return hit
  }
  checkEdgeIntersection() {
    let hit = undefined
    this.graphvis.edgeProxies.forEach((proxy, i) => {
      if (hit) return
      // get edge bounds
      const { x: sx, y: sy } = proxy.getStartCoords()
      const { x: ex, y: ey } = proxy.getEndCoords()
      // transform into screen-space
      // edge (x, y) = (1 - t) * (ssx, ssy) + (sex, sey)
      const [ssx, ssy] = this.transformCoordsWorld2Screen(sx, sy)
      const [sex, sey] = this.transformCoordsWorld2Screen(ex, ey)

      // project mouse coords onto line
      const edgeOrigin = new Vec2(ssx, ssy)
      const edgeDir = new Vec2(ssx - sex, ssy - sey)
      const n = edgeDir.perpendicular().norm()
      const d = n.dot(edgeOrigin)
      const mv = new Vec2(this.input.mouseX, this.input.mouseY)

      const t = n.dot(mv) - d
      if (
        Math.abs(t) <= 10 &&
        mv.x >= Math.min(sex, ssx) &&
        mv.x <= Math.max(sex, ssx)
      )
        hit = i
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
  transformDims(w, h) {
    this.controls.setTransform(this.window.ctx)
    const t = this.window.ctx.getTransform()
    let [tw, th] = this.window.transformDims(w, h)
    tw *= t.a
    th *= t.d
    return [tw, th]
  }
}
