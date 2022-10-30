import { v4 as uuidv4 } from 'uuid'
import { Loggable } from '%engine/util/Loggable.js'

export class Component extends Loggable {
  constructor(debugName) {
    super()
    this.debugName = debugName
    this.id = uuidv4()
  }
  isSameComponent(other) {
    return this.id === other.id
  }
  logMessageName() {
    return `{${this.debugName}@${this.id}}`
  }
  logMessageNameNoId() {
    return `{${this.debugName}}`
  }
}
