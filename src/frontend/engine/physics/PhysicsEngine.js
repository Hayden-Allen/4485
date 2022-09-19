import matter from 'matter-js'
const { Engine, Runner, Bodies, Composite } = matter

export class PhysicsEngine {
  constructor(gravityScale) {
    this.engine = Engine.create()
    this.engine.gravity.scale *= gravityScale
    this.runner = Runner.create()
    Runner.run(this.runner, this.engine)
  }
  createRect(pos, dim, options = {}) {
    // disable rotation
    options.inertia = Infinity
    let rect = Bodies.rectangle(pos.x, pos.y, dim.x, dim.y, options)
    Composite.add(this.engine.world, rect)
    return rect
  }
}
