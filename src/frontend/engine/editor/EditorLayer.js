import { Layer } from '%window/Layer.js'
import { Varying } from '%util/Varying.js'
import * as vec4 from '%glMatrix/vec4.js'
import { global } from '%engine/Global.js'
import { Camera } from '%graphics/Camera.js'
import { Vec2 } from '%util/Vec2.js'

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
    this.dragStartX = 0
    this.dragStartY = 0
    this.dragStartCameraX = 0
    this.dragStartCameraY = 0
    this.cameraMoveSpeed = 5
    this.cameraZoom = 1
    this.cameraZoomMin = 0.1
    this.cameraZoomMax = 10
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
      const contents = 'export default ' + this.game.serialize(name)
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
      global.context.game.deserialize(text.replace('export default ', ''))
    }
  }
  onRender(e) {
    e.window.clear()
    e.window.drawFps()
    if (global.playState === 'stop') {
      this.game.drawFromPerspective(e.window, this.camera)
    } else {
      this.game.draw(e.window)
    }

    // {
    //   const mouseX =
    //     (2 * this.window.inputCache.mousePos.x) / this.window.canvas.width - 1
    //   const mouseY =
    //     1 - (2 * this.window.inputCache.mousePos.y) / this.window.canvas.height
    //   let tc = vec4.create()
    //   vec4.transformMat4(tc, [mouseX, mouseY, 0, 1], this.camera.inverse())
    //   const worldMouseX = tc[0]
    //   const worldMouseY = tc[1]

    //   e.window.drawRect(
    //     this.camera,
    //     worldMouseX - this.dotSize / 2,
    //     worldMouseY + this.dotSize / 2,
    //     this.dotSize,
    //     this.dotSize,
    //     '#0f0'
    //   )
    // }

    if (this.selectedEntity) {
      const [ex, ey] = this.getResizeDotCoords(0)
      const [dimx, dimy] = this.getSelectedEntityEffectiveDims()
      e.window.strokeRect(
        this.camera,
        ex + (this.borderSize * 2) / this.cameraZoom,
        ey - (this.borderSize * 2) / this.cameraZoom,
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
            this.dotSize / this.cameraZoom,
            this.dotSize / this.cameraZoom,
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
    if (global.playState !== 'stop') {
      return
    }

    const [worldMouseX, worldMouseY] = this.getMouseWorldCoords(e.x, e.y)
    if (e.button === 2) {
      this.dragStartX = e.x
      this.dragStartY = e.y
      this.dragStartCameraX = this.camera.pos[0]
      this.dragStartCameraY = this.camera.pos[1]
    }

    // check resize controls
    if (this.selectedEntity) {
      for (var i = 0; i < this.dotXOffset.length; i++) {
        const [dx, dy] = this.getResizeDotCoords(i)
        if (
          global.rectIntersect(
            worldMouseX,
            worldMouseY,
            dx,
            dy - this.dotSize / this.cameraZoom,
            this.dotSize / this.cameraZoom,
            this.dotSize / this.cameraZoom
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
            e.pos.x - e.dim.x / 2,
            e.pos.y - e.dim.y / 2,
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
    }

    this.setSelectedEntity(selected)
    this.selectedEntity = selected

    if (e.button == 1) {
      this.deleteSelectedEntity()
    }
  }
  onMouseMove(e) {
    if (global.playState !== 'stop') {
      return
    }

    if (this.window.inputCache.isMouseRight()) {
      const dx = e.x - this.dragStartX
      const dy = this.dragStartY - e.y
      this.camera.setPosition({
        x: -(
          this.dragStartCameraX +
          (dx * global.canvas.targetWidth) /
            this.window.canvas.width /
            this.cameraZoom
        ),
        y: -(
          this.dragStartCameraY +
          (dy * global.canvas.targetHeight) /
            this.window.canvas.height /
            this.cameraZoom
        ),
      })
    }

    if (
      global.playState === 'stop' &&
      this.selectedEntity &&
      this.window.inputCache.isMouseLeft()
    ) {
      if (this.resizeStartX) {
        const sox = [-1, 1, 1, -1]
        const soy = [1, 1, -1, -1]
        const ox =
          ((e.x - this.resizeStartX) / this.cameraZoom) * sox[this.resizeCorner]
        const oy =
          ((this.resizeStartY - e.y) / this.cameraZoom) * soy[this.resizeCorner]
        if (
          this.resizeStartScaleX + ox >= 16 &&
          this.resizeStartScaleY + oy >= 16
        ) {
          // 3 - tr (1, -1)
          // 2 - tl (0, -1)
          // 1 - bl (0, 0)
          // 0 - br (1, 0)
          const npw =
            (this.resizeStartScaleX + ox) *
            (this.selectedEntity.maxX - this.selectedEntity.minX)
          const nph =
            (this.resizeStartScaleY + oy) *
            (this.selectedEntity.maxY - this.selectedEntity.minY)
          const crx = [1, -1, -1, 1]
          const cry = [-1, -1, 1, 1]
          this.selectedEntity.setPositionFromEditor(
            this.selectedEntity.pos.x +
              ((this.selectedEntity.dim.x - npw) * crx[this.resizeCorner]) / 2,
            this.selectedEntity.pos.y +
              ((this.selectedEntity.dim.y - nph) * cry[this.resizeCorner]) / 2
          )

          this.selectedEntity.setScaleFromEditor(
            this.resizeStartScaleX + ox,
            this.resizeStartScaleY + oy
          )

          if (this.window.inputCache.isKeyPressed('Shift')) {
            let tx =
              (this.resizeStartTexX * this.selectedEntity.dim.x) /
              this.resizeStartW
            let ty =
              (this.resizeStartTexY * this.selectedEntity.dim.y) /
              this.resizeStartH
            if (!this.window.inputCache.isKeyPressed('Control')) {
              tx = Math.max(1, Math.floor(tx))
              ty = Math.max(1, Math.floor(ty))
            }

            this.selectedEntity.setTexCoordX(tx)
            this.selectedEntity.setTexCoordY(ty)
          }
        }
      } else {
        const [wx, wy] = this.getMouseWorldCoords(e.x, e.y)
        this.selectedEntity.setPositionFromEditor(
          wx - this.selectedEntityOffset.x,
          wy - this.selectedEntityOffset.y
        )
      }
    }
  }
  onMouseScroll(e) {
    if (global.playState === 'stop') {
      this.cameraZoom = global.clamp(
        this.cameraZoom - e.y * this.cameraZoom * 0.001,
        this.cameraZoomMin,
        this.cameraZoomMax
      )
      this.camera.setZoomFromEditor(this.cameraZoom)
    }
  }
  getSelectedEntityBaseCoords() {
    return [
      this.selectedEntity.pos.x -
        this.selectedEntity.dim.x / 2 -
        this.borderSize / this.cameraZoom,
      this.selectedEntity.pos.y +
        this.selectedEntity.dim.y / 2 -
        this.borderSize / this.cameraZoom,
    ]
  }
  getSelectedEntityEffectiveDims() {
    return [
      this.selectedEntity.dim.x + (this.borderSize * 2) / this.cameraZoom,
      this.selectedEntity.dim.y + (this.borderSize * 2) / this.cameraZoom,
    ]
  }
  getResizeDotCoords(i) {
    const [ex, ey] = this.getSelectedEntityBaseCoords()
    const [dimx, dimy] = this.getSelectedEntityEffectiveDims()
    return [
      ex +
        this.dotXOffset[i] * dimx -
        (this.dotSize / 2 - this.borderSize) / this.cameraZoom,
      ey +
        this.dotYOffset[i] * dimy +
        (this.dotSize / 2 + this.borderSize) / this.cameraZoom,
    ]
  }
}
