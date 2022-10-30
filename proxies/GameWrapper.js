import { ref } from 'valtio'

import { global } from '%engine/Global.js'
import { Window3D } from '%window/Window3D.js'
import { EditorLayer } from '%editor/EditorLayer.js'

import SceneWrapper from '%proxies/SceneWrapper.js'

export default class GameWrapper {
  static gameExists = false
  static gameInitialized = false

  constructor() {
    if (GameWrapper.gameExists) {
      console.error(
        'GameWrapper already exists; cannot create a new GameWrapper'
      )
      return
    } else {
      GameWrapper.gameExists = true
    }

    this._gameWindow = null
    this._editorLayer = null

    this.scenes = null
    this.currentScene = null
  }

  init(gameCanvas, uiCanvas) {
    if (GameWrapper.gameInitialized) {
      console.warn(
        'GameWrapper already initialized; cannot initialze GameWrapper again'
      )
      return
    } else {
      GameWrapper.gameInitialized = true
    }

    global.init()

    this._gameWindow = ref(new Window3D(gameCanvas, uiCanvas, [0, 0, 1, 1]))
    this._editorLayer = ref(new EditorLayer(global.context.game))
    this._gameWindow.pushLayer(this._editorLayer)
    global.context.windows.push(this._gameWindow)

    const gameWindow = this._gameWindow
    this.scenes = [new SceneWrapper({ gameWindow })]
    this.currentScene = this.scenes[0]
    global.context.game.setCurrentScene(this.currentScene._scene)

    global.context.run()

    const animate = () => {
      window.requestAnimationFrame(animate)

      if (!this.currentScene) {
        return
      }

      for (const entity of this.currentScene.entities) {
        if (entity.x.current !== entity._entity.pos.x) {
          entity.x.current = entity._entity.pos.x
        }

        if (entity.y.current !== entity._entity.pos.y) {
          entity.y.current = entity._entity.pos.y
        }

        if (entity.scale.current !== entity._entity.ops.scale) {
          entity.scale.current = entity._entity.ops.scale
        }

        if (
          entity.physicsSettings.mass.current !==
          entity._entity.physicsProxy.mass
        ) {
          entity.physicsSettings.mass.current = entity._entity.physicsProxy.mass
        }

        if (
          entity.physicsSettings.friction.current !==
          entity._entity.physicsProxy.friction
        ) {
          entity.physicsSettings.friction.current =
            entity._entity.physicsProxy.friction
        }
      }
    }
    window.requestAnimationFrame(animate)
  }
}
