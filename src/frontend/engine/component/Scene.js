import { Component } from './Component.js'
import { SceneLayer } from './SceneLayer.js'
import { global } from '%engine/Global.js'
import { Camera } from '%graphics/Camera.js'
import {
  ControlledSceneEntity,
  StaticSceneEntity,
} from '%component/SceneEntity.js'

export class Scene extends Component {
  constructor() {
    super('Scene')
    this.layers = []
    this.controlledComponents = new Map()
    this.camera = new Camera(
      [0, 0, 0],
      -global.canvas.targetWidth / 2,
      global.canvas.targetWidth / 2,
      -global.canvas.targetHeight / 2,
      global.canvas.targetHeight / 2
    )
  }
  serialize() {
    // serialize each entity only once (layers reference them by id)
    let entities = {}
    this.layers.forEach((layer) => {
      layer.static.forEach(
        (entity) => (entities[entity.id] = entity.serialize())
      )
      layer.dynamic.forEach(
        (entity) => (entities[entity.id] = entity.serialize())
      )
    })
    return {
      entities,
      layers: this.layers.map((layer) => layer.serialize()),
      controlledComponents: Array.from(this.controlledComponents.values()).map(
        (component) => component.id
      ),
    }
  }
  /**
   * @HATODO
   */
  deserialize(obj) {
    let entities = new Map()
    for (const id in obj.entities) {
      const entity = obj.entities[id]
      let newEntity = undefined
      if (entity.states) {
        newEntity = ControlledSceneEntity.deserialize(entity)
      } else {
        newEntity = StaticSceneEntity.deserialize(entity)
      }
      entities.set(id, newEntity)
    }

    console.log(obj)

    this.layers = []
    obj.layers.forEach((layer) => {
      const newLayer = new SceneLayer()
      newLayer.deserialize(layer, entities)
      this.layers.push(newLayer)
    })

    this.controlledComponents = new Map()
    obj.controlledComponents.forEach((id) =>
      this.controlledComponents.set(id, entities.get(id))
    )
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
    component.bindToScene(this, z)
    this.addBase('static', component, z)
  }
  addDynamicEntity(component, z) {
    component.bindToScene(this, z)
    this.addBase('dynamic', component, z)
  }
  addControlledEntity(component, z) {
    component.bindToScene(this, z)
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
    if (component.states) {
      this.removeDynamicEntity(component)
      this.controlledComponents.delete(component.id)
      component.destroy()
    }
  }
}
