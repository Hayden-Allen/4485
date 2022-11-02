import { Layer } from '%window/Layer.js'
import { Varying } from '%util/Varying.js'
import * as vec4 from '%glMatrix/vec4.js'
import { global } from '%engine/Global.js'
import { Camera } from '%graphics/Camera.js'
import { Vec2 } from '%util/Vec2.js'
import matter from 'matter-js'

const { Body } = matter

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
    this.selectedEntityMass = undefined
    this.selectedEntityStatic = undefined
    this.selectedEntityOffset = undefined
    this.selectedEntityIsControlled = false
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
      if (this.selectedEntityIsControlled) {
        this.game.removeControlledSceneEntity(this.selectedEntity)
      } else {
        this.game.removeStaticSceneEntity(this.selectedEntity)
      }
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
      if (this.selectedEntityIsControlled) {
        e.window.strokeRect(
          this.camera,
          this.selectedEntity.pos.x - this.selectedEntity.dim.x / 2,
          this.selectedEntity.pos.y + this.selectedEntity.dim.y / 2,
          this.selectedEntity.dim.x,
          this.selectedEntity.dim.y,
          '#fff',
          4
        )
      } else {
        e.window.strokeRect(
          this.camera,
          this.selectedEntity.pos.x,
          this.selectedEntity.pos.y + this.selectedEntity.dim.y,
          this.selectedEntity.dim.x,
          this.selectedEntity.dim.y,
          '#fff',
          4
        )
      }
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
    this.game.currentScene.layers.forEach((layer) => {
      if (selected) return
      layer.static.forEach((e) => {
        if (selected) return
        if (
          global.rectIntersect(
            worldMouseX,
            worldMouseY,
            e.pos.x,
            e.pos.y,
            e.dim.x,
            e.dim.y
          )
        ) {
          this.selectedEntityIsControlled = false
          this.selectedEntityOffset = new Vec2(
            worldMouseX - e.pos.x,
            worldMouseY - e.pos.y
          )
          selected = e
        }
      })
      if (selected) return
      layer.dynamic.forEach((e) => {
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
          this.selectedEntityIsControlled = true
          this.selectedEntityOffset = new Vec2(
            worldMouseX - (e.pos.x - e.dim.x / 2),
            worldMouseY - (e.pos.y - e.dim.y / 2)
          )
          selected = e
        }
      })
    })

    if (selected) {
      this.selectedEntityMass = selected.physicsProxy.mass
      this.selectedEntityStatic = selected.ops.isStatic
      selected.ops.isStatic = true
      Body.setStatic(selected.physicsProxy, true)
    }

    this.setSelectedEntity(selected)
    this.selectedEntity = selected
  }
  onMouseUp(e) {
    if (this.selectedEntity && e.button === 0) {
      Body.setStatic(
        this.selectedEntity.physicsProxy,
        this.selectedEntityStatic
      )
      this.selectedEntity.ops.isStatic = this.selectedEntityStatic
      Body.setMass(this.selectedEntity.physicsProxy, this.selectedEntityMass)
      Body.setInertia(this.selectedEntity.physicsProxy, Infinity)
    }
  }
  onMouseMove(e) {
    if (this.selectedEntity && this.window.inputCache.isMouseLeft()) {
      // console.log(e.x, e.y)
      const { wx, wy } = global.transformCanvasToWorld(e.x, e.y)
      this.selectedEntity.setPosition(
        wx - this.selectedEntityOffset.x,
        wy - this.selectedEntityOffset.y
      )
    }
  }
}
