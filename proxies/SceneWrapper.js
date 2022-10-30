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

  addControlledEntity({ x, y, z }) {
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

  removeEntity({ id }) {
    let index = null
    for (let i = 0; i < this.entities.length; ++i) {
      if (this.entities[i].id === id) {
        index = i
      }
    }

    this._scene.removeControlledEntity(this.entities[index]._entity)

    this.entities = produce(this.entities, (draft) => {
      draft.splice(index, 1)
    })

    this.selectedEntities = produce(this.selectedEntities, (draft) => {
      for (let i = 0; i < draft.length; ++i) {
        if (draft[i]._entity.id === id) {
          draft.splice(i, 1)
          return
        }
      }
    })
  }
}
