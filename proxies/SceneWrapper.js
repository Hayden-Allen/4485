import produce from 'immer'
import { ref } from 'valtio'

import { Scene } from '%component/Scene.js'

import EntityWrapper from '%proxies/EntityWrapper.js'

export default class SceneWrapper {
  constructor({ gameWindow }) {
    this._gameWindow = gameWindow
    this._scene = ref(new Scene())

    this.selectedEntities = []
    this.entities = []
  }

  addControlledSceneEntity({ x, y, z }) {
    const gameWindow = this._gameWindow
    const newEntityWrapper = new EntityWrapper({ gameWindow, x, y })

    this.entities = produce(this.entities, (draft) => {
      draft.push(newEntityWrapper)
    })

    this.selectedEntities = produce(this.selectedEntities, (draft) => {
      draft.push(newEntityWrapper)
    })

    this._scene.addControlledEntity(newEntityWrapper._entity, z)
  }
}
