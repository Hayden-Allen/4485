import { Vec2 } from '%util/Vec2.js'

export class InputCache {
  constructor() {
    this.keys = new Map()
    this.mouseButton = -1
    this.mousePos = new Vec2(0, 0)
    this.mouseScroll = new Vec2(0, 0)

    window.addEventListener('keydown', (e) => {
      this.keys.set(e.key.toLowerCase(), true)
    })
    window.addEventListener('keyup', (e) => {
      this.keys.set(e.key.toLowerCase(), false)
    })
    window.addEventListener('mousemove', (e) => {
      this.mousePos = new Vec2(e.clientX, e.clientY)
    })
    window.addEventListener('mousedown', (e) => {
      this.mouseButton = e.button
    })
    window.addEventListener('mouseup', () => {
      this.mouseButton = -1
    })
    window.addEventListener('wheel', (e) => {
      this.mouseScroll = new Vec2(e.deltaX, e.deltaY)
    })
  }
  isKeyPressed(key) {
    const sanitizedKey = key.toLowerCase()
    return this.keys.has(sanitizedKey) && this.keys.get(sanitizedKey)
  }
  isMouseLeft() {
    return this.mouseButton === 0
  }
  isMouseRight() {
    return this.mouseButton === 2
  }
}
