import { PORT_COLOR } from './ScriptVisualizer.js'
import { UIElement } from './UIElement.js'
import { global } from '%engine/Global.js'

export const COLORS = { activationEdge: '#facc15', hovered: '#d4d4d4' }
const LINE_WIDTH = [2, 5]
const BLOB_WIDTH = [5, 10]
export class ScriptEdgeProxy extends UIElement {
  constructor(startProxy, startPort, endProxy, endPort) {
    super(LINE_WIDTH, COLORS)
    this.startProxy = startProxy
    this.startPort = startPort
    this.endProxy = endProxy
    this.endPort = endPort
  }
  draw(visualizer, window) {
    const startCoords = this.getStartCoords()
    const endCoords = this.getEndCoords()
    const selected = this.hovered || this.selected

    // get scaled coordinates
    const [sx, sy] = window.scaleCoords(startCoords.x, startCoords.y)
    const [ex, ey] = window.scaleCoords(endCoords.x, endCoords.y)
    const blobSize = 5 / global.lineLength(sx, sy, ex, ey)
    const blobStart = visualizer.edgeBlob.getValue(),
      blobEnd = Math.min(blobStart + blobSize, 1),
      blobMid = (blobStart + blobEnd) / 2
    const mix1Start = Math.max(0, blobStart - blobSize)
    const mix2Start = Math.min(1, blobEnd + blobSize)
    const blobX = blobMid * endCoords.x + (1 - blobMid) * startCoords.x
    const blobY = blobMid * endCoords.y + (1 - blobMid) * startCoords.y

    let startColor = this.colors.activationEdge
    let endColor = this.colors.activationEdge
    let blobColor = this.colors.activationEdge
    // if this isn't an activation edge, get port colors
    if (
      !(this.endPort === -1 || !this.startProxy.node.data.outputPorts.length)
    ) {
      const startType =
        this.startProxy.node.data.outputPorts[this.startPort].typename
      const endType = this.endProxy.node.data.inputPorts[this.endPort].typename
      startColor = PORT_COLOR[startType].edge
      endColor = PORT_COLOR[endType].edge
      blobColor = global.colorMix(
        PORT_COLOR[endType].name,
        PORT_COLOR[startType].name,
        blobStart
      )
    }

    // draw the line using a gradient between the two port's colors
    let color = window.ctx.createLinearGradient(sx, sy, ex, ey)

    const mix1 = global.colorMix(endColor, startColor, blobStart)
    const mix2 = global.colorMix(endColor, startColor, blobEnd)
    color.addColorStop(0, startColor)
    color.addColorStop(mix1Start, mix1)
    color.addColorStop(blobMid, blobColor)
    color.addColorStop(mix2Start, mix2)
    color.addColorStop(1, endColor)

    // draw outline if hovered
    if (selected) {
      const alpha = visualizer.outlineAlpha.getValue()
      const lineWidth = this.lineWidth[~~selected]
      window.drawTransparentLine(
        startCoords.x,
        startCoords.y,
        endCoords.x,
        endCoords.y,
        this.colors.hovered,
        lineWidth * 2,
        alpha
      )
      window.setCompositeOperation('destination-out')
      window.drawTransparentArc(
        blobX,
        blobY,
        BLOB_WIDTH[1] + lineWidth,
        0,
        2 * Math.PI,
        this.colors.hovered,
        1
      )
      window.resetCompositeOperation()
      window.drawTransparentArc(
        blobX,
        blobY,
        BLOB_WIDTH[1] + lineWidth,
        0,
        2 * Math.PI,
        this.colors.hovered,
        alpha
      )
    }
    // draw edge
    window.drawLine(
      startCoords.x,
      startCoords.y,
      endCoords.x,
      endCoords.y,
      color,
      this.lineWidth[~~selected]
    )
    // draw blob
    window.drawArc(
      blobX,
      blobY,
      BLOB_WIDTH[~~selected],
      0,
      2 * Math.PI,
      blobColor
    )
  }
  getStartCoords() {
    return this.startProxy.getOutPortCoords(this.startPort)
  }
  getEndCoords() {
    return this.endProxy.getInPortCoords(this.endPort)
  }
}
