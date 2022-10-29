import produce from 'immer'
import { ref } from 'valtio'

import { global } from '%engine/Global.js'
import { Vec2 } from '%util/Vec2.js'
import { ControlledSceneEntity } from '%component/SceneEntity.js'

import Volatile from '%proxies/util/Volatile.js'
import StateWrapper from '%proxies/StateWrapper.js'

export default class EntityWrapper {
  constructor({ gameWindow, x, y }) {
    this.x = new Volatile(x)
    this.y = new Volatile(y)
    this.scale = new Volatile(32)

    this.physicsSettings = {
      mass: new Volatile(1),
      friction: new Volatile(0),
    }

    this.states = []
    this.variables = []

    this._gameWindow = gameWindow
    const self = this
    this._entity = ref(
      new ControlledSceneEntity(
        global.context.game,
        this._gameWindow,
        new Vec2(this.x.default, this.y.default),
        new Map(),
        null,
        { scale: self.scale.default }
      )
    )
    this._entity.setMass(this.physicsSettings.mass.default)
    this._entity.setFriction(this.physicsSettings.friction.default)

    this.id = this._entity.id

    this.addState({ name: 'Default' })
  }

  setX(x) {
    this.x.default = x
    this._entity.setPosition(this.x.default, this.y.default)
  }

  setY(y) {
    this.y.default = y
    this._entity.setPosition(this.x.default, this.y.default)
  }

  setScale(scale) {
    this.scale.default = scale
    this._entity.setScale(scale)
  }

  setMass(mass) {
    this.physicsSettings.mass.default = mass
    this._entity.setMass(mass)
  }

  setFriction(friction) {
    this.physicsSettings.friction.default = friction
    this._entity.setFriction(friction)
  }

  addState({ name }) {
    const gameWindow = this._gameWindow

    const newStateWrapper = new StateWrapper({ gameWindow, name })

    this._entity.addState(newStateWrapper._state)
    this.states = produce(this.states, (draft) => {
      draft.push(newStateWrapper)
    })
  }

  removeState({ index }) {
    this._entity.removeState(this.states[index].name)
    this.states = produce(this.state, (draft) => {
      draft.splice(index, 1)
    })
  }
}
