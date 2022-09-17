import { VaryingController } from '%system/VaryingController.js'

export var global = {
  varyingController: undefined,
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
  colorMix: (a, b, x) => {
    const ai = parseInt(a.substring(1), 16)
    const bi = parseInt(b.substring(1), 16)
    const ra = ai >> 16,
      rb = bi >> 16
    const ga = (ai >> 8) & 0xff,
      gb = (bi >> 8) & 0xff
    const ba = ai & 0xff,
      bb = bi & 0xff

    const rf = Math.floor(x * ra + (1 - x) * rb)
    const gf = Math.floor(x * ga + (1 - x) * gb)
    const bf = Math.floor(x * ba + (1 - x) * bb)
    const rfs = global.padZeroes(rf.toString(16), 2)
    const gfs = global.padZeroes(gf.toString(16), 2)
    const bfs = global.padZeroes(bf.toString(16), 2)
    return `#${rfs}${gfs}${bfs}`
  },
  lineLength: (x1, y1, x2, y2) => {
    const dx = x1 - x2,
      dy = y1 - y2
    return Math.sqrt(dx * dx + dy * dy)
  },
}
