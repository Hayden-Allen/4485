import { ref } from 'valtio'

import { State } from '%script/State.js'

export default class StateWrapper {
  constructor({ gameWindow, name }) {
    this._gameWindow = gameWindow
    this._state = ref(
      new State(name, [], this._gameWindow.gl, new Array(9).fill(null))
    )

    this.name = name
    this.animations = []
    this.scripts = []
  }
}
