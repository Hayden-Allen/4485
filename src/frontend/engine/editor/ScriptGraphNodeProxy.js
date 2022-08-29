import { Varying } from '%component/Varying.js'
import { PORT_COLOR } from './ScriptGraphVisualizer.js'

const HEIGHT_PADDING = 16
export class ScriptGraphNodeProxy {
  constructor(window, node) {
    this.node = node
    this.x = 0
    this.y = 0

    this.font = 'sans-serif'
    this.nameFontSize = 32
    this.portFontSize = 24
    this.portRadius = 8
    this.portNameXPadding = this.portRadius * 2
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
            .width + this.portNameXPadding
        )
      if (i < outPorts.length)
        outWidth = Math.max(
          outWidth,
          window.textMetrics(outPorts[i].name, this.font, this.portFontSize)
            .width + this.portNameXPadding
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

    this.colors = [
      { shadow: '#0007', node: '#334155', outline: '#6b7280' },
      { shadow: '#0007', node: '#334155', outline: '#dc2626' },
    ]
    this.outlineSize = [2, 4]
    this.selected = false
    this.outlineAlpha = new Varying(0.5, 1, -1, { step: 1.0 })
  }
  draw(window, zoom) {
    const tx = this.x,
      ty = this.y
    // node
    window.drawRoundRect(
      tx,
      ty,
      this.w,
      this.h,
      this.portRadius,
      this.colors[~~this.selected].shadow,
      {
        shadowBlur: 6 * zoom,
        shadowOffsetY: 4 * zoom,
      }
    )
    window.drawRoundRect(
      tx,
      ty,
      this.w,
      this.h,
      this.portRadius,
      this.colors[~~this.selected].node
    )
    const lineWidth = this.outlineSize[~~this.selected] / Math.min(zoom, 1)
    // name underline
    if (this.maxPortCount)
      window.drawLine(
        tx,
        ty + this.nameHeight,
        tx + this.w,
        ty + this.nameHeight,
        '#6b7280',
        { width: lineWidth }
      )
    // node outline
    window.drawRoundRect(
      tx,
      ty,
      this.w,
      this.h,
      this.portRadius,
      this.colors[~~this.selected].outline,
      {
        stroke: true,
        width: lineWidth,
        alpha: this.selected ? this.outlineAlpha.getValue() : 1,
      }
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
        tx + this.portNameXPadding,
        portY,
        this.font,
        this.portFontSize,
        PORT_COLOR[port.typename].name
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
        tx + this.w - width - this.portNameXPadding,
        portY,
        this.font,
        this.portFontSize,
        PORT_COLOR[port.typename].name
      )
    })
    /**
     * @HATODO internals
     */
    this.node.data.internalPorts.forEach((port, i) => {
      const portY = portBaseY + i * this.portHeight
      window.drawText(
        `${port.name}: ${this.node.internalValues[i]}`,
        tx + this.portNameXPadding,
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
}
