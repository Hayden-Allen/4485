import { Layer } from '%window/Layer.js'
import { ScriptVisualizer } from './ScriptVisualizer.js'
import { global } from '%engine/Global.js'
import { Vec2 } from '%util/Vec2.js'
import AddNodeMenu from 'components/popup/contextMenus/AddNodeMenu.svelte'
import KeyPortEditor from 'components/popup/editors/KeyEditor.svelte'
import IntPortEditor from 'components/popup/editors/IntEditor.svelte'
import BoolPortEditor from 'components/popup/editors/BoolEditor.svelte'
import FloatPortEditor from 'components/popup/editors/FloatEditor.svelte'
import StringPortEditor from 'components/popup/editors/StringEditor.svelte'
import { PORT_COLOR } from './ScriptVisualizer.js'
import { ScriptEdgeProxy } from './ScriptEdgeProxy'

export class ScriptLayer extends Layer {
  constructor(input, controls, playerScript) {
    super('ScriptLayer')
    this.input = input
    this.controls = controls
    this.capturedLeftClick = false
    this.graphvis = undefined
    this.playerScript = playerScript
    this.selected = undefined
    this.selectedX = 0
    this.selectedY = 0
    this.hovered = undefined
  }
  setScript(script) {
    this.playerScript = script
    if (this.graphvis) {
      this.graphvis.graph = this.playerScript
    }
  }
  onAttach() {
    // need this.window to be valid, so can't call in constructor
    this.graphvis = new ScriptVisualizer(this.window, this.playerScript)
    this.graphvis.arrange()
  }
  onMouseScroll() {
    const hit = this.checkIntersection()
    if (hit) this.input.cursor = 'default'
  }
  handleMouseDown(e) {
    const node = this.checkIntersection()
    const { edge } = this.checkEdgeIntersection()

    if (node) this.input.cursor = 'default'

    if (this.input.leftMousePressed) {
      // deselect previous
      if (this.selected) this.selected.selected = false
      // select new
      this.setSelected(node || edge)
      if (this.selected) {
        this.selectedX = this.selected.x
        this.selectedY = this.selected.y
      } else {
        this.selectedPort = undefined
      }

      if (node) {
        this.input.canDrag = false
        this.capturedLeftClick = true

        const port = node.checkPortIntersection(
          this.window,
          ...this.inverseTransformCoords(this.input.mouseX, this.input.mouseY)
        )
        if (port) {
          if (port.internal) {
            // create popup
            e.domEvent.preventDefault()
            e.domEvent.stopPropagation()
            this.createEditorPopup(node, port)
            // remove underline
            this.selectedPort = undefined
            node.hoveredPort = -1
          } else {
            this.selectedPort = port
          }
        }
      }
    }
    // right clicking (not on a node)
    else if (
      (e.button === 2 ||
        (e.button === 0 && this.window.inputCache.isKeyPressed('Control'))) &&
      !node
    ) {
      e.domEvent.preventDefault()
      e.domEvent.stopPropagation()
      this.createAddNodeMenuPopup()
    } else if (e.button === 1 && (node || edge)) {
      this.deleteProxy(node || edge)
    }

    return node || edge
  }
  onFocus(e) {
    this.input.mouseX = e.x
    this.input.mouseY = e.y
    return this.handleMouseDown(e)
  }
  onMouseDown(e) {
    return this.handleMouseDown(e)
  }
  onMouseUp(e) {
    this.input.canDrag = true

    if (e.button === 0) {
      if (this.capturedLeftClick) {
        const node = this.checkIntersection()
        if (node) {
          this.input.cursor = 'default'
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
            }
            // activation edge
            else if (!port.port && port.node !== this.selectedPort.node) {
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

      this.capturedLeftClick = false
      this.selectedPort = undefined
    }
    // return hit
  }
  onMouseMove() {
    // move selected node
    if (
      this.capturedLeftClick &&
      !this.selectedPort &&
      this.selected &&
      this.input.leftMousePressed
    ) {
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
      const port = hit.checkPortIntersection(
        this.window,
        ...this.inverseTransformCoords(this.input.mouseX, this.input.mouseY)
      )
      if (port && port.internal) {
        hit.hoveredPort = port.index
        this.input.cursor = 'pointer'
      } else {
        hit.hoveredPort = -1
      }
    } else {
      this.hovered = undefined
    }

    return this.capturedLeftClick && hit
  }
  async onKeyDown(e) {
    if (
      !e.repeat &&
      e.ctrlPressed &&
      e.shiftPressed &&
      e.key.toLowerCase() === 'o'
    ) {
      e.domEvent.preventDefault()
      let fileHandle = null
      try {
        ;[fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: 'JS file',
              accept: { 'text/javascript': ['.js'] },
            },
          ],
        })
      } catch (err) {
        return
      }
      const fileData = await fileHandle.getFile()
      const text = await fileData.text()
      const parsed = JSON.parse(text.replace('export default ', ''))
      this.graphvis.graph.deserialize(parsed)
      this.graphvis.arrange()
    }
    if (!e.repeat && e.ctrlPressed && e.key.toLowerCase() === 's') {
      e.domEvent.preventDefault()
      this.graphvis.arrange()
      if (e.shiftPressed) {
        let fileHandle = null
        try {
          fileHandle = await window.showSaveFilePicker({
            types: [
              {
                description: 'JS file',
                accept: { 'text/javascript': ['.js'] },
              },
            ],
          })
        } catch (err) {
          return
        }
        this.graphvis.graph.debugName = fileHandle.name.split('.')[0]
        const writable = await fileHandle.createWritable()
        const contents =
          'export default ' +
          JSON.stringify(this.graphvis.graph.serialize(), null, 2)
        await writable.write(contents)
        await writable.close()
      }
    }
    if (this.selected && (e.key === 'Backspace' || e.key === 'Delete'))
      this.deleteProxy(this.selected)
  }
  onRender(e) {
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
    this.capturedLeftClick = false
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
    if (this.selected) {
      this.selected.deselect()
      this.selected = undefined
    }

    const self = this
    return this.createPopup(AddNodeMenu, ({ mouseX, mouseY, canvas }) => {
      const canvasBounds = canvas.getBoundingClientRect()
      const width = 400,
        height = 320
      const x = global.clamp(
        canvasBounds.left + mouseX / window.devicePixelRatio,
        canvasBounds.left,
        canvasBounds.right - width
      )
      const y = global.clamp(
        canvasBounds.top + mouseY / window.devicePixelRatio,
        canvasBounds.top,
        canvasBounds.bottom - height
      )
      return {
        x,
        y,
        width: width / window.devicePixelRatio,
        height: height / window.devicePixelRatio,
        borderAlphaVarying: self.graphvis.outlineAlpha,
        computeReposition: (x, y) => {
          if (
            x > canvasBounds.left &&
            x < canvasBounds.right &&
            y > canvasBounds.top &&
            y < canvasBounds.bottom
          ) {
            const newX = global.clamp(
              x,
              canvasBounds.left,
              canvasBounds.right - width
            )
            const newY = global.clamp(
              y,
              canvasBounds.top,
              canvasBounds.bottom - height
            )
            self.input.mouseX =
              (x - canvasBounds.left) * window.devicePixelRatio
            self.input.mouseY = (y - canvasBounds.top) * window.devicePixelRatio
            return { x: newX, y: newY }
          } else {
            return null
          }
        },
        onAddNode: (name) => {
          const node = self.graphvis.graph.createNode(name)
          self.graphvis.recompile()
          const proxy = self.graphvis.proxies.get(node.id)
          const [x, y] = self.inverseTransformCoords(
            self.input.mouseX,
            self.input.mouseY
          )
          proxy.x = x
          proxy.y = y
          self.setSelected(proxy)
        },
      }
    })
  }
  createEditorPopup(proxy, port) {
    const [editor, getProps] = this.getCreateEditorPopupInfo(proxy, port)
    return this.createPopup(editor, getProps)
  }
  getCreateEditorPopupInfo(proxy, port) {
    const typenameToEditor = {
      key: KeyPortEditor,
      int: IntPortEditor,
      string: StringPortEditor,
      bool: BoolPortEditor,
      float: FloatPortEditor,
    }
    const nodeProps = { proxy, port }
    return [
      typenameToEditor[port.port.editorTypename],
      (options) => this.getPortEditorProps({ ...options, ...nodeProps }),
    ]
  }
  getPortEditorProps(options) {
    const { x: wx, y: wy } = options.proxy.getInternalPortCoords(
      options.port.index,
      this.window
    )
    const [sx, sy] = this.transformCoords(wx, wy)
    const canvasBounds = options.canvas.getBoundingClientRect()
    const self = this
    return {
      x: canvasBounds.left + sx / window.devicePixelRatio,
      y: canvasBounds.top + sy / window.devicePixelRatio,
      bgColor: PORT_COLOR[options.port.port.typename].editor.background,
      fgColor: PORT_COLOR[options.port.port.typename].editor.foreground,
      placeholderColor:
        PORT_COLOR[options.port.port.typename].editor.placeholder,
      currentValue: options.proxy.node.internalValues[options.port.index],
      beforeDestroyPopup: (popup) => {
        if (!popup.validate || popup.validate()) {
          options.proxy.node.internalValues[options.port.index] =
            popup.currentValue
          options.proxy.computeNodeWidth(self.window)
          /**
           * @HATODO don't necessarily need to do this
           * just need to rebuild exportNodes in the graph (in case values changed)
           */
          self.graphvis.recompile()
        }
        options.proxy.deselect()
      },
    }
  }
  setSelected(proxy) {
    this.selected = proxy
    if (this.selected) this.selected.select()
  }
  deleteProxy(proxy) {
    if (proxy instanceof ScriptEdgeProxy) {
      const inputNode = proxy.endProxy.node
      const inputIndex = proxy.endPort
      const outputNode = proxy.startProxy.node
      const outputIndex = proxy.startPort
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
      this.graphvis.graph.removeNode(proxy.node)
      this.graphvis.recompile()
    }
    this.selected = undefined
  }
}
