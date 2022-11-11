import { global } from './Global.js'
import { Game } from './Game.js'

export class Context {
  constructor() {
    this.systems = new Map()
    this.windows = []
    this.paused = false
    this.game = new Game(this)
    this.gameWindow = undefined

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
    this.runOnce(false, false)
  }
  runOnce(overridePause, disablePhysics) {
    const { deltaTime, deltaCorrection } = global.beginFrame()
    // this is a failsafe; because this runs in the browser, switching to a different tab allows the user to make the delta time arbitraily large, which obviously breaks stuff
    // so skip this frame if more than half a second has passed since the last frame
    // this is also necessary to prevent physics from breaking
    if (deltaTime > 100) return

    global.varyingController.update(deltaTime)
    if (!this.paused || overridePause) {
      // run engine logic
      this.systems.forEach((system) => system.update(deltaTime))
      // update physics
      if (!disablePhysics) {
        this.game.physicsEngine.update(deltaTime, deltaCorrection)
      }
    }
    // draw everything
    this.windows.forEach((window) => window.update(deltaTime))
  }
  addSystem(system) {
    if (this.systems.has(system.name))
      console.warn(`Overwriting system '${system.name}'`)
    this.systems.set(system.name, system)
  }
  removeSystem(system) {
    this.systems.delete(system.name)
  }
  removeWindow(window) {
    const i = this.windows.indexOf(window)
    if (i !== -1) {
      this.windows.splice(i, 1)
    }
  }
}
