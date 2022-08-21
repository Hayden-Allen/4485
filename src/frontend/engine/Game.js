import { SceneManager } from '%system/SceneManager.js'

export class Game {
  constructor() {
    this.systems = new Map()
    this.sceneManager = undefined
    this.currentScene = undefined
    this.preUpdateFunctions = []
    this.postUpdateFunctions = []

    this.createEssentialSystems()
  }
  createEssentialSystems() {
    this.sceneManager = new SceneManager()
    this.addSystem(this.sceneManager)
  }
  setCurrentScene(scene) {
    this.currentScene = scene
    this.sceneManager.addComponent(scene)
  }
  addStaticSceneEntity(component, z) {
    this.currentScene.addStaticEntity(component, z)
  }
  addDynamicSceneEntity(component, z) {
    this.currentScene.addDynamicEntity(component, z)
  }
  addControlledSceneEntity(component, z) {
    this.currentScene.addControlledEntity(component, z)
  }
  removeStaticSceneEntity(component) {
    this.currentScene.removeStaticEntity(component)
  }
  removeDynamicSceneEntity(component) {
    this.currentScene.removeDynamicEntity(component)
  }
  removeControlledSceneEntity(component, z) {
    this.currentScene.removeControlledEntity(component, z)
  }
  addSystem(system) {
    if (this.systems.has(system.name))
      console.warn(`Overwriting system '${system.name}'`)
    this.systems.set(system.name, system)
  }
  removeSystem(system) {
    this.systems.delete(system.name)
  }
  addPreUpdateFunction(fn) {
    this.preUpdateFunctions.push(fn)
  }
  addPostUpdateFunction(fn) {
    this.postUpdateFunctions.push(fn)
  }
  update(deltaTime) {
    this.preUpdateFunctions.forEach((fn) => fn())
    // this is a failsafe; because this runs in the browser, switching to a different tab allows the user to make the delta time arbitraily large, which obviously breaks stuff
    // so skip this frame if more than half a second has passed since the last frame
    if (deltaTime > 500) return

    this.systems.forEach((system) => system.update(deltaTime))
    this.postUpdateFunctions.forEach((fn) => fn())
  }
}
