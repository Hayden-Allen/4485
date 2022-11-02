import { Layer } from '%window/Layer.js'
import { Varying } from '%util/Varying.js'
import * as vec4 from '%glMatrix/vec4.js'
import { global } from '%engine/Global.js'
import { Camera } from '%graphics/Camera.js'

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
    this.selectedEntity = undefined
    this.setSelectedEntity = setSelectedEntity

    this.camera = new Camera(
      [0, 0, 0],
      -global.canvas.targetWidth / 2,
      global.canvas.targetWidth / 2,
      -global.canvas.targetHeight / 2,
      global.canvas.targetHeight / 2
    )
  }
  onAppTick(e) {
    if (!global.context.paused) this.fps = 1000 / e.deltaTime
    return false
  }
  async onKeyDown(e) {
    // if (e.repeat) return

    if (this.selectedEntity && (e.key === 'Backspace' || e.key === 'Delete')) {
      this.game.removeControlledSceneEntity(this.selectedEntity)
      this.selectedEntity = undefined
      this.setSelectedEntity(undefined)
    }
    if (!e.repeat && e.key === 'Escape') global.context.paused ^= 1
    if (!e.repeat && e.key === '`') this.showDebug ^= 1
    if (e.key.toLowerCase() === 's' && e.ctrlPressed && e.shiftPressed) {
      // console.log(this.game.serialize(name))
      let fileHandle = undefined
      try {
        fileHandle = await window.showSaveFilePicker({
          types: [
            {
              description: 'JS file',
              accept: { 'text/javascript': ['.js'] },
            },
          ],
        })
      } catch (err) {
        return
      }
      const name = fileHandle.name.split('.')[0]
      const writable = await fileHandle.createWritable()
      const contents = JSON.stringify(this.game.serialize(name), null, 2)
      await writable.write(contents)
      await writable.close()
    }
  }
  onRender(e) {
    e.window.clear()
    this.game.draw(e.window)
    // this.game.drawFromPerspective(e.window, this.camera)
    if (this.selectedEntity) {
      e.window.strokeRect(
        this.camera,
        this.selectedEntity.pos.x - this.selectedEntity.dim.x / 2,
        this.selectedEntity.pos.y + this.selectedEntity.dim.y / 2,
        this.selectedEntity.dim.x,
        this.selectedEntity.dim.y,
        '#fff',
        8
      )
    }

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
    vec4.transformMat4(tc, [mouseX, mouseY, 0, 1], this.camera.inverse())
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
    this.selectedEntity = selected
  }
}
