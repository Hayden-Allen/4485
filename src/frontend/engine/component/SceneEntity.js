import { Component } from './Component.js'
import { Vec2 } from '%util/Vec2.js'
import { Renderable } from '%graphics/Renderable.js'
import { global } from '%engine/Global.js'
import { Body } from 'matter-js'

const VERTEX_DATA = [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1]
const INDEX_DATA = [0, 1, 2, 0, 2, 3]
// base class for everything that exists in the scene
export class SceneEntity extends Component {
  constructor(gameWindow, url, { vertices, indices, isStatic = true } = {}) {
    super('SceneEntity')
    const vertexData = vertices || VERTEX_DATA,
      indexData = indices || INDEX_DATA
    this.renderable = new Renderable(
      gameWindow.gl,
      gameWindow.shaderProgram,
      vertexData,
      indexData,
      url
    )
    // TODO
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity
    for (var i = 0; i < vertexData.length; i += 4) {
      minX = Math.min(minX, vertexData[i])
      maxX = Math.max(maxX, vertexData[i])
      minY = Math.min(minY, vertexData[i + 1])
      maxY = Math.max(maxY, vertexData[i + 1])
    }

    this.pos = new Vec2(minX, minY)
    this.dim = new Vec2(maxX - minX, maxY - minY)
    // physics
    this.physicsProxy = global.physicsEngine.createRect(this.pos, this.dim, {
      isStatic,
    })
    Body.setCentre(
      this.physicsProxy,
      { x: -this.dim.x / 2, y: this.dim.y / 2 },
      true
    )
  }
  setVelocity() {}
  draw(window) {
    window.draw(this.renderable)
    window.uiCanvas.strokeRect(
      this.pos.x,
      this.pos.y,
      this.dim.x,
      this.dim.y,
      '#f00'
    )
  }
}

export class DynamicSceneEntity extends SceneEntity {
  constructor(gameWindow, url, { vel } = {}) {
    super(gameWindow, url, { isStatic: false })
    const v = vel || new Vec2(0, 0)
    Body.setVelocity(this.physicsProxy, { x: v.x, y: v.y })
  }
  move() {
    // copy position from physics simulation
    const { position } = this.physicsProxy
    this.pos.x = position.x
    this.pos.y = position.y

    this.renderable.setTransform(this.pos)
  }
  setVelocity(v) {
    const scale = 1 / 500
    Body.setVelocity(this.physicsProxy, { x: v.x * scale, y: -v.y * scale })
  }
}

export class ControlledSceneEntity extends DynamicSceneEntity {
  constructor(gameWindow, url, { vel, controllers } = {}) {
    super(gameWindow, url, { vel })
    this.controllers = controllers || []
  }
  runControllers(deltaTimeSeconds) {
    this.controllers.forEach((controller) =>
      controller.run(this, deltaTimeSeconds)
    )
  }
}
