import { Component } from './Component.js'
import { Vec2 } from '%util/Vec2.js'
import { Renderable } from '%graphics/Renderable.js'
import { global } from '%engine/Global.js'
import matter from 'matter-js'
const { Body } = matter

const VERTEX_DATA = [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1]
const INDEX_DATA = [0, 1, 2, 0, 2, 3]
class SceneEntityOptions {
  constructor({
    vertices = VERTEX_DATA,
    indices = INDEX_DATA,
    isStatic = true,
    scale = 1,
  } = {}) {
    this.vertices = vertices
    this.indices = indices
    this.isStatic = isStatic
    this.scale = scale
  }
}

// base class for everything that exists in the scene
export class SceneEntity extends Component {
  constructor(gameWindow, pos, url, options = {}) {
    super('SceneEntity')
    const ops = new SceneEntityOptions(options)
    const vertexData = ops.vertices,
      indexData = ops.indices
    this.renderable = new Renderable(
      gameWindow.gl,
      pos,
      gameWindow.shaderProgram,
      vertexData,
      indexData,
      url,
      { scale: ops.scale }
    )

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

    this.pos = pos
    this.dim = new Vec2(this.maxX - this.minX, this.maxY - this.minY).scale(
      ops.scale
    )
    // physics
    this.physicsProxy = global.physicsEngine.createRect(
      this.pos.plus(this.dim.scale(0.5)),
      this.dim,
      {
        isStatic: ops.isStatic,
        frictionAir: 0,
        frictionStatic: 0,
      }
    )
    this.physicsProxy._owner = this
    /**
     * @HATODO for platformers?
     */
    // Body.setCentre(
    //   this.physicsProxy,
    //   { x: -this.dim.x / 2, y: this.dim.y / 2 },
    //   true
    // )
  }
}

export class DynamicSceneEntity extends SceneEntity {
  constructor(gameWindow, pos, url, options = {}) {
    super(gameWindow, pos, url, { isStatic: false, ...options })
    const v = options.vel || new Vec2(0, 0)
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
    Body.setVelocity(this.physicsProxy, { x: v.x, y: -v.y })
  }
}

export class ControlledSceneEntity extends DynamicSceneEntity {
  constructor(gameWindow, pos, url, script, options = {}) {
    super(gameWindow, pos, url, options)
    this.script = script
  }
  // runControllers(deltaTimeSeconds) {
  //   this.controllers.forEach((controller) =>
  //     controller.run(this, deltaTimeSeconds)
  //   )
  // }
  runScript(event, ...data) {
    this.script.run(this, event, ...data)
  }
}
