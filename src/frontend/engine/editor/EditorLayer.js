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
      const contents =
        'export default ' + JSON.stringify(this.game.serialize(name))
      await writable.write(contents)
      await writable.close()
    }
    if (e.key.toLowerCase() === 'o' && e.ctrlPressed && e.shiftPressed) {
      e.domEvent.preventDefault()
      let fileHandle = undefined
      try {
        ;[fileHandle] = await window.showOpenFilePicker({
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
      const fileData = await fileHandle.getFile()
      const text = await fileData.text()
      const parsed = JSON.parse(text.replace('export default ', ''))
      global.context.game.deserialize(parsed)
    }
  }
  onRender(e) {
    e.window.clear()
    this.game.draw(e.window)
    // this.game.drawFromPerspective(e.window, this.camera)
    if (this.selectedEntity) {
      const border = 4
      let ex = 0,
        ey = 0
      let dimx = this.selectedEntity.dim.x + border * 2
      let dimy = this.selectedEntity.dim.y + border * 2
      if (this.selectedEntityIsControlled) {
        ex = this.selectedEntity.pos.x - this.selectedEntity.dim.x / 2
        ey = this.selectedEntity.pos.y + this.selectedEntity.dim.y / 2
      } else {
        ex = this.selectedEntity.pos.x
        ey = this.selectedEntity.pos.y + this.selectedEntity.dim.y
      }

      e.window.strokeRect(
        this.camera,
        ex - border,
        ey + border,
        dimx,
        dimy,
        '#fff',
        border
      )

      const dx = [0, 1, 1, 0]
      const dy = [0, 0, -1, -1]
      const s = 10
      // resize controls
      for (var i = 0; i < 4; i++) {
        e.window.strokeRect(
          this.camera,
          ex + dx[i] * dimx - s / 2 - border,
          ey + dy[i] * dimy + s / 2 + border,
          s,
          s,
          '#f00',
          border
        )
      }
    }
  }
  onMouseDown(e) {
    const mouseX = (2 * e.x) / this.window.canvas.width - 1
    const mouseY = 1 - (2 * e.y) / this.window.canvas.height
    let tc = vec4.create()
    vec4.transformMat4(tc, [mouseX, mouseY, 0, 1], this.camera.inverse())
    const worldMouseX = tc[0]
    const worldMouseY = tc[1]

    if (this.selectedEntity) {
    }

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
