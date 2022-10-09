import { SceneManager } from '%system/SceneManager.js'
import { PhysicsEngine } from '%physics/PhysicsEngine.js'
import {
  SceneEntity,
  DynamicSceneEntity,
  ControlledSceneEntity,
} from '%component/SceneEntity.js'

export class Game {
  constructor(context) {
    this.physicsEngine = new PhysicsEngine(this, -5)
    this.currentScene = undefined
    this.sceneManager = new SceneManager()
    context.addSystem(this.sceneManager)
  }
  setCurrentScene(scene) {
    this.currentScene = scene
    this.sceneManager.addComponent(scene)
  }
  addStaticSceneEntity(z, gameWindow, pos, frameTime, urls, options = {}) {
    this.currentScene.addStaticEntity(
      new SceneEntity(this, gameWindow, pos, frameTime, urls, options),
      z
    )
  }
  addDynamicSceneEntity(z, gameWindow, pos, frameTime, urls, options = {}) {
    this.currentScene.addDynamicEntity(
      new DynamicSceneEntity(this, gameWindow, pos, frameTime, urls, options),
      z
    )
  }
  addControlledSceneEntity(
    z,
    gameWindow,
    pos,
    frameTime,
    urls,
    states,
    currentStateName,
    options = {}
  ) {
    this.currentScene.addControlledEntity(
      new ControlledSceneEntity(
        this,
        gameWindow,
        pos,
        frameTime,
        urls,
        states,
        currentStateName,
        options
      ),
      z
    )
  }
  removeStaticSceneEntity(component) {
    this.currentScene.removeStaticEntity(component)
  }
  removeDynamicSceneEntity(component) {
    this.currentScene.removeDynamicEntity(component)
  }
  removeControlledSceneEntity(component) {
    this.currentScene.removeControlledEntity(component, component.sceneZ)
  }
  draw(window) {
    this.drawFromPerspective(window, this.currentScene.camera)
  }
  drawFromPerspective(window, camera) {
    this.currentScene.layers.forEach((layer) => layer.draw(window, camera))
  }
}
