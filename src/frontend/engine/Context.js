import { global } from './Global.js'
import { ResizeEvent } from '%window/Event.js'

export class Context {
  constructor() {
    this.systems = new Map()
    this.windows = []

    window.addEventListener('resize', () => this.propagateResizeEvent())
  }
  propagateResizeEvent() {
    this.windows.forEach((window) =>
      window.propagateEvent('onResize', new ResizeEvent())
    )
  }
  run() {
    requestAnimationFrame(this.run.bind(this))

    const deltaTime = global.beginFrame()
    // this is a failsafe; because this runs in the browser, switching to a different tab allows the user to make the delta time arbitraily large, which obviously breaks stuff
    // so skip this frame if more than half a second has passed since the last frame
    if (deltaTime > 500) return

    // run engine logic
    this.systems.forEach((system) => system.update(deltaTime))
    // draw everything
    this.windows.forEach((window) => window.update(deltaTime))
  }
  addSystem(system) {
    if (this.systems.has(system.name))
      console.warn(`Overwriting system '${system.name}'`)
    this.systems.set(system.name, system)
  }
}
