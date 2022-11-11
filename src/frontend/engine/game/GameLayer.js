import { Layer } from '%window/Layer.js'

export class GameLayer extends Layer {
  constructor(game) {
    super('EditorLayer')
    this.game = game
  }
  onRender(e) {
    e.window.clear()
    this.game.draw(e.window)
  }
}
