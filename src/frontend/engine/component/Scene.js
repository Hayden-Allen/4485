import { Component } from './Component.js'
import { SceneLayer } from './SceneLayer.js'

export class Scene extends Component {
  constructor() {
    super('Scene')
    this.layers = []
    this.controlledComponents = new Map()
  }
  addComponent() {
    this.logError('Use addStaticComponent() and addDynamicComponent() instead')
  }
  addBase(type, component, z) {
    if (z == undefined) {
      this.logError(
        `Must provide z-index for adding component ${component.getLogName()} to scene ${this.getLogName()}`
      )
      return
    }

    if (!this.layers[z]) this.layers[z] = new SceneLayer()
    this.layers[z][type].set(component.id, component)
  }
  // TODO limit z in some way?
  addStaticEntity(component, z) {
    this.addBase('static', component, z)
  }
  addDynamicEntity(component, z) {
    this.addBase('dynamic', component, z)
  }
  addControlledEntity(component, z) {
    this.addDynamicEntity(component, z)
    this.controlledComponents.set(component.id, component)
  }
  removeComponent() {
    this.logError(
      'Use removeStaticComponent() and removeDynamicComponent() instead'
    )
  }
  removeBase(type, component) {
    // search each layer
    for (var i = 0; i < this.layers.length; i++) {
      if (this.layers[i][type].has(component.id)) {
        this.layers[i][type].delete(component.id)
        return
      }
    }
    this.logError(
      `Attempted to remove non-existent component ${component.logMessageName()}`
    )
  }
  removeStaticEntity(component) {
    this.removeBase('static', component)
  }
  removeDynamicEntity(component) {
    this.removeBase('dynamic', component)
  }
  removeControlledEntity(component) {
    this.removeDynamicComponent(component)
    this.controlledComponents.delete(component.id)
  }
}
