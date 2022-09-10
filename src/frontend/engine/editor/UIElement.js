export class UIElement {
  constructor(lineWidth, colors) {
    this.lineWidth = lineWidth
    this.colors = colors
    this.hovered = false
    this.selected = false
  }
  // eslint-disable-next-line
  draw(window) {}
}
