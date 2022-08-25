import { global } from './Global.js'

export class Context {
  constructor() {
    this.systems = new Map()
    this.windows = []
  }
  run() {
    const deltaTime = global.beginFrame()
    // this is a failsafe; because this runs in the browser, switching to a different tab allows the user to make the delta time arbitraily large, which obviously breaks stuff
    // so skip this frame if more than half a second has passed since the last frame
    if (deltaTime > 500) return

    // run engine logic
    this.systems.forEach((system) => system.update(deltaTime))
    // draw everything
    this.windows.forEach((window) => window.update(deltaTime))

    if (global.vsync) requestAnimationFrame(this.run.bind(this))
    else {
      const frameTime = performance.now() - global.time.now
      setTimeout(this.run.bind(this), 1000 / global.fps - frameTime)
    }
  }
  addSystem(system) {
    if (this.systems.has(system.name))
      console.warn(`Overwriting system '${system.name}'`)
    this.systems.set(system.name, system)
  }
}
