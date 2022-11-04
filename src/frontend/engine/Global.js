import { VaryingController } from '%util/VaryingController.js'

export var global = {
  context: undefined,
  varyingController: undefined,
  gl: undefined,
  fps: 60,
  mouseX: 0,
  mouseY: 0,
  epsilon: 10e-5,
  playState: 'stop',

  canvas: {
    targetWidth: 1920,
    targetHeight: 1080,
  },
  time: {
    last: 0,
    now: 0,
    delta: 0,
    lastDelta: 0,
  },

  init: (context) => {
    async function registerAudioContext() {
      window.removeEventListener('click', registerAudioContext)

      if (!global.audioCtx) {
        global.audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)()
      }

      if (!global.audioBufferBank) {
        global.audioBufferBank = new Map()

        for (const name of ['boink', 'cheer', 'jazz-lose', 'ta-da']) {
          global.audioBufferBank.set(
            name,
            await global.decodeAudioData(`/sounds/${name}.mp3`)
          )
        }
      }
    }
    window.addEventListener('click', registerAudioContext)

    global.context = context
    global.varyingController = new VaryingController()
    global.context.addSystem(global.varyingController)
    window.oncontextmenu = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    window.onmousemove = (e) => {
      global.mouseX = e.clientX
      global.mouseY = e.clientY
    }
  },
  padZeroes: (s, n) => {
    while (s.length < n) s = '0' + s
    return s
  },
  updateTime: () => {
    global.time.now = performance.now()
    global.time.lastDelta = global.time.delta
    global.time.delta = global.time.now - global.time.last
    global.time.last = global.time.now
    return global.time.delta
  },
  beginFrame: () => {
    const deltaTime = global.updateTime()
    return { deltaTime, deltaCorrection: deltaTime / global.time.lastDelta }
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
  keyToDisplayStr: (key) => {
    if (key === ' ') {
      return 'Space'
    } else {
      return key
    }
  },
  alphabetSort: (arr) => {
    return arr.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    )
  },
  decodeAudioData: (url) => {
    return new Promise((resolve, reject) => {
      ;(async () => {
        const req = await window.fetch(url)
        const res = await req.arrayBuffer()
        global.audioCtx.decodeAudioData(
          res,
          (buffer) => resolve(buffer),
          (err) => reject(err)
        )
      })()
    })
  },
  playSound: (name) => {
    const source = global.audioCtx.createBufferSource()
    source.buffer = global.audioBufferBank.get(name)
    source.connect(global.audioCtx.destination)
    source.start()
  },
  transformDOMToCanvas: (canvas, dx, dy) => {
    const rect = canvas.getBoundingClientRect()
    const cx = (dx - rect.x) / rect.width
    const cy = (dy - rect.y) / rect.height
    return [canvas.width * cx, canvas.height * cy]
  },
  transformCanvasToWorld: (canvas, cx, cy) => {
    const tcx = (cx / canvas.width) * global.canvas.targetWidth
    const tcy = (cy / canvas.height) * global.canvas.targetHeight
    return [
      tcx - 0.5 * global.canvas.targetWidth,
      0.5 * global.canvas.targetHeight - tcy,
    ]
  },
}
