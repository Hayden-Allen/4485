import { Layer } from '%window/Layer.js'
import { Varying } from '%component/Varying.js'
import { global } from '%engine/Global.js'

export class EditorLayer extends Layer {
  constructor(game) {
    super('EditorLayer')
    this.game = game
    this.paused = false
    this.textSize = new Varying(75, 100, -1, { step: 0.5 })
    this.textTheta = new Varying(-Math.PI / 16, Math.PI / 16, -1, {
      step: 0.33,
    })
    this.showDebug = true
    this.fps = 0
  }
  onAppTick(e) {
    if (!this.paused) this.fps = 1000 / e.deltaTime
    return false
  }
  onKeyDown(e) {
    if (!e.repeat) {
      switch (e.key) {
        case 'Escape':
          this.paused ^= 1
          break
        case '`':
          this.showDebug ^= 1
          break
      }
    }
  }
  onRender(e) {
    e.window.clear()
    this.game.draw(e.window)

    if (this.showDebug) {
      e.window.drawText(
        `FPS: ${parseInt(this.fps)}`,
        0,
        0,
        'Courier',
        20,
        '#0f0'
      )
    }

    if (this.paused) {
      const cw = global.canvas.targetWidth,
        ch = global.canvas.targetHeight
      e.window.drawRect(0, 0, cw, ch, '#000', { alpha: 0.5 })
      e.window.drawCenteredText(
        'PAUSED',
        cw / 2,
        ch / 2,
        'Courier',
        this.textSize.getValue(),
        '#0f0',
        { theta: this.textTheta.getValue() }
      )
    }
  }
}
