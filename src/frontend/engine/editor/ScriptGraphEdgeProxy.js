import { PORT_COLOR } from './ScriptGraphVisualizer.js'
import { UIElement } from './UIElement.js'

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
      const [sx, sy] = window.transformCoords(startCoords.x, startCoords.y)
      const [ex, ey] = window.transformCoords(endCoords.x, endCoords.y)
      // draw the line using a gradient between the two port's colors
      color = window.ctx.createLinearGradient(sx, sy, ex, ey)
      const startType =
        this.startProxy.node.data.outputPorts[this.startPort].typename
      const endType = this.endProxy.node.data.inputPorts[this.endPort].typename
      color.addColorStop(0, PORT_COLOR[startType].edge)
      color.addColorStop(1, PORT_COLOR[endType].edge)
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
