import { Renderer } from '%graphics/Renderer.js'
import { Window } from './Window.js'
import { Camera } from '%graphics/Camera.js'
import { ShaderProgram } from '%graphics/ShaderProgram.js'

const VERTEX_SOURCE = `
  attribute vec2 i_pos;
  attribute vec2 i_tex;

  uniform mat4 u_mvp;

  varying highp vec2 v_tex;

  void main() {
    gl_Position = u_mvp * vec4(i_pos, 0, 1);
    v_tex = i_tex;
  }
`
const FRAGMENT_SOURCE = `
  uniform sampler2D u_texture;

  varying highp vec2 v_tex;

  void main() {
    gl_FragColor = texture2D(u_texture, v_tex);
  }
`

export class Window3D extends Window {
  constructor(canvas, clearColor) {
    super(canvas, clearColor)
    this.camera = new Camera([0, 0, 0], 45)
    this.shaderProgram = new ShaderProgram(
      this.gl,
      VERTEX_SOURCE,
      FRAGMENT_SOURCE
    )
    // performance tracking
    this.fpsElement = document.getElementById('fps')
    this.fpsSamples = new Array(100).fill(0)
  }
  setCanvas(canvas) {
    super.setCanvas(canvas)
    if (this.gl) return
    this.gl = canvas.getContext('webgl2')
    // flip images on load
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
    this.renderer = new Renderer(this.gl, this.clearColor)
  }
  clear() {
    this.renderer.clear()
  }
  propagateResizeEvent() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    super.propagateResizeEvent()
  }
  draw(renderable) {
    this.renderer.draw(renderable, this.camera, this.shaderProgram)
  }
  update(deltaTime) {
    super.update(deltaTime)

    this.fpsSamples.shift()
    this.fpsSamples.push(1000 / deltaTime)
    let avg =
      this.fpsSamples.reduce((p, c) => (p += c)) / this.fpsSamples.length
    this.fpsElement.innerText = `${avg.toLocaleString(undefined, {
      maximumFractionDigits: 0,
      minimumIntegerDigits: 3,
    })} fps`
  }
}
