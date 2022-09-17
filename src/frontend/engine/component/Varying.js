import { Component } from './Component.js'
import { global } from '%engine/Global.js'

export class Varying extends Component {
  constructor(start, end, repeatCount, { step, fn, reset } = {}) {
    super()
    this.value = start
    this.start = start
    this.end = end
    // -1 will repeat forever
    this.repeatCount = repeatCount
    this.step = step || 1
    this.fn = fn || ((value) => value)
    this.reset = reset !== undefined ? reset : false

    global.varyingController.addComponent(this)
  }
  getValue() {
    return this.fn(this.value, this)
  }
}
