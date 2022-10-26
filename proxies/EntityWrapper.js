import produce from 'immer'
import { ref } from 'valtio'

import { global } from '%engine/Global.js'
import { Vec2 } from '%util/Vec2.js'
import { ControlledSceneEntity } from '%component/SceneEntity.js'

import StateWrapper from '%proxies/StateWrapper.js'

export default class EntityWrapper {
  constructor({ gameWindow, x, y }) {
    this.physicsSettings = {
      mass: null,
      friction: null,
    }

    this.states = []
    this.variables = []

    this._gameWindow = gameWindow
    this._entity = ref(
      new ControlledSceneEntity(
        global.context.game,
        this._gameWindow,
        new Vec2(x, y),
        new Map(),
        null,
        { scale: 32 }
      )
    )

    this.addState({ name: 'Default' })
  }

  addState({ name }) {
    const gameWindow = this._gameWindow

    const newStateWrapper = new StateWrapper({ gameWindow, name })

    this.states = produce(this.states, (draft) => {
      draft.push(newStateWrapper)
    })

    this._entity.addState(newStateWrapper._state)
  }
}
