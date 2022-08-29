import { PORT_COLOR } from './ScriptGraphVisualizer.js'

export class ScriptGraphEdgeProxy {
  constructor(startProxy, startPort, endProxy, endPort) {
    this.startProxy = startProxy
    this.startPort = startPort
    this.endProxy = endProxy
    this.endPort = endPort
    this.activationEdgeColor = '#facc15'
    this.edgeWidth = 2
  }
  draw(window) {
    const startCoords = this.getStartCoords()
    const endCoords = this.getEndCoords()
    let color = undefined

    if (this.endPort === -1 || !this.startProxy.node.data.outputPorts.length) {
      color = this.activationEdgeColor
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

    window.drawLine(
      startCoords.x,
      startCoords.y,
      endCoords.x,
      endCoords.y,
      color,
      { width: this.edgeWidth }
    )
  }
  getStartCoords() {
    return this.startProxy.getOutPortCoords(this.startPort)
  }
  getEndCoords() {
    return this.endProxy.getInPortCoords(this.endPort)
  }
}
