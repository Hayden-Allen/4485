import matter from 'matter-js'
const { Engine, Bodies, Composite, Events } = matter
import { Vec2 } from '%util/Vec2.js'

export class PhysicsEngine {
  constructor(gravityScale) {
    this.engine = Engine.create()
    this.engine.gravity.scale *= gravityScale

    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const normal = new Vec2(
          pair.collision.normal.x,
          -pair.collision.normal.y
        )
        if (pair.bodyA._owner.states)
          pair.bodyA._owner.runBehavior('OnCollide', normal, pair.bodyB._owner)
        if (pair.bodyB._owner.states)
          pair.bodyB._owner.runBehavior('OnCollide', normal, pair.bodyA._owner)
      })
    })
  }
  update(deltaTime) {
    Engine.update(this.engine, deltaTime)
  }
  createRect(pos, dim, options = {}) {
    // disable rotation
    options.inertia = Infinity
    let rect = Bodies.rectangle(pos.x, pos.y, dim.x, dim.y, options)
    Composite.add(this.engine.world, rect)
    return rect
  }
  deleteRect(rect) {
    Composite.remove(this.engine.world, rect)
  }
}
