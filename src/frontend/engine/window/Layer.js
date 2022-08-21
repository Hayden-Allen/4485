import { EventHandler } from './Event.js'

export class Layer extends EventHandler {
  constructor(debugName) {
    super(debugName)
  }
}

export class UILayer extends Layer {
  constructor() {
    super('UILayer')
  }
}
