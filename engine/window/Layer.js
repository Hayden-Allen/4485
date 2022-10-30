import { EventHandler } from './Event.js'

export class Layer extends EventHandler {
  constructor(debugName) {
    super(debugName)
    this.window = window
  }
  // called after added to Window via pushLayer()
  onAttach() {}
}
