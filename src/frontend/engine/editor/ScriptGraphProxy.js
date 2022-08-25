export class ScriptGraphProxy {
  constructor(ctx, node, x, y) {
    this.node = node
    this.x = x
    this.y = y

    this.font = 'sans-serif'
    this.nameFontSize = 24
    ctx.font = `${this.nameFontSize}px ${this.font}`
    let text = ctx.measureText(node.debugName)
    this.nameHeight =
      (text.actualBoundingBoxDescent + text.actualBoundingBoxAscent + 16) * 2
    this.w = Math.ceil(text.width * 2) + 48

    this.portFontSize = 24
    ctx.font = `${this.portFontSize}px ${this.font}`
    text = ctx.measureText(node.debugName)
    this.portHeight =
      (text.actualBoundingBoxDescent + text.actualBoundingBoxAscent + 4) * 2

    this.h =
      this.nameHeight +
      this.portHeight *
        Math.max(node.outputTypes.length, node.inputTypes.length) +
      16

    this.r = 8
  }
  draw(window, ox, oy, zoom) {
    const tx = this.x + ox,
      ty = this.y + oy
    // node
    window.drawRoundRect(
      tx,
      ty,
      this.w,
      this.h,
      this.r,
      'rgba(0, 0, 0, 0.55)',
      false,
      {
        blur: 6 * zoom,
        offsetY: 4 * zoom,
      }
    )
    window.drawRoundRect(tx, ty, this.w, this.h, this.r, '#334155')
    window.drawRoundRect(tx, ty, this.w, this.h, this.r, '#6b7280', true)
    // name
    window.drawCenteredText(
      this.node.debugName,
      tx + this.w / 2,
      ty + this.nameHeight / 2,
      this.font,
      this.nameFontSize,
      '#f9fafb'
    )
    // name underline
    window.drawLine(
      tx,
      ty + this.nameHeight,
      tx + this.w,
      ty + this.nameHeight,
      '#6b7280'
    )
    // ports
    const pby = ty + this.nameHeight + 16
    this.node.data.inputPorts.forEach((port, i) => {
      const portY = pby + i * this.portHeight
      window.drawArc(tx, portY + 10, 8, -Math.PI / 2, Math.PI / 2, '#f3f4f6')
      window.drawText(
        port.name,
        tx + 20,
        portY,
        this.font,
        this.portFontSize,
        '#f3f4f6'
      )
    })
  }
}
