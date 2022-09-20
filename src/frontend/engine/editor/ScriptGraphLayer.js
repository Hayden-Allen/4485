import { Layer } from '%window/Layer.js'
import { ScriptGraphVisualizer } from './ScriptGraphVisualizer.js'
import { global } from '%engine/Global.js'
import { Vec2 } from '%util/Vec2.js'
import AddNodeMenu from 'components/popup/contextMenus/AddNodeMenu.svelte'
import KeyPortEditor from 'components/popup/editors/KeyEditor.svelte'
import IntPortEditor from 'components/popup/editors/IntEditor.svelte'
import { PORT_COLOR } from './ScriptGraphVisualizer.js'
import { scriptNodeTemplateBank } from '%script/ScriptNodeTemplateBank.js'
import { ScriptGraphEdgeProxy } from './ScriptGraphEdgeProxy'

export class ScriptGraphLayer extends Layer {
  constructor(input, controls, playerScript) {
    super('ScriptGraphLayer')
    this.input = input
    this.controls = controls
    this.redraw = true
    this.capturedLeftClick = false
    this.graphvis = undefined
    this.playerScript = playerScript
    this.selected = undefined
    this.selectedX = 0
    this.selectedY = 0
    this.hovered = undefined
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
      } else this.selectedPort = undefined
    }
    // delete an edge
    else if (e.button === 2) {
      this.createAddNodeMenuPopup()
    }
    if (node) {
      this.input.cursor = 'default'
      if (e.button === 0) {
        this.input.canDrag = false
        this.capturedLeftClick = true
        // convert mouse pos to world space and check for intersection with any port in the hit node
        const port = node.checkPortIntersection(
          this.window,
          ...this.inverseTransformCoords(this.input.mouseX, this.input.mouseY)
        )
        if (port) {
          if (port.internal) {
            this.createEditorPopup(node, port)
            this.selected = undefined
            this.selectedPort = undefined
          } else {
            this.selectedPort = port
          }
        }
      }
    }
    return node
  }
  onMouseUp(e) {
    this.input.canDrag = true
    const hit = this.checkIntersection()
    if (hit) this.input.cursor = 'default'
    if (e.button === 0) {
      this.capturedLeftClick = false
      const node = this.checkIntersection()
      if (node) {
        // convert mouse pos to world space and check for intersection with any port in the hit node
        const port = node.checkPortIntersection(
          this.window,
          ...this.inverseTransformCoords(this.input.mouseX, this.input.mouseY)
        )
        // if we already have a port selected and it can be connected to the new port, add an edge
        if (port && !port.internal) {
          if (this.selectedPort && this.selectedPort.in ^ port.in) {
            if (this.selectedPort.in)
              this.selectedPort.node.attachAsInput(
                port.node,
                port.index,
                this.selectedPort.index
              )
            else
              this.selectedPort.node.attachAsOutput(
                this.selectedPort.index,
                port.node,
                port.index
              )
            this.graphvis.recompile()
            this.selectedPort = undefined
          } else {
            this.selectedPort = port
          }
          this.selectedPort = undefined
        }
      }
    }
    return hit
  }
  onMouseMove() {
    this.redraw = this.input.leftMousePressed && !this.capturedLeftClick

    // move selected node
    if (!this.selectedPort && this.selected && this.input.leftMousePressed) {
      this.redraw = true
      this.controls.setTransform(this.window.ctx)
      // transform mouse screen->world
      const [mx, my] = this.inverseTransformCoords(
        this.input.mouseX,
        this.input.mouseY
      )
      const [lmx, lmy] = this.inverseTransformCoords(
        this.input.lastMouseX,
        this.input.lastMouseY
      )
      // move node by its center
      this.selected.x += mx - lmx
      this.selected.y += my - lmy
    }

    const { index, edge } = this.checkEdgeIntersection()
    const hit = this.checkIntersection()
    if (index > -1) {
      this.input.cursor = 'default'
      this.hovered = edge
    } else if (hit) {
      this.input.cursor = 'default'
      this.hovered = hit
    } else {
      this.hovered = undefined
      // need to redraw once to get rid of the outline
      this.redraw = true
    }

    return this.capturedLeftClick && hit
  }
  onKeyDown(e) {
    if (!e.repeat && e.ctrlPressed && e.key === 's') {
      this.graphvis.arrange()
      this.redraw = true
    }
    if (this.selected && (e.key === 'Backspace' || e.key === 'Delete')) {
      if (this.selected instanceof ScriptGraphEdgeProxy) {
        const inputNode = this.selected.endProxy.node
        const inputIndex = this.selected.endPort
        const outputNode = this.selected.startProxy.node
        const outputIndex = this.selected.startPort
        this.graphvis.graph.removeEdge(
          outputNode,
          outputIndex,
          inputNode,
          inputIndex
        )
        this.graphvis.graph.removeEdge(
          inputNode,
          inputIndex,
          outputNode,
          outputIndex
        )
        this.graphvis.recompile()
      } else {
        this.graphvis.graph.removeNode(this.selected.node)
        this.graphvis.recompile()
      }
    }
  }
  onResize() {
    this.redraw = true
  }
  onRender(e) {
    // outline opacity changes over time
    if (this.selected || this.hovered) {
      this.redraw = true
    }

    // if (!this.redraw) return
    // this.redraw = false

    e.window.ctx.resetTransform()
    e.window.clear()
    this.controls.setTransform(e.window.ctx)
    this.graphvis.draw(e.window, this.controls.zoom)

    if (this.selectedPort) {
      const { x, y } = this.selectedPort.in
        ? this.selectedPort.proxy.getInPortCoords(this.selectedPort.index)
        : this.selectedPort.proxy.getOutPortCoords(this.selectedPort.index)
      this.window.drawLine(
        x,
        y,
        ...this.inverseTransformCoords(this.input.mouseX, this.input.mouseY),
        this.selectedPort.color,
        2
      )
    }
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
  // screen->world
  inverseTransformCoords(x, y) {
    const t = this.controls.setTransform(this.window.ctx)
    const screenX = (x - t.e) / t.a
    const screenY = (y - t.f) / t.d
    const s = this.window.getScalingFactor()
    return [Math.floor(screenX / s), Math.floor(screenY / s)]
  }
  // world->canvas
  transformDims(w, h) {
    const t = this.controls.setTransform(this.window.ctx)
    let [tw, th] = this.window.scaleDims(w, h)
    tw *= t.a
    th *= t.d
    return [tw, th]
  }
  createPopup(PopupType, createPopupProps) {
    const self = this
    const canvas = this.window.canvas
    const { beforeDestroyPopup, ...createdProps } = createPopupProps({
      mouseX: self.input.mouseX,
      mouseY: self.input.mouseY,
      canvas,
    })
    let alreadyDestroying = false
    const popup = new PopupType({
      target: document.body,
      props: {
        ...createdProps,
        onDestroyPopup: () => {
          if (alreadyDestroying) {
            return
          }
          alreadyDestroying = true
          if (beforeDestroyPopup) {
            beforeDestroyPopup(popup)
          }
          popup.$destroy()
          canvas.focus()
        },
      },
    })
    return popup
  }
  createAddNodeMenuPopup() {
    const self = this
    return this.createPopup(AddNodeMenu, ({ mouseX, mouseY, canvas }) => {
      const canvasBounds = canvas.getBoundingClientRect()
      return {
        x: canvasBounds.left + mouseX,
        y: canvasBounds.top + mouseY,
        nodeTypeNames: scriptNodeTemplateBank.getNodeTypeNames(),
        checkCanReposition: (x, y) => {
          return (
            x > canvasBounds.left &&
            x < canvasBounds.right &&
            y > canvasBounds.top &&
            y < canvasBounds.bottom
          )
        },
        onAddNode: (name) => {
          const node = scriptNodeTemplateBank
            .get(name)
            .createNode(self.graphvis.graph)
          self.graphvis.recompile()
          const proxy = self.graphvis.proxies.get(node.id)
          const [x, y] = self.inverseTransformCoords(
            self.input.mouseX,
            self.input.mouseY
          )
          proxy.x = x
          proxy.y = y
        },
      }
    })
  }
  createEditorPopup(proxy, port) {
    const [editor, getProps] = this.getCreateEditorPopupInfo(proxy, port)
    return this.createPopup(editor, getProps)
  }
  getCreateEditorPopupInfo(proxy, port) {
    const nodeProps = { proxy, port }
    if (port.port.editorTypename === 'key') {
      return [
        KeyPortEditor,
        (options) =>
          this.getPortEditorProps(
            { ...options, ...nodeProps },
            this.getKeyPortEditorProps
          ),
      ]
    } else if (port.port.editorTypename === 'int') {
      return [
        IntPortEditor,
        (options) =>
          this.getPortEditorProps(
            { ...options, ...nodeProps },
            this.getIntPortEditorProps
          ),
      ]
    } else {
      return null
    }
  }
  getPortEditorProps(options, getAdditionalProps) {
    const { x: wx, y: wy } = options.proxy.getInternalPortCoords(
      options.port.index,
      this.window
    )
    const [sx, sy] = this.transformCoords(wx, wy)
    const canvasBounds = options.canvas.getBoundingClientRect()
    return {
      x: canvasBounds.left + sx,
      y: canvasBounds.top + sy,
      bgColor: PORT_COLOR[options.port.port.typename].editorBg,
      fgColor: PORT_COLOR[options.port.port.typename].editorFg,
      placeholderColor:
        PORT_COLOR[options.port.port.typename].editorPlaceholder,
      currentValue: options.proxy.node.internalValues[options.port.index],
      beforeDestroyPopup: (popup) => {
        if (popup.validate()) {
          options.proxy.node.internalValues[options.port.index] =
            popup.currentValue
        }
      },
      ...getAdditionalProps(options),
    }
  }
  getKeyPortEditorProps() {
    return {}
  }
  getIntPortEditorProps() {
    return {}
  }
}
