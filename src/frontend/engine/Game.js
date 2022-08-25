import { SceneManager } from '%system/SceneManager.js'

export class Game {
  constructor(context) {
    this.currentScene = undefined
    this.sceneManager = new SceneManager()
    context.addSystem(this.sceneManager)
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
  draw(window) {
    this.currentScene.layers.forEach((layer) => layer.draw(window))
  }
}
