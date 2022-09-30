import { PORT_COLOR } from './ScriptVisualizer.js'
import { UIElement } from './UIElement.js'
import { global } from '%engine/Global.js'

const LINE_WIDTH = [2, 4]
const COLORS = {
  entity: {
    shadow: '#0007',
    node: '#262626',
    title: '#262626',
    outline: ['#737373', '#d4d4d4'],
  },
  event: {
    shadow: '#0007',
    node: '#262626',
    title: '#262626',
    outline: ['#737373', '#d4d4d4'],
  },
  input: {
    shadow: '#0007',
    node: '#262626',
    title: '#262626',
    outline: ['#737373', '#d4d4d4'],
  },
  logic: {
    shadow: '#0007',
    node: '#262626',
    title: '#262626',
    outline: ['#737373', '#d4d4d4'],
  },
  math: {
    shadow: '#0007',
    node: '#262626',
    title: '#262626',
    outline: ['#737373', '#d4d4d4'],
  },
}
const FONT_FAMILY =
    '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif',
  NAME_FONT_SIZE = 32,
  PORT_FONT_SIZE = 32,
  PORT_RADIUS = 12,
  PORT_NAME_PADDING_X = PORT_RADIUS * 2,
  PORT_DOT_OFFSET = 10,
  WIDTH_PADDING = 48,
  HEIGHT_PADDING = 16
