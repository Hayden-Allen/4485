import { SceneManager } from '%system/SceneManager.js'
import { PhysicsEngine } from '%physics/PhysicsEngine.js'
import {
  StaticSceneEntity,
  DynamicSceneEntity,
  ControlledSceneEntity,
} from '%component/SceneEntity.js'

export class Game {
  constructor(context) {
    this.physicsEngine = new PhysicsEngine(this, -5)
    this.currentScene = undefined
    this.sceneManager = new SceneManager()
    this.context = context
    context.addSystem(this.sceneManager)
  }
  serialize(name) {
    /**
     * @HATODO what metadata?
     */
    return {
      name,
      scenes: this.sceneManager.serialize(),
    }
  }
  deserialize(obj) {
    this.currentScene = undefined
    this.context.removeSystem(this.sceneManager)
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
    this.currentScene.addStaticEntity(
      new StaticSceneEntity(this, gameWindow, pos, frameTime, urls, options),
      z
    )
  }
  addDynamicSceneEntity(z, gameWindow, pos, options = {}) {
    this.currentScene.addDynamicEntity(
      new DynamicSceneEntity(this, gameWindow, pos, options),
      z
    )
  }
  addControlledSceneEntity(
    z,
    gameWindow,
    pos,
    states,
    currentStateName,
    options = {}
  ) {
    this.currentScene.addControlledEntity(
      new ControlledSceneEntity(
        this,
        gameWindow,
        pos,
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
