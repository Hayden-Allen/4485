import {
  KeyDownEvent,
  KeyUpEvent,
  MouseMoveEvent,
  MouseScrollEvent,
  MouseDownEvent,
  MouseUpEvent,
  AppTickEvent,
  RenderEvent,
} from './Event.js'
import { global } from '%engine/Global.js'
import { Renderer } from '%system/Renderer.js'
import { Canvas } from '%component/Canvas.js'

export class Window {
  constructor(canvas, clearColor) {
    this.layers = []

    this.renderer = new Renderer(clearColor)
    this.canvas = new Canvas(canvas)
    this.renderer.addComponent(this.canvas)

    window.addEventListener('keydown', (e) => {
      this.propagateEvent('onKeyDown', new KeyDownEvent(e))
    })
    window.addEventListener('keyup', (e) => {
      this.propagateEvent('onKeyUp', new KeyUpEvent(e))
    })
    window.addEventListener('mousemove', (e) => {
      this.propagateEvent('onMouseMove', new MouseMoveEvent(e))
    })
    window.addEventListener('mousedown', (e) => {
      this.propagateEvent('onMouseDown', new MouseDownEvent(e))
    })
    window.addEventListener('mouseup', (e) => {
      this.propagateEvent('onMouseUp', new MouseUpEvent(e))
    })
    window.addEventListener('wheel', (e) => {
      this.propagateEvent('onMouseScroll', new MouseScrollEvent(e))
    })
  }
  pushLayer(layer) {
    this.layers.push(layer)
  }
  removeLayer(layer) {
    this.layers = this.layers.filter((l) => l.debugName !== layer.debugName)
  }
  propagateEvent(fn, e) {
    // start from the top of the layer stack and continue until the event has been handled
    for (var i = this.layers.length - 1; i >= 0; i--)
      if (this.layers[i][fn](e)) break
  }
  run() {
    const deltaTime = global.beginFrame()

    // update everything
    this.propagateEvent('onAppTick', new AppTickEvent(deltaTime))
    // submit all render commands
    this.renderer.components.forEach((component) =>
      this.propagateEvent('onRender', new RenderEvent(this.renderer, component))
    )
    // draw everything
    this.renderer.update(deltaTime)

    if (global.vsync) requestAnimationFrame(this.run.bind(this))
    else {
      const frameTime = performance.now() - global.time.now
      setTimeout(this.run.bind(this), 1000 / global.fps - frameTime)
    }
  }
}
