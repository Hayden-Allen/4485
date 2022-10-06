import matter from 'matter-js'
const { Engine, Bodies, Composite, Events } = matter
import { Vec2 } from '%util/Vec2.js'

export class PhysicsEngine {
  constructor(gravityScale) {
    this.engine = Engine.create()
    this.engine.gravity.scale *= gravityScale

    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        // normal relative to pair.bodyB (+y is up)
        const normalB = new Vec2(
          pair.collision.normal.x,
          -pair.collision.normal.y
        )
        // normal relative to pair.bodyA
        const normalA = normalB.scale(-1)

        if (pair.bodyA._owner.states)
          pair.bodyA._owner.runBehavior('OnCollide', normalA, pair.bodyB._owner)
        if (pair.bodyB._owner.states)
          pair.bodyB._owner.runBehavior('OnCollide', normalB, pair.bodyA._owner)
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
