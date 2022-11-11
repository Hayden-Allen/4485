import { SceneManager } from '%system/SceneManager.js'
import { PhysicsEngine } from '%physics/PhysicsEngine.js'
import {
  StaticSceneEntity,
  DynamicSceneEntity,
  ControlledSceneEntity,
} from '%component/SceneEntity.js'

export class Game {
  constructor(context) {
    this.physicsEngine = new PhysicsEngine(this, -0.001)
    this.currentScene = undefined
    this.sceneManager = new SceneManager()
    this.context = context
    context.addSystem(this.sceneManager)
  }
  serialize() {
    /**
     * @HATODO what metadata?
     */
    return JSON.stringify({
      gravity: this.physicsEngine.engine.gravity.scale,
      scenes: this.sceneManager.serialize(),
    })
  }
  deserialize(str) {
    const obj = JSON.parse(str)
    this.currentScene = undefined
    this.context.removeSystem(this.sceneManager)
    this.physicsEngine.reset()
    this.physicsEngine.engine.gravity.scale = obj.gravity
    this.sceneManager = new SceneManager()
    this.context.addSystem(this.sceneManager)
    this.sceneManager.deserialize(obj.scenes)

    this.currentScene = Array.from(this.sceneManager.components.values())[0]
  }
  setCurrentScene(scene) {
    this.currentScene = scene
    this.sceneManager.addComponent(scene)
  }
  addStaticSceneEntity(z, gameWindow, pos, frameTime, urls, options = {}) {
    const newEntity = new StaticSceneEntity(
      this,
      gameWindow,
      pos,
      frameTime,
      urls,
      options
    )
    this.currentScene.addStaticEntity(newEntity, z)
    return newEntity
  }
  addDynamicSceneEntity(z, gameWindow, pos, options = {}) {
    const newEntity = new DynamicSceneEntity(this, gameWindow, pos, options)
    this.currentScene.addDynamicEntity(newEntity, z)
    return newEntity
  }
  addControlledSceneEntity(
    z,
    gameWindow,
    pos,
    states,
    currentStateName,
    options = {}
  ) {
    const newEntity = new ControlledSceneEntity(
      this,
      gameWindow,
      pos,
      states,
      currentStateName,
      options
    )
    this.currentScene.addControlledEntity(newEntity, z)
    return newEntity
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
