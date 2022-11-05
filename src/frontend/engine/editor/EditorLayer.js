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
    this.textAlpha = new Varying(0.5, 1.0, -1, {
      step: 1.0,
    })
    this.showDebug = true
    this.fps = 0
    this.selectedEntity = undefined
    this.selectedEntityMass = undefined
    this.selectedEntityStatic = undefined
    this.selectedEntityOffset = undefined
    this.selectedEntityIsControlled = false
    this.setSelectedEntity = setSelectedEntity
    this.borderSize = 4
    this.dotSize = 20
    this.dotXOffset = [0, 1, 1, 0]
    this.dotYOffset = [0, 0, -1, -1]

    this.camera = new Camera(
      [0, 0, 0],
      -global.canvas.targetWidth / 2,
      global.canvas.targetWidth / 2,
      -global.canvas.targetHeight / 2,
      global.canvas.targetHeight / 2
    )
  }
  deleteSelectedEntity() {
    if (this.selectedEntity) {
      if (this.selectedEntityIsControlled) {
        this.game.removeControlledSceneEntity(this.selectedEntity)
      } else {
        this.game.removeStaticSceneEntity(this.selectedEntity)
      }
      this.selectedEntity = undefined
      this.setSelectedEntity(undefined)
    }
  }
  onAppTick(e) {
    if (!global.context.paused) this.fps = 1000 / e.deltaTime
    return false
  }
  async onKeyDown(e) {
    // if (e.repeat) return

    if (e.key === 'Backspace' || e.key === 'Delete') {
      this.deleteSelectedEntity()
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

    {
      const mouseX =
        (2 * this.window.inputCache.mousePos.x) / this.window.canvas.width - 1
      const mouseY =
        1 - (2 * this.window.inputCache.mousePos.y) / this.window.canvas.height
      let tc = vec4.create()
      vec4.transformMat4(tc, [mouseX, mouseY, 0, 1], this.camera.inverse())
      const worldMouseX = tc[0]
      const worldMouseY = tc[1]

      e.window.drawRect(
        this.camera,
        worldMouseX - this.dotSize / 2,
        worldMouseY + this.dotSize / 2,
        this.dotSize,
        this.dotSize,
        '#0f0'
      )
    }

    // this.game.drawFromPerspective(e.window, this.camera)
    if (this.selectedEntity) {
      let ex = 0,
        ey = 0
      let dimx = this.selectedEntity.dim.x + this.borderSize * 2
      let dimy = this.selectedEntity.dim.y + this.borderSize * 2
      if (this.selectedEntityIsControlled) {
        ex = this.selectedEntity.pos.x - this.selectedEntity.dim.x / 2
        ey = this.selectedEntity.pos.y + this.selectedEntity.dim.y / 2
      } else {
        ex = this.selectedEntity.pos.x
        ey = this.selectedEntity.pos.y + this.selectedEntity.dim.y
      }

      e.window.strokeRect(
        this.camera,
        ex - this.borderSize,
        ey + this.borderSize,
        dimx,
        dimy,
        '#fff',
        this.borderSize
      )

      if (global.playState === 'stop') {
        // resize controls
        for (var i = 0; i < this.dotXOffset.length; i++) {
          const [dx, dy] = this.getResizeDotCoords(i)
          e.window.drawRect(
            this.camera,
            dx,
            dy,
            this.dotSize,
            this.dotSize,
            '#f00'
          )
        }
      }
    }
    if (global.playState === 'pause') {
      e.window.uiCanvas.drawTransparentRect(
        0,
        0,
        e.window.canvas.width,
        e.window.canvas.height,
        '#000',
        0.5
      )

      const systemFontFamily =
        '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif'
      e.window.uiCanvas.drawCenteredText(
        'PAUSED',
        e.window.canvas.width / 2,
        e.window.canvas.height / 2,
        systemFontFamily,
        20,
        `rgba(255, 255, 255, ${this.textAlpha.getValue()})`
      )
    }
  }
  getMouseWorldCoords(mx, my) {
    const mouseX = (2 * mx) / this.window.canvas.width - 1
    const mouseY = 1 - (2 * my) / this.window.canvas.height
    let tc = vec4.create()
    vec4.transformMat4(tc, [mouseX, mouseY, 0, 1], this.camera.inverse())
    return [tc[0], tc[1]]
  }
  onMouseDown(e) {
    const [worldMouseX, worldMouseY] = this.getMouseWorldCoords(e.x, e.y)

    // check resize controls
    if (this.selectedEntity) {
      for (var i = 0; i < this.dotXOffset.length; i++) {
        const [dx, dy] = this.getResizeDotCoords(i)
        if (
          global.rectIntersect(
            worldMouseX,
            worldMouseY,
            dx,
            dy - this.dotSize,
            this.dotSize,
            this.dotSize
          )
        ) {
          this.resizeCorner = i
          this.resizeStartX = e.x
          this.resizeStartY = e.y
          this.resizeStartScaleX = this.selectedEntity.renderable.scaleX
          this.resizeStartScaleY = this.selectedEntity.renderable.scaleY
          this.resizeStartEntityX = this.selectedEntity.pos.x
          this.resizeStartEntityY = this.selectedEntity.pos.y
          this.resizeStartTexX = this.selectedEntity.getTexCoordX()
          this.resizeStartTexY = this.selectedEntity.getTexCoordY()
          this.resizeStartW = this.selectedEntity.dim.x
          this.resizeStartH = this.selectedEntity.dim.y
          return
        }
      }
      this.resizeStartX = this.resizeStartY = undefined
    }

    // check entity intersection
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
          selected = e
        }
      })
    })

    if (selected) {
      this.selectedEntityOffset = new Vec2(
        worldMouseX - selected.pos.x,
        worldMouseY - selected.pos.y
      )
      this.selectedEntityMass = selected.physicsProxy.mass
      this.selectedEntityStatic = selected.ops.isStatic
      selected.ops.isStatic = true
      Body.setStatic(selected.physicsProxy, true)
    }

    this.setSelectedEntity(selected)
    this.selectedEntity = selected

    if (e.button == 1) {
      this.deleteSelectedEntity()
    }
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
    const [worldMouseX, worldMouseY] = this.getMouseWorldCoords(e.x, e.y)
    if (
      global.playState === 'stop' &&
      this.selectedEntity &&
      this.window.inputCache.isMouseLeft()
    ) {
      if (this.resizeStartX) {
        const sox = [-1, 1, 1, -1]
        const soy = [1, 1, -1, -1]
        const ox = (e.x - this.resizeStartX) * sox[this.resizeCorner]
        const oy = (this.resizeStartY - e.y) * soy[this.resizeCorner]
        if (
          this.resizeStartScaleX + ox >= 16 &&
          this.resizeStartScaleY + oy >= 16
        ) {
          // 3 - tr (1, -1)
          // 2 - tl (0, -1)
          // 1 - bl (0, 0)
          // 0 - br (1, 0)
          if (this.selectedEntityIsControlled) {
            const npw =
              (this.resizeStartScaleX + ox) *
              (this.selectedEntity.maxX - this.selectedEntity.minX)
            const nph =
              (this.resizeStartScaleY + oy) *
              (this.selectedEntity.maxY - this.selectedEntity.minY)
            const crx = [1, -1, -1, 1]
            const cry = [-1, -1, 1, 1]
            this.selectedEntity.setPosition(
              this.selectedEntity.pos.x +
                ((this.selectedEntity.dim.x - npw) * crx[this.resizeCorner]) /
                  2,
              this.selectedEntity.pos.y +
                ((this.selectedEntity.dim.y - nph) * cry[this.resizeCorner]) / 2
            )
          } else {
            switch (this.resizeCorner) {
              case 0:
                this.selectedEntity.setPosition(
                  worldMouseX,
                  this.selectedEntity.pos.y
                )
                break
              case 1:
                this.selectedEntity.setPosition(
                  this.selectedEntity.pos.x,
                  this.selectedEntity.pos.y
                )
                break
              case 2:
                this.selectedEntity.setPosition(
                  this.selectedEntity.pos.x,
                  worldMouseY
                )
                break
              case 3:
                this.selectedEntity.setPosition(worldMouseX, worldMouseY)
                break
            }
          }

          this.selectedEntity.setScale(
            this.resizeStartScaleX + ox,
            this.resizeStartScaleY + oy
          )

          if (this.window.inputCache.isKeyPressed('Shift')) {
            this.selectedEntity.setTexCoordX(
              (this.resizeStartTexX * this.selectedEntity.dim.x) /
                this.resizeStartW
            )
            this.selectedEntity.setTexCoordY(
              (this.resizeStartTexY * this.selectedEntity.dim.y) /
                this.resizeStartH
            )
          }
        }
      } else {
        const [wx, wy] = global.transformCanvasToWorld(
          this.window.canvas,
          e.x,
          e.y
        )
        this.selectedEntity.setPosition(
          wx - this.selectedEntityOffset.x,
          wy - this.selectedEntityOffset.y
        )
      }
    }
  }
  getSelectedEntityBaseCoords() {
    let ex = 0,
      ey = 0
    if (this.selectedEntityIsControlled) {
      ex = this.selectedEntity.pos.x - this.selectedEntity.dim.x / 2
      ey = this.selectedEntity.pos.y + this.selectedEntity.dim.y / 2
    } else {
      ex = this.selectedEntity.pos.x
      ey = this.selectedEntity.pos.y + this.selectedEntity.dim.y
    }
    return [ex, ey]
  }
  getSelectedEntityEffectiveDims() {
    return [
      this.selectedEntity.dim.x + this.borderSize * 2,
      this.selectedEntity.dim.y + this.borderSize * 2,
    ]
  }
  getResizeDotCoords(i) {
    const [ex, ey] = this.getSelectedEntityBaseCoords()
    const [dimx, dimy] = this.getSelectedEntityEffectiveDims()
    return [
      ex + this.dotXOffset[i] * dimx - this.dotSize / 2 - this.borderSize,
      ey + this.dotYOffset[i] * dimy + this.dotSize / 2 + this.borderSize,
    ]
  }
}
