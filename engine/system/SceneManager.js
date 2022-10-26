import { System } from './System.js'
import { Scene } from '%component/Scene.js'

export class SceneManager extends System {
  constructor() {
    super('SceneManager')
  }
  innerUpdate(deltaTime, scene) {
    const deltaTimeSeconds = deltaTime / 1000
    scene.controlledComponents.forEach((component) =>
      component.runScripts('OnTick', { camera: scene.camera })
    )
    scene.layers.forEach((layer) => layer.update(deltaTimeSeconds))
  }
  serialize() {
    return Array.from(this.components.values()).map((scene) =>
      scene.serialize()
    )
  }
  deserialize(obj) {
    obj.forEach((component) => {
      let scene = new Scene()
      scene.deserialize(component)
      this.components.set(scene.id, scene)
    })
  }
}
