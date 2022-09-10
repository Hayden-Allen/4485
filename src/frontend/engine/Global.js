import { VaryingController } from '%system/VaryingController.js'
import { PhysicsEngine } from '%physics/PhysicsEngine.js'

export var global = {
  varyingController: undefined,
  physicsEngine: undefined,
  fps: 60,

  canvas: {
    targetWidth: 1920,
    targetHeight: 1080,
  },
  time: {
    last: 0,
    now: 0,
    delta: 0,
  },

  init: (context) => {
    global.physicsEngine = new PhysicsEngine(0)
    global.varyingController = new VaryingController()
    context.addSystem(global.varyingController)
    window.oncontextmenu = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
  },
  padZeroes: (s, n) => {
    while (s.length < n) s = '0' + s
    return s
  },
  updateTime: () => {
    global.time.now = performance.now()
    global.time.delta = global.time.now - global.time.last
    global.time.last = global.time.now
    return global.time.delta
  },
  beginFrame: () => {
    const deltaTime = global.updateTime()
    return deltaTime
  },
  clamp: (x, min, max) => {
    return Math.min(max, Math.max(x, min))
  },
  rectIntersect: (x0, y0, x, y, w, h) => {
    return y0 >= y && y0 <= y + h && x0 >= x && x0 <= x + w
  },
}
