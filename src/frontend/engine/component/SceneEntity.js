import { Component } from './Component.js'
import { Vec2 } from '%util/Vec2.js'

// base class for everything that exists in the scene
export class SceneEntity extends Component {
  constructor(pos, dim, color) {
    super('SceneEntity')
    this.pos = pos
    this.dim = dim
    this.color = color
  }
  draw(window) {
    window.drawRect(this.pos.x, this.pos.y, this.dim.x, this.dim.y, this.color)
  }
}

export class DynamicSceneEntity extends SceneEntity {
  constructor(pos, dim, color, { vel } = {}) {
    super(pos, dim, color)
    this.vel = vel || new Vec2(0, 0)
  }
}

export class ControlledSceneEntity extends DynamicSceneEntity {
  constructor(pos, dim, color, { vel, controllers } = {}) {
    super(pos, dim, color, { vel })
    this.controllers = controllers || []
  }
  runControllers(deltaTimeSeconds) {
    this.controllers.forEach((controller) =>
      controller.run(this, deltaTimeSeconds)
    )
  }
}