export class ScriptNodeProxy extends UIElement {
  constructor(window, node) {
    super(LINE_WIDTH, COLORS[node.category])
    this.node = node
    this.x = 0
    this.y = 0
    this.nameHeight = 0
    this.w = 0
    this.h = 0
    this.portHeight = 0
    this.maxPortCount = 0
    this.hoveredPort = -1
    this.init(window)
  }
  computeNodeWidth(window) {
    // compute name width
    let text = window.textMetrics(
      this.node.debugName,
      FONT_FAMILY,
      NAME_FONT_SIZE
    )

    // compute node width
    const { inputPorts, outputPorts, internalPorts } = this.node.data
    let inWidth = 0,
      internalWidth = 0,
      outWidth = 0
    for (
      var i = 0;
      i < Math.max(inputPorts.length, outputPorts.length, internalPorts.length);
      i++
    ) {
      if (i < inputPorts.length)
        inWidth = Math.max(
          inWidth,
          window.textMetrics(inputPorts[i].name, FONT_FAMILY, PORT_FONT_SIZE)
            .width + PORT_NAME_PADDING_X
        )
      if (i < outputPorts.length)
        outWidth = Math.max(
          outWidth,
          window.textMetrics(outputPorts[i].name, FONT_FAMILY, PORT_FONT_SIZE)
            .width + PORT_NAME_PADDING_X
        )
      if (i < internalPorts.length) {
        internalWidth = Math.max(
          internalWidth,
          window.textMetrics(
            `${internalPorts[i].name}: ${this.getInternalValueDisplayStr(i)}`,
            FONT_FAMILY,
            PORT_FONT_SIZE
          ).width + PORT_NAME_PADDING_X
        )
      }
    }
    this.w =
      Math.max(inWidth + internalWidth + outWidth, Math.ceil(text.width)) +
      WIDTH_PADDING
  }
  init(window) {
    // compute name height
    let text = window.textMetrics(
      this.node.debugName,
      FONT_FAMILY,
      NAME_FONT_SIZE
    )
    this.nameHeight =
      (text.actualBoundingBoxDescent + text.actualBoundingBoxAscent) * 2

    // compute node width
    this.computeNodeWidth(window)

    // compute port height
    text = window.textMetrics(this.node.debugName, FONT_FAMILY, PORT_FONT_SIZE)
    this.portHeight =
      (text.actualBoundingBoxDescent + text.actualBoundingBoxAscent) * 2

    // compute node height
    this.maxPortCount = Math.max(
      this.node.data.outputPorts.length,
      this.node.inputTypes.length,
      this.node.internalValues.length
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
    window.drawRect(tx, ty, this.w, this.h, this.colors.node)
    window.drawRect(tx, ty, this.w, this.nameHeight, this.colors.title)
    // make sure lines are still visible when zoomed out
    const lineWidth = this.lineWidth[selected] / Math.min(zoom, 1)
    // name underline
    if (this.maxPortCount)
      window.drawLine(
        tx,
        ty + this.nameHeight,
        tx + this.w,
        ty + this.nameHeight,
        '#737373',
        this.lineWidth[0] / 2
      )
    // node outline
    window.strokeTransparentRect(
      tx,
      ty,
      this.w,
      this.h,
      this.colors.outline[selected],
      lineWidth / 2,
      selected ? visualizer.outlineAlpha.getValue() : 1
    )
    // name
    window.drawCenteredText(
      this.node.debugName,
      tx + this.w / 2,
      ty + this.nameHeight / 2,
      FONT_FAMILY,
      NAME_FONT_SIZE,
      '#f9fafb'
    )
    // ports
    this.node.data.inputPorts.forEach((port, i) => {
      const portY = this.getPortBaseY() + i * this.portHeight + PORT_DOT_OFFSET
      window.drawArc(
        tx - 2,
        portY,
        PORT_RADIUS,
        -Math.PI / 2,
        Math.PI / 2,
        PORT_COLOR[port.typename].dot
      )
      window.drawVerticalCenteredText(
        port.name,
        tx + PORT_NAME_PADDING_X,
        portY,
        FONT_FAMILY,
        PORT_FONT_SIZE,
        PORT_COLOR[port.typename].name
      )
      // const width = window.textMetrics(
      //   port.name,
      //   FONT_FAMILY,
      //   PORT_FONT_SIZE
      // ).width
      // window.strokeRect(
      //   tx,
      //   portY,
      //   PORT_NAME_PADDING_X + width,
      //   2 * PORT_RADIUS,
      //   '#f00',
      //   1
      // )
    })
    this.node.data.outputPorts.forEach((port, i) => {
      const portY = this.getPortBaseY() + i * this.portHeight + PORT_DOT_OFFSET
      window.drawArc(
        tx + this.w + 2,
        portY,
        PORT_RADIUS,
        Math.PI / 2,
        -Math.PI / 2,
        PORT_COLOR[port.typename].dot
      )
      const width = window.textMetrics(
        port.name,
        FONT_FAMILY,
        PORT_FONT_SIZE
      ).width
      window.drawVerticalCenteredText(
        port.name,
        tx + this.w - width - PORT_NAME_PADDING_X,
        portY,
        FONT_FAMILY,
        PORT_FONT_SIZE,
        PORT_COLOR[port.typename].name
      )
      // window.strokeRect(
      //   tx + this.w - width - PORT_NAME_PADDING_X,
      //   portY,
      //   width + PORT_NAME_PADDING_X,
      //   2 * PORT_RADIUS,
      //   '#f00',
      //   1
      // )
    })
    this.node.data.internalPorts.forEach((port, i) => {
      const correctedInternalValue = this.getInternalValueDisplayStr(i)

      const portY = this.getPortBaseY() + i * this.portHeight + PORT_DOT_OFFSET
      const x = tx + PORT_NAME_PADDING_X
      const width = window.textMetrics(
        `${port.name}: ${correctedInternalValue}`,
        FONT_FAMILY,
        PORT_FONT_SIZE
      ).width
      window.drawRect(
        x - PORT_DOT_OFFSET / 2,
        portY - this.portHeight / 2,
        width + PORT_DOT_OFFSET,
        this.portHeight,
        '#171717'
      )
      window.strokeTransparentRect(
        x - PORT_DOT_OFFSET / 2,
        portY - this.portHeight / 2,
        width + PORT_DOT_OFFSET,
        this.portHeight,
        this.colors.outline[selected],
        lineWidth / 2,
        selected ? visualizer.outlineAlpha.getValue() : 1
      )
      window.drawVerticalCenteredText(
        `${port.name}: ${correctedInternalValue}`,
        x,
        portY,
        FONT_FAMILY,
        PORT_FONT_SIZE,
        PORT_COLOR[port.typename].name
      )
      if (i === this.hoveredPort) {
        // just underline value, not name
        const valueX =
          x +
          window.textMetrics(`${port.name}: `, FONT_FAMILY, PORT_FONT_SIZE)
            .width
        const valueWidth = window.textMetrics(
          correctedInternalValue,
          FONT_FAMILY,
          PORT_FONT_SIZE
        ).width
        const lineY = portY + this.portHeight / 4
        window.drawLine(
          valueX,
          lineY,
          valueX + valueWidth,
          lineY,
          PORT_COLOR[port.typename].name,
          1
        )
      }
    })
  }
  getInternalValueDisplayStr(portIndex) {
    return this.node.data.internalPorts[portIndex].editorTypename === 'key'
      ? global.keyToDisplayStr(this.node.internalValues[portIndex])
      : this.node.internalValues[portIndex]
  }
  getPortBaseY() {
    return this.y + this.nameHeight + this.portHeight / 2
  }
  getInternalPortCoords(i, window) {
    const x =
      this.x +
      PORT_NAME_PADDING_X +
      window.textMetrics(
        `${this.node.data.internalPorts[i].name}: `,
        FONT_FAMILY,
        PORT_FONT_SIZE
      ).width
    const y =
      this.getPortBaseY() +
      this.portHeight * i +
      PORT_DOT_OFFSET -
      this.portHeight / 2
    return { x, y }
  }
  getInPortCoords(i) {
    let y = 0
    // activation edges map to middle of title bar
    if (i === -1) {
      y = this.y + this.nameHeight / 2
    }
    // normal edges map to the port they're attached to
    else {
      y = this.getPortBaseY() + this.portHeight * i + PORT_DOT_OFFSET
    }
    return { x: this.x, y }
  }
  getOutPortCoords(i) {
    let y = 0
    // activation edges map to middle of title bar
    if (i === -1) {
      y = this.y + this.nameHeight / 2
    }
    // normal edges map to the port they're attached to
    else {
      y = this.getPortBaseY() + this.portHeight * i + PORT_DOT_OFFSET
    }
    return { x: this.x + this.w, y }
  }
  checkPortIntersection(window, x, y) {
    // check name intersection first (activation edge)
    const nameWidth = window.textMetrics(
      this.node.debugName,
      FONT_FAMILY,
      NAME_FONT_SIZE
    ).width
    if (
      global.rectIntersect(
        x,
        y,
        this.x + this.w / 2 - nameWidth / 2,
        this.y,
        nameWidth,
        this.nameHeight
      )
    ) {
      return {
        undefined,
        in: false,
        internal: false,
        index: -1,
        proxy: this,
        node: this.node,
        color: '#facc15',
      }
    }

    const data = this.node.data
    // inputs
    let ret = this.checkPortIntersectionOn(
      window,
      x,
      y,
      data.inputPorts,
      () => this.x,
      (port) => port.name,
      true,
      false
    )
    if (ret) return ret
    // outputs
    ret = this.checkPortIntersectionOn(
      window,
      x,
      y,
      data.outputPorts,
      (width) => this.x + this.w - width - PORT_NAME_PADDING_X,
      (port) => port.name,
      false,
      false
    )
    if (ret) return ret
    // internals
    ret = this.checkPortIntersectionOn(
      window,
      x,
      y,
      data.internalPorts,
      () => this.x + PORT_NAME_PADDING_X,
      (port, i) => `${port.name}: ${this.getInternalValueDisplayStr(i)}`,
      false,
      true
    )
    return ret
  }
  checkPortIntersectionOn(
    window,
    x,
    y,
    list,
    computeX,
    textFormat,
    isInput,
    isInternal
  ) {
    const portBaseY = this.getPortBaseY()
    for (let i = 0; i < list.length; i++) {
      const port = list[i]
      const portY = portBaseY + i * this.portHeight
      const width = window.textMetrics(
        textFormat(port, i),
        FONT_FAMILY,
        PORT_FONT_SIZE
      ).width
      const portX = computeX(width)

      if (
        global.rectIntersect(
          x,
          y,
          portX,
          portY,
          width + PORT_NAME_PADDING_X,
          2 * PORT_RADIUS
        )
      ) {
        return {
          port,
          in: isInput,
          internal: isInternal,
          index: i,
          proxy: this,
          node: this.node,
          color: PORT_COLOR[port.typename].edge,
        }
      }
    }
  }
}
