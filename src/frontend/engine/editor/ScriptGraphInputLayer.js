import { Layer } from '%window/Layer.js'

export class ScriptGraphInputLayer extends Layer {
  constructor() {
    super('ScriptGraphInputLayer')
    this.mouseX = 0
    this.mouseY = 0
    this.rightMousePressed = false
    this.cursor = 'grab'
  }
  onMouseDown(e) {
    if (e.button === 2) {
      this.rightMousePressed = true
      this.cursor = 'grabbing'
    }
  }
  onMouseUp(e) {
    if (e.button === 2) {
      this.rightMousePressed = false
      this.cursor = 'grab'
    }
  }
  onMouseMove(e) {
    this.mouseX = e.x
    this.mouseY = e.y
    if (this.rightMousePressed) {
      this.cursor = 'grabbing'
    } else this.cursor = 'grab'
  }
  onRender(e) {
    e.window.canvas.style.cursor = this.cursor
  }
}
