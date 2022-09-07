import { PORT_COLOR } from './ScriptGraphVisualizer.js'
import { UIElement } from './UIElement.js'
import { global } from '%engine/Global.js'

const HEIGHT_PADDING = 16
const LINE_WIDTH = [2, 4]
const COLORS = [
  { shadow: '#0007', node: '#334155', outline: '#6b7280' },
  { shadow: '#0007', node: '#334155', outline: '#e2e8f0' },
]
export class ScriptGraphNodeProxy extends UIElement {
  constructor(window, node) {
    super(LINE_WIDTH, COLORS)
    this.node = node
    this.x = 0
    this.y = 0
    this.selectedPort = undefined

    this.font = 'sans-serif'
    this.nameFontSize = 32
    this.portFontSize = 24
    this.portRadius = 8
    this.portNamePaddingX = this.portRadius * 2
    this.portDotOffset = 10

    // compute name height
    let text = window.textMetrics(
      this.node.debugName,
      this.font,
      this.nameFontSize
    )
    this.nameHeight =
      (text.actualBoundingBoxDescent + text.actualBoundingBoxAscent) * 2

    // compute node width
    const inPorts = this.node.data.inputPorts,
      outPorts = this.node.data.outputPorts
    let inWidth = 0,
      outWidth = 0
    for (var i = 0; i < Math.max(inPorts.length, outPorts.length); i++) {
      if (i < inPorts.length)
        inWidth = Math.max(
          inWidth,
          window.textMetrics(inPorts[i].name, this.font, this.portFontSize)
            .width + this.portNamePaddingX
        )
      if (i < outPorts.length)
        outWidth = Math.max(
          outWidth,
          window.textMetrics(outPorts[i].name, this.font, this.portFontSize)
            .width + this.portNamePaddingX
        )
    }
    this.w = Math.max(inWidth + outWidth, Math.ceil(text.width)) + 32

    // compute port height
    text = window.textMetrics(this.node.debugName, this.font, this.portFontSize)
    this.portHeight =
      (text.actualBoundingBoxDescent + text.actualBoundingBoxAscent) * 2

    // compute node height
    this.maxPortCount = Math.max(
      this.node.outputTypes.length,
      this.node.inputTypes.length
    )
    if (this.maxPortCount)
      this.h =
        this.nameHeight + this.portHeight * this.maxPortCount + HEIGHT_PADDING
    else this.h = this.nameHeight
  }
  draw(visualizer, window, zoom) {
    const tx = this.x,
      ty = this.y
    const selected = ~~(this.selected || this.hovered)
    // node
    window.drawRoundRectShadow(
      tx,
      ty,
      this.w,
      this.h,
      this.portRadius,
      this.colors[selected].shadow,
      6 * zoom,
      4 * zoom
    )
    window.drawRoundRect(
      tx,
      ty,
      this.w,
      this.h,
      this.portRadius,
      this.colors[selected].node
    )
    const lineWidth = this.lineWidth[selected] / Math.min(zoom, 1)
    // name underline
    if (this.maxPortCount)
      window.drawLine(
        tx,
        ty + this.nameHeight,
        tx + this.w,
        ty + this.nameHeight,
        '#6b7280',
        this.lineWidth[0]
      )
    // node outline
    window.strokeRoundRect(
      tx,
      ty,
      this.w,
      this.h,
      this.portRadius,
      this.colors[selected].outline,
      lineWidth,
      selected ? visualizer.outlineAlpha.getValue() : 1
    )
    // name
    window.drawCenteredText(
      this.node.debugName,
      tx + this.w / 2,
      ty + this.nameHeight / 2,
      this.font,
      this.nameFontSize,
      '#f9fafb'
    )
    // ports
    const portBaseY = ty + this.nameHeight + this.portHeight / 2
    this.node.data.inputPorts.forEach((port, i) => {
      const portY = portBaseY + i * this.portHeight
      window.drawArc(
        tx - 2,
        portY + this.portDotOffset,
        this.portRadius,
        -Math.PI / 2,
        Math.PI / 2,
        PORT_COLOR[port.typename].dot
      )
      window.drawText(
        port.name,
        tx + this.portNamePaddingX,
        portY,
        this.font,
        this.portFontSize,
        PORT_COLOR[port.typename].name
      )
      const width = window.textMetrics(
        port.name,
        this.font,
        this.portFontSize
      ).width
      window.strokeRect(
        tx,
        portY,
        this.portNamePaddingX + width,
        2 * this.portRadius,
        this.selectedPort === port ? '#00f' : '#f00',
        1
      )
    })
    this.node.data.outputPorts.forEach((port, i) => {
      const portY = portBaseY + i * this.portHeight
      window.drawArc(
        tx + this.w + 2,
        portY + this.portDotOffset,
        this.portRadius,
        Math.PI / 2,
        -Math.PI / 2,
        PORT_COLOR[port.typename].dot
      )
      const width = window.textMetrics(
        port.name,
        this.font,
        this.portFontSize
      ).width
      window.drawText(
        port.name,
        tx + this.w - width - this.portNamePaddingX,
        portY,
        this.font,
        this.portFontSize,
        PORT_COLOR[port.typename].name
      )
      window.strokeRect(
        tx + this.w - width - this.portNamePaddingX,
        portY,
        width + this.portNamePaddingX,
        2 * this.portRadius,
        this.selectedPort === port ? '#00f' : '#f00',
        1
      )
    })
    /**
     * @HATODO internals
     */
    this.node.data.internalPorts.forEach((port, i) => {
      const portY = portBaseY + i * this.portHeight
      window.drawText(
        `${port.name}: ${this.node.internalValues[i]}`,
        tx + this.portNamePaddingX,
        portY,
        this.font,
        this.portFontSize,
        PORT_COLOR[port.typename].name
      )
    })
  }
  getInPortCoords(i) {
    let y = 0
    if (i === -1) {
      y = this.nameHeight / 2
    } else {
      y = this.nameHeight + this.portHeight * (0.5 + i) + this.portDotOffset
    }
    return { x: this.x, y: this.y + y }
  }
  getOutPortCoords(i) {
    let y = 0
    if (i === -1) {
      y = this.nameHeight / 2
    } else {
      y = this.nameHeight + this.portHeight * (0.5 + i) + this.portDotOffset
    }
    return { x: this.x + this.w, y: this.y + y }
  }
  checkPortIntersection(window, x, y) {
    let hit = {}
    const portBaseY = this.y + this.nameHeight + this.portHeight / 2

    this.node.data.inputPorts.forEach((port, i) => {
      const portX = this.x
      const portY = portBaseY + i * this.portHeight
      const width = window.textMetrics(
        port.name,
        this.font,
        this.portFontSize
      ).width
      if (
        global.rectIntersect(
          x,
          y,
          portX,
          portY,
          width + this.portNamePaddingX,
          2 * this.portRadius
        )
      ) {
        hit = { port, portX, portY, in: true, index: i }
      }
    })

    this.node.data.outputPorts.forEach((port, i) => {
      const portY = portBaseY + i * this.portHeight
      const width = window.textMetrics(
        port.name,
        this.font,
        this.portFontSize
      ).width
      const portX = this.x + this.w - width - this.portNamePaddingX
      if (
        global.rectIntersect(
          x,
          y,
          portX,
          portY,
          width + this.portNamePaddingX,
          2 * this.portRadius
        )
      ) {
        hit = { port, portX, portY, in: false, index: i }
      }
    })

    return hit
  }
}
