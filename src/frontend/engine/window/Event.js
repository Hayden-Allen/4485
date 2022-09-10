import { Vec2 } from '%util/Vec2.js'
import { Component } from '%component/Component.js'

class InputEvent {
  constructor(e) {
    this.altPressed = e.altKey
    this.ctrlPressed = e.ctrlKey
    this.metaPressed = e.metaKey
    this.shiftPressed = e.shiftKey
  }
}

class MouseVectorEvent extends InputEvent {
  constructor(e, x, y) {
    super(e)
    this.x = x
    this.y = y
  }
  asVec2() {
    return new Vec2(this.x, this.y)
  }
}
export class MouseMoveEvent extends MouseVectorEvent {
  constructor(e, x, y) {
    super(e, x, y)
  }
}
export class MouseScrollEvent extends MouseVectorEvent {
  constructor(e) {
    super(e, e.deltaX, e.deltaY)
  }
}
class MouseButtonEvent extends InputEvent {
  constructor(e, pressed) {
    super(e)
    this.button = e.button
    this.pressed = pressed
  }
}
export class MouseUpEvent extends MouseButtonEvent {
  constructor(e) {
    super(e, false)
  }
}
export class MouseDownEvent extends MouseButtonEvent {
  constructor(e) {
    super(e, true)
  }
}

class KeyEvent extends InputEvent {
  constructor(e) {
    super(e)
    this.key = e.key
    this.down = e.type === 'keydown'
    this.repeat = e.repeat
  }
}
export class KeyDownEvent extends KeyEvent {
  constructor(e) {
    super(e)
  }
}
export class KeyUpEvent extends KeyEvent {
  constructor(e) {
    super(e)
  }
}

export class AppTickEvent {
  constructor(deltaTime) {
    this.deltaTime = deltaTime
  }
}

export class RenderEvent {
  constructor(window) {
    this.window = window
  }
}

export class ResizeEvent {
  /**
   * @HATODO implement?
   */
  constructor(w, h) {
    this.w = w
    this.h = h
  }
}

export class EventHandler extends Component {
  constructor(debugName) {
    super(debugName)
  }
  logMessageName() {
    return `(${this.debugName}@${this.id})`
  }
  logMessageNameNoId() {
    return `(${this.debugName})`
  }
  // the following functions are passed an *Event object with the corresponding name (onMouseMove recieves a MouseMoveEvent)
  // eslint-disable-next-line
  onMouseMove(e) {
    return false
  }
  // eslint-disable-next-line
  onMouseScroll(e) {
    return false
  }
  // eslint-disable-next-line
  onMouseDown(e) {
    return false
  }
  // eslint-disable-next-line
  onMouseUp(e) {
    return false
  }
  // eslint-disable-next-line
  onKeyDown(e) {
    return false
  }
  // eslint-disable-next-line
  onKeyUp(e) {
    return false
  }
  // eslint-disable-next-line
  onAppTick(e) {
    return false
  }
  // eslint-disable-next-line
  onRender(e) {
    return false
  }
  // eslint-disable-next-line
  onResize(e) {
    return false
  }
}
