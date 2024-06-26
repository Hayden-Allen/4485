import { Layer } from '%window/Layer.js'

export class ScriptInputLayer extends Layer {
  constructor() {
    super('ScriptInputLayer')
    this.mouseX = 0
    this.mouseY = 0
    this.lastMouseX = 0
    this.lastMouseY = 0
    this.dragStartX = 0
    this.dragStartY = 0
    this.dragOffsetX = 0
    this.dragOffsetY = 0
    this.dragSpeed = 1
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
      if (e.button === 0) {
        this.leftMousePressed = false
        this.offsetX += this.dragOffsetX
        this.offsetY += this.dragOffsetY
        this.cursor = 'grab'
      }
      if (e.button === 2) {
        this.rightMousePressed = false
      }
      this.dragOffsetX = 0
      this.dragOffsetY = 0
    }
  }
  onMouseMove(e) {
    this.lastMouseX = this.mouseX
    this.lastMouseY = this.mouseY
    this.mouseX = e.x
    this.mouseY = e.y
    if (this.canDrag && this.leftMousePressed) {
      this.dragOffsetX = (this.mouseX - this.dragStartX) * this.dragSpeed
      this.dragOffsetY = (this.mouseY - this.dragStartY) * this.dragSpeed
    }
    this.cursor = this.leftMousePressed ? 'grabbing' : 'grab'
  }
  onRender(e) {
    e.window.canvas.style.cursor = this.cursor
  }
}
