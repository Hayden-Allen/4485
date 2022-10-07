import { Layer } from '%window/Layer.js'
import { Varying } from '%util/Varying.js'
import * as vec4 from '%glMatrix/vec4.js'
import { global } from '%engine/Global.js'

export class EditorLayer extends Layer {
  constructor(game, setSelectedEntity) {
    super('EditorLayer')
    this.game = game
    this.textSize = new Varying(75, 100, -1, { step: 0.5 })
    this.textTheta = new Varying(-Math.PI / 16, Math.PI / 16, -1, {
      step: 0.33,
    })
    this.showDebug = true
    this.fps = 0
    this.setSelectedEntity = setSelectedEntity
  }
  onAppTick(e) {
    if (!global.context.paused) this.fps = 1000 / e.deltaTime
    return false
  }
  onKeyDown(e) {
    if (!e.repeat) {
      switch (e.key) {
        case 'Escape':
          global.context.paused ^= 1
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
    this.game.currentScene.controlledComponents.forEach((e) => {
      this.window.strokeRect(
        e.pos.x - e.dim.x / 2,
        e.pos.y + e.dim.y / 2,
        e.dim.x,
        e.dim.y,
        '#f0f',
        5
      )
    })

    if (global.context.paused) {
      e.window.uiCanvas.drawTransparentRect(
        0,
        0,
        e.window.canvas.width,
        e.window.canvas.height,
        '#000',
        0.5
      )
      e.window.uiCanvas.drawCenteredText(
        'PAUSED',
        e.window.canvas.width / 2,
        e.window.canvas.height / 2,
        'courier new',
        this.textSize.getValue(),
        '#0f0',
        { theta: this.textTheta.getValue() }
      )
    }
  }
  onMouseDown(e) {
    const mouseX = (2 * e.x) / this.window.canvas.width - 1
    const mouseY = 1 - (2 * e.y) / this.window.canvas.height
    let tc = vec4.create()
    vec4.transformMat4(tc, [mouseX, mouseY, 0, 1], this.window.camera.inverse())
    const worldMouseX = tc[0]
    const worldMouseY = tc[1]

    let selected = undefined
    this.game.currentScene.controlledComponents.forEach((e) => {
      if (selected) return
      if (
        global.rectIntersect(
          worldMouseX,
          worldMouseY,
          e.pos.x - e.dim.x / 2,
          e.pos.y - e.dim.y / 2,
          e.dim.x,
          e.dim.y
        )
      ) {
        selected = e
      }
    })
    this.setSelectedEntity(selected)
  }
}
