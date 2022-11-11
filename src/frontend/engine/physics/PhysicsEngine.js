import matter from 'matter-js'
const { Engine, Bodies, Body, Composite, Events, Runner, World } = matter
import { Vec2 } from '%util/Vec2.js'

export class PhysicsEngine {
  constructor(game, gravityScale) {
    this.game = game
    this.engine = Engine.create()
    this.engine.gravity.scale = gravityScale

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
          pair.bodyA._owner.runScripts('OnCollide', {
            camera: game.currentScene.camera,
            data: [normalA, pair.bodyB._owner],
          })
        if (pair.bodyB._owner.states)
          pair.bodyB._owner.runScripts('OnCollide', {
            camera: game.currentScene.camera,
            data: [normalB, pair.bodyA._owner],
          })
      })
    })

    // Runner.run(this.engine)
  }
  reset() {
    World.clear(this.engine.world)
    Engine.clear(this.engine)
  }
  update(deltaTime, deltaCorrection) {
    Engine.update(this.engine, deltaTime, deltaCorrection)
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
