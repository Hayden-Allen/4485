import { InputCache } from '%window/InputCache.js'
import { VaryingController } from '%system/VaryingController.js'

export var global = {
  input: undefined,
  varyingController: undefined,
  vsync: false,
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
    global.input = new InputCache()
    global.varyingController = new VaryingController()
    context.addSystem(global.varyingController)
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
    global.varyingController.update(deltaTime / 1000)
    return deltaTime
  },
  clamp: (x, min, max) => {
    return Math.min(max, Math.max(x, min))
  },
}
