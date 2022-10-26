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
  }
}
