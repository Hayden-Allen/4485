import { Vec2 } from '%util/Vec2.js'

export class InputCache {
  constructor(element) {
    this.element = element
    this.keys = new Map()
    this.mouseButton = -1
    this.mousePos = new Vec2(0, 0)
    this.mouseScroll = new Vec2(0, 0)

    this.element.addEventListener('keydown', (e) => {
      this.keys.set(e.key.toLowerCase(), true)
    })
    this.element.addEventListener('keyup', (e) => {
      this.keys.set(e.key.toLowerCase(), false)
    })
    this.element.addEventListener('pointermove', (e) => {
      const rect = this.element.getBoundingClientRect()
      this.mousePos = new Vec2(
        (e.clientX - rect.x) * (e.target.width / rect.width),
        (e.clientY - rect.y) * (e.target.height / rect.height)
      )
    })
    this.element.addEventListener('pointerdown', (e) => {
      this.element.setPointerCapture(e.pointerId)
      this.mouseButton = e.button
    })
    this.element.addEventListener('pointerup', (e) => {
      this.element.releasePointerCapture(e.pointerId)
      this.mouseButton = -1
    })
    this.element.addEventListener('wheel', (e) => {
      this.mouseScroll = new Vec2(Math.sign(e.deltaX), Math.sign(e.deltaY))
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
