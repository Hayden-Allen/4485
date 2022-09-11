import { Component } from './Component.js'
import { Vec2 } from '%util/Vec2.js'
import { Renderable } from '%graphics/Renderable.js'
import { global } from '%engine/Global.js'
import { Body } from 'matter-js'
import * as mat4 from '%glMatrix/mat4.js'

const VERTEX_DATA = [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1]
const INDEX_DATA = [0, 1, 2, 0, 2, 3]
// base class for everything that exists in the scene
export class SceneEntity extends Component {
  constructor(
    gameWindow,
    pos,
    url,
    { vertices, indices, isStatic = true } = {}
  ) {
    super('SceneEntity')
    const vertexData = vertices || VERTEX_DATA,
      indexData = indices || INDEX_DATA
    this.renderable = new Renderable(
      gameWindow.gl,
      pos,
      gameWindow.shaderProgram,
      vertexData,
      indexData,
      url
    )
    // TODO
    this.minX = Infinity
    this.maxX = -Infinity
    this.minY = Infinity
    this.maxY = -Infinity
    for (var i = 0; i < vertexData.length; i += 4) {
      this.minX = Math.min(this.minX, vertexData[i])
      this.maxX = Math.max(this.maxX, vertexData[i])
      this.minY = Math.min(this.minY, vertexData[i + 1])
      this.maxY = Math.max(this.maxY, vertexData[i + 1])
    }

    // this.pos = new Vec2(pos.x + minX, pos.y + minY)
    this.pos = pos
    this.dim = new Vec2(this.maxX - this.minX, this.maxY - this.minY).scale(25)
    // physics
    console.log(this.pos, this.dim)
    this.physicsProxy = global.physicsEngine.createRect(
      this.pos.plus(this.dim.scale(0.5)),
      this.dim,
      {
        isStatic,
      }
    )
    // Body.setCentre(
    //   this.physicsProxy,
    //   { x: -this.dim.x / 2, y: this.dim.y / 2 },
    //   true
    // )
    console.log(this.physicsProxy)
  }
  setVelocity() {}
  draw(window) {
    window.draw(this.renderable)
    window.strokeRect(
      this.renderable.transform,
      this.minX,
      this.maxY,
      this.dim.x,
      this.dim.y,
      '#f00'
    )
    let pt = mat4.create()
    mat4.fromTranslation(pt, [
      this.physicsProxy.position.x,
      this.physicsProxy.position.y,
      -1,
    ])
    const b = this.physicsProxy.bounds
    window.strokeRect(
      pt,
      b.min.x,
      b.max.y,
      b.max.x - b.min.x,
      b.max.y - b.min.y,
      '#0f0'
    )
  }
}

export class DynamicSceneEntity extends SceneEntity {
  constructor(gameWindow, pos, url, { vel } = {}) {
    super(gameWindow, pos, url, { isStatic: false })
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
    /**
     * @HATODO cleanup
     */
    const scale = 1
    Body.setVelocity(this.physicsProxy, { x: v.x * scale, y: -v.y * scale })
  }
}

export class ControlledSceneEntity extends DynamicSceneEntity {
  constructor(gameWindow, pos, url, { vel, controllers } = {}) {
    super(gameWindow, pos, url, { vel })
    this.controllers = controllers || []
  }
  runControllers(deltaTimeSeconds) {
    this.controllers.forEach((controller) =>
      controller.run(this, deltaTimeSeconds)
    )
  }
}
