import { global } from './Global.js'

export class Context {
  constructor() {
    this.systems = new Map()
    this.windows = []
    this.paused = false

    window.addEventListener('resize', () => this.propagateResizeEvent())
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        e.stopPropagation()
      }
    })
  }
  propagateResizeEvent() {
    this.windows.forEach((window) => window.propagateResizeEvent())
  }
  run() {
    requestAnimationFrame(this.run.bind(this))

    const { deltaTime, deltaCorrection } = global.beginFrame()
    // this is a failsafe; because this runs in the browser, switching to a different tab allows the user to make the delta time arbitraily large, which obviously breaks stuff
    // so skip this frame if more than half a second has passed since the last frame
    // this is also necessary to prevent physics from breaking
    if (deltaTime > 100) return

    global.varyingController.update(deltaTime)
    if (!this.paused) {
      // update physics
      global.physicsEngine.update(deltaTime, deltaCorrection)
      // run engine logic
      this.systems.forEach((system) => system.update(deltaTime))
    }
    // draw everything
    this.windows.forEach((window) => window.update(deltaTime))
  }
  addSystem(system) {
    if (this.systems.has(system.name))
      console.warn(`Overwriting system '${system.name}'`)
    this.systems.set(system.name, system)
  }
  removeWindow(window) {
    const i = this.windows.indexOf(window)
    if (i !== -1) {
      this.windows.splice(i, 1)
    }
  }
}
