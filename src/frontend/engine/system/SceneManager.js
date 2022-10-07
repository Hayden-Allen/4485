import { System } from './System.js'

export class SceneManager extends System {
  constructor() {
    super('SceneManager')
  }
  innerUpdate(deltaTime, scene) {
    const deltaTimeSeconds = deltaTime / 1000
    scene.controlledComponents.forEach((component) =>
      component.runBehavior('OnTick')
    )
    scene.layers.forEach((layer) => layer.update(deltaTimeSeconds))
  }
}
