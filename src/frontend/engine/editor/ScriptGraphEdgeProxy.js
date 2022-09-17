import { PORT_COLOR } from './ScriptGraphVisualizer.js'
import { UIElement } from './UIElement.js'
import { global } from '%engine/Global.js'

const COLORS = { activationEdge: '#facc15', hovered: '#e2e8f0' }
const LINE_WIDTH = [2, 5]
export class ScriptGraphEdgeProxy extends UIElement {
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
    let color = undefined

    // generate color gradient based on port types
    if (this.endPort === -1 || !this.startProxy.node.data.outputPorts.length) {
      color = this.colors.activationEdge
    } else {
      // get scaled coordinates
      const [sx, sy] = window.scaleCoords(startCoords.x, startCoords.y)
      const [ex, ey] = window.scaleCoords(endCoords.x, endCoords.y)
      // draw the line using a gradient between the two port's colors
      color = window.ctx.createLinearGradient(sx, sy, ex, ey)
      const startType =
        this.startProxy.node.data.outputPorts[this.startPort].typename
      const endType = this.endProxy.node.data.inputPorts[this.endPort].typename
      const startColor = PORT_COLOR[startType].edge
      const endColor = PORT_COLOR[endType].edge
      const blobSize = 0.05 * (100 / global.lineLength(sx, sy, ex, ey))
      const blobStart = visualizer.edgeBlob.getValue(),
        blobEnd = Math.min(blobStart + blobSize, 1)
      const mix1Start = Math.max(0, blobStart - blobSize)
      const mix2Start = Math.min(1, blobEnd + blobSize)
      const mix1 = global.colorMix(endColor, startColor, blobStart)
      const mix2 = global.colorMix(endColor, startColor, blobEnd)
      const blobColor = global.colorMix(
        PORT_COLOR[endType].name,
        PORT_COLOR[startType].name,
        blobStart
      )

      color.addColorStop(0, startColor)
      color.addColorStop(mix1Start, mix1)
      color.addColorStop((blobStart + blobEnd) / 2, blobColor)
      color.addColorStop(mix2Start, mix2)
      color.addColorStop(1, endColor)
    }

    const selected = this.hovered || this.selected
    // draw outline if hovered
    if (selected) {
      window.drawTransparentLine(
        startCoords.x,
        startCoords.y,
        endCoords.x,
        endCoords.y,
        this.colors.hovered,
        this.lineWidth[~~selected] * 2,
        visualizer.outlineAlpha.getValue()
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
  }
  getStartCoords() {
    return this.startProxy.getOutPortCoords(this.startPort)
  }
  getEndCoords() {
    return this.endProxy.getInPortCoords(this.endPort)
  }
}
