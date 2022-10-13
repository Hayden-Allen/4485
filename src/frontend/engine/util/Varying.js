import { global } from '%engine/Global.js'
import { v4 as uuidv4 } from 'uuid'

export class Varying {
  constructor(start, end, repeatCount, { step, fn, reset } = {}) {
    this.id = uuidv4()
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
