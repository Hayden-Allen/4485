export class ScriptGraphProxy {
  constructor(ctx, node, x, y) {
    this.node = node
    this.x = x
    this.y = y

    this.font = 'sans-serif'
    this.nameFontSize = 18
    ctx.font = `${this.nameFontSize}px ${this.font}`
    let text = ctx.measureText(node.debugName)
    this.nameHeight =
      (text.actualBoundingBoxDescent + text.actualBoundingBoxAscent + 3) * 2
    this.w = Math.ceil(text.width * 2)

    this.portFontSize = 10
    ctx.font = `${this.portFontSize}px ${this.font}`
    text = ctx.measureText(node.debugName)
    this.portHeight =
      (text.actualBoundingBoxDescent + text.actualBoundingBoxAscent + 3) * 2

    this.h =
      this.nameHeight +
      this.portHeight *
        (Math.max(node.outputTypes.length, node.inputTypes.length) + 2)
  }
  draw(window, ox, oy) {
    const tx = this.x + ox,
      ty = this.y + oy
    // node
    window.drawRect(tx, ty, this.w, this.h, '#000')
    // name
    window.drawCenteredText(
      this.node.debugName,
      tx + this.w / 2,
      ty + this.nameHeight / 2,
      this.font,
      this.nameFontSize,
      '#0f0'
    )
    // name underline
    window.drawLine(
      tx,
      ty + this.nameHeight,
      tx + this.w,
      ty + this.nameHeight,
      '#ccc'
    )
    // ports
    const pby = ty + this.nameHeight + this.portHeight
    this.node.data.inputPorts.forEach((port, i) => {
      window.drawText(
        port.name,
        tx,
        pby + i * this.portHeight,
        this.font,
        this.portFontSize,
        '#0f0'
      )
    })
  }
}
