import { Layer } from '%window/Layer.js'

export class GameLayer extends Layer {
  constructor(game) {
    super('GameLayer')
    this.game = game
  }
  onAppTick(e) {
    this.game.update(e.deltaTime)
    return false
  }
  onRender(e) {
    this.game.draw(e.renderer)
  }
}
