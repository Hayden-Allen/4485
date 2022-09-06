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
    const node = this.checkIntersection()
    const { edge, index } = this.checkEdgeIntersection()
    // moving a node
    if (e.button === 0) {
      this.redraw = true

      // deselect previous
      if (this.selected) this.selected.selected = false
      // select new
      this.selected = node || edge
      if (this.selected) {
        this.selected.selected = true
        this.selectedX = this.selected.x
        this.selectedY = this.selected.y
      }
    }
    // delete an edge
    else if (e.button === 2) {
      if (index > -1) {
        this.graphvis.removeEdge(index)
        this.graphvis.graph.compile()
      }
    }
    if (node) {
      this.input.cursor = 'default'
      if (e.button === 2) {
        this.input.canDrag = false
        this.capturedRightClick = true
      }
    }
    return node
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
      // transform mouse screen->world
      const [wx, wy] = this.window.inverseTransformCoords(
        this.input.mouseX,
        this.input.mouseY
      )
      // move node by its center
      this.selected.x = wx - this.selected.w / 2
      this.selected.y = wy - this.selected.h / 2
    }

    const { index } = this.checkEdgeIntersection()
    if (index > -1) this.input.cursor = 'default'

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
    e.window.ctx.fillStyle = '#f00'
    e.window.ctx.fillRect(
      e.window.canvas.width / 2 - 2,
      e.window.canvas.height / 2 - 2,
      4,
      4
    )
  }
  checkIntersection() {
    let hit = undefined
    this.graphvis.proxies.forEach((proxy) => {
      if (hit) return

      const [px, py] = this.transformCoords(proxy.x, proxy.y)
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
      ) {
        hit = proxy
        proxy.hovered = true
      } else proxy.hovered = false
    })

    return hit
  }
  checkEdgeIntersection() {
    let index = -1,
      edge = undefined
    this.graphvis.edgeProxies.forEach((proxy, i) => {
      // get edge bounds (world space)
      const { x: startX, y: startY } = proxy.getStartCoords()
      const { x: endX, y: endY } = proxy.getEndCoords()
      // transform into canvas space
      // edge (x, y) = (1 - t) * (startX, startY) + t * (endX, endY)
      const [screenStartX, screenStartY] = this.transformCoords(startX, startY)
      const [screenEndX, screenEndY] = this.transformCoords(endX, endY)

      // compute min distance from cursor to edge
      const edgeOrigin = new Vec2(screenStartX, screenStartY)
      const edgeDir = new Vec2(
        screenStartX - screenEndX,
        screenStartY - screenEndY
      )
      // constant-normal form of the line
      const n = edgeDir.perpendicular().norm()
      const c = n.dot(edgeOrigin)
      // project cursor coords (already in canvas space) onto the edge
      const mv = new Vec2(this.input.mouseX, this.input.mouseY)
      const distance = n.dot(mv) - c

      // if no other edge has been hit yet and cursor is within a reasonable distance of the line
      if (
        index === -1 &&
        Math.abs(distance) <= 10 &&
        mv.x >= Math.min(screenEndX, screenStartX) &&
        mv.x <= Math.max(screenEndX, screenStartX)
      ) {
        index = i
        edge = proxy
        proxy.hovered = true
      } else proxy.hovered = false
    })
    return { index, edge }
  }
  // world->canvas
  transformCoords(x, y) {
    const t = this.controls.setTransform(this.window.ctx)
    let [tx, ty] = this.window.scaleCoords(x, y)
    tx = t.a * tx + t.e
    ty = t.d * ty + t.f
    return [tx, ty]
  }
  // world->canvas
  transformDims(w, h) {
    const t = this.controls.setTransform(this.window.ctx)
    let [tw, th] = this.window.scaleDims(w, h)
    tw *= t.a
    th *= t.d
    return [tw, th]
  }
}
