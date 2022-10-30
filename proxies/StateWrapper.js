import produce from 'immer'
import { ref } from 'valtio'

import { State } from '%script/State.js'

import ScriptWrapper from '%proxies/ScriptWrapper.js'

const FALLBACK_ANIMATION = {
  frameTime: 0,
  urls: ['/sprites/MissingTexture.svg'],
}

export default class StateWrapper {
  constructor({ gameWindow, name }) {
    this._gameWindow = gameWindow

    this.name = name

    this.animations = new Array(9).fill(FALLBACK_ANIMATION)
    this.scripts = []

    this._state = ref(
      new State(
        name,
        this.scripts.map((wrapper) => wrapper._script),
        this._gameWindow.gl,
        this.animations
      )
    )
  }

  setAnimation({ index, frameTime, urls }) {
    const obj = {
      frameTime,
      urls,
    }
    this._state.setTexture(index, obj)
    this.animations = produce(this.animations, (draft) => {
      draft[index] = obj
    })
  }

  clearAnimation({ index }) {
    this.setAnimation({
      index,
      ...FALLBACK_ANIMATION,
    })
  }

  addScript(scriptTemplate) {
    const gameWindow = this._gameWindow
    this.scripts = produce(this.scripts, (draft) => {
      draft.push(
        new ScriptWrapper({
          gameWindow,
          name: scriptTemplate.name,
          reactFlowState: {
            nodes: scriptTemplate.nodes,
            edges: scriptTemplate.edges,
          },
        })
      )
    })
    this._state.scripts = this.scripts.map((wrapper) => wrapper._graph)
  }

  removeScript({ index }) {
    this.scripts = produce(this.scripts, (draft) => {
      draft.splice(index, 1)
    })
    this._state.scripts = this.scripts.map((wrapper) => wrapper._graph)
  }
}
