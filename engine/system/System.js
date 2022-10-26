import { Loggable } from '%util/Loggable.js'

export class System extends Loggable {
  constructor(name) {
    super()
    this.name = name
    this.components = new Map()
  }
  /**
   * Public interface
   */
  addComponent(component) {
    this.components.set(component.id, component)
  }
  removeComponent(component) {
    this.components.delete(component.id)
  }
  update(deltaTime) {
    this.preUpdate(deltaTime)
    this.components.forEach((component) =>
      this.innerUpdate(deltaTime, component)
    )
    this.postUpdate(deltaTime)
  }
  logMessageName() {
    return `[${this.name}]`
  }
  logMessageNameNoId() {
    return this.logMessageName()
  }
  /**
   * Virtual member functions
   */
  // eslint-disable-next-line no-unused-vars
  preUpdate(deltaTime) {}
  // eslint-disable-next-line no-unused-vars
  innerUpdate(deltaTime, component) {
    this.logError(
      'System.innerUpdate must be overriden by each subclass of System'
    )
  }
  // eslint-disable-next-line no-unused-vars
  postUpdate(deltaTime) {}
}
