import { Component } from './Component.js'
import { Vec2 } from '%util/Vec2.js'
import { Renderable } from '%graphics/Renderable.js'

const VERTEX_DATA = [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1]
const INDEX_DATA = [0, 1, 2, 0, 2, 3]
// base class for everything that exists in the scene
export class SceneEntity extends Component {
  constructor(gameWindow, pos, dim, url, { vertices, indices } = {}) {
    super('SceneEntity')
    this.renderable = new Renderable(
      gameWindow.gl,
      gameWindow.shaderProgram,
      vertices || VERTEX_DATA,
      indices || INDEX_DATA,
      url
    )
    this.renderable.setTransform(pos)
    // TODO
    this.pos = pos
    this.dim = dim
  }
}

export class DynamicSceneEntity extends SceneEntity {
  constructor(gameWindow, pos, dim, url, { vel } = {}) {
    super(gameWindow, pos, dim, url)
    this.vel = vel || new Vec2(0, 0)
  }
  move(deltaTimeSeconds) {
    let sv = this.vel.scale(deltaTimeSeconds)
    sv.y *= -1
    this.pos.plusEqual(sv)
    this.renderable.setTransform(this.pos)
  }
}

export class ControlledSceneEntity extends DynamicSceneEntity {
  constructor(gameWindow, pos, dim, url, { vel, controllers } = {}) {
    super(gameWindow, pos, dim, url, { vel })
    this.controllers = controllers || []
  }
  runControllers(deltaTimeSeconds) {
    this.controllers.forEach((controller) =>
      controller.run(this, deltaTimeSeconds)
    )
  }
}
