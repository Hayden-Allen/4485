import { Layer } from '%window/Layer.js'

export class ScriptGraphInputLayer extends Layer {
  constructor() {
    super('ScriptGraphInputLayer')
    this.mouseX = 0
    this.mouseY = 0
    this.dragStartX = 0
    this.dragStartY = 0
    this.dragOffsetX = 0
    this.dragOffsetY = 0
    this.offsetX = 0
    this.offsetY = 0
    this.leftMousePressed = false
    this.rightMousePressed = false
    this.cursor = 'grab'
    this.canDrag = true
  }
  onMouseDown(e) {
    if (e.button === 0 || e.button === 2) {
      this.dragStartX = this.mouseX
      this.dragStartY = this.mouseY
      this.leftMousePressed = e.button === 0
      if (e.button === 2) {
        this.rightMousePressed = true
        this.cursor = 'grabbing'
      }
    }
  }
  onMouseUp(e) {
    if (e.button === 0 || e.button === 2) {
      if (e.button === 0) this.leftMousePressed = false
      if (e.button === 2) {
        this.offsetX += this.dragOffsetX
        this.offsetY += this.dragOffsetY
        this.rightMousePressed = false
        this.cursor = 'grab'
      }
      this.dragOffsetX = 0
      this.dragOffsetY = 0
    }
  }
  onMouseMove(e) {
    this.mouseX = e.x
    this.mouseY = e.y
    if (this.canDrag && (this.leftMousePressed || this.rightMousePressed)) {
      this.dragOffsetX = this.mouseX - this.dragStartX
      this.dragOffsetY = this.mouseY - this.dragStartY
    }
    this.cursor = this.rightMousePressed ? 'grabbing' : 'grab'
  }
  onRender(e) {
    e.window.canvas.style.cursor = this.cursor
  }
}
