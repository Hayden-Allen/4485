import { Renderer } from '%graphics/Renderer.js'
import { Window } from './Window.js'
import { Window2D } from './Window2D.js'
import { ShaderProgram } from '%graphics/ShaderProgram.js'
import { global } from '%engine/Global.js'
import * as vec4 from '%glMatrix/vec4.js'

const VERTEX_SOURCE = `#version 300 es 
  precision highp float;
  precision highp int;
  
  layout(location = 0) in vec2 i_pos;
  layout(location = 1) in vec2 i_tex;

  uniform mat4 u_mvp;

  out vec2 v_tex;

  void main() {
    gl_Position = u_mvp * vec4(i_pos, -1, 1);
    v_tex = i_tex;
  }
`
const FRAGMENT_SOURCE = `#version 300 es
  precision highp float;
  precision highp int;
  precision highp sampler2DArray;

  uniform sampler2DArray u_texture;
  uniform int u_frame;

  in vec2 v_tex;

  out vec4 o_color;

  void main() {
    o_color = texture(u_texture, vec3(v_tex, u_frame));
  }
`

export class Window3D extends Window {
  constructor(canvas, uiCanvas, clearColor) {
    super(canvas, clearColor)
    /**
     * @HATODO move into EditorLayer
     */
    this.shaderProgram = new ShaderProgram(
      this.gl,
      VERTEX_SOURCE,
      FRAGMENT_SOURCE
    )
    // performance tracking
    this.fpsAvg = undefined
    this.fpsSamples = new Array(100).fill(0)
    this.numValidFpsSamples = 0
    // debug draw
    this.uiCanvas = new Window2D(uiCanvas, undefined, { doScaling: false })
    /**
     * @HATODO hack
     */
    global.gameWindow = this
    global.gl = this.gl
  }
  setCanvas(canvas) {
    super.setCanvas(canvas)
    if (this.gl) return
    this.gl = canvas.getContext('webgl2')
    // flip images on load
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
    this.renderer = new Renderer(this.gl, this.clearColor)
  }
  setUICanvas(uiCanvas) {
    this.uiCanvas = new Window2D(uiCanvas)
  }
  clear() {
    this.renderer.clear()
    this.uiCanvas.clear()
  }
  propagateResizeEvent() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    super.propagateResizeEvent()
  }
  drawFps() {
    if (global.isEditor && this.fpsAvg && !global.context.paused) {
      const systemFontFamily =
        '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif'
      const metrics = this.uiCanvas.textMetrics(
        Math.round(this.fpsAvg),
        systemFontFamily,
        36,
        'bold'
      )
      const x = this.canvas.width - metrics.width - 20
      const y = 20
      this.uiCanvas.drawText(
        Math.round(this.fpsAvg),
        x,
        y,
        systemFontFamily,
        36,
        'white',
        'bold'
      )
      const subMetrics = this.uiCanvas.textMetrics('FPS', systemFontFamily, 20)
      const subX = x + metrics.width * 0.5 - subMetrics.width * 0.5
      const subY =
        y +
        Math.abs(metrics.actualBoundingBoxAscent) +
        Math.abs(metrics.actualBoundingBoxDescent) +
        8
      this.uiCanvas.drawText('FPS', subX, subY, systemFontFamily, 20, 'white')
    }
  }
  draw(entity, camera) {
    this.renderer.draw(entity, camera, this.shaderProgram)
  }
  update(deltaTime) {
    super.update(deltaTime)

    this.fpsSamples.shift()
    this.fpsSamples.push(1000 / deltaTime)
    if (this.numValidFpsSamples < this.fpsSamples.length) {
      ++this.numValidFpsSamples
    } else {
      this.fpsAvg =
        this.fpsSamples.reduce((s, c) => (s += c)) / this.fpsSamples.length
    }
  }
  strokeRect(camera, x, y, w, h, color, width) {
    // world->NDC matrix
    let mvp = camera.matrix
    // position of top left corner
    let pos = vec4.fromValues(x, y, -1, 1)
    vec4.transformMat4(pos, pos, mvp)
    // NDC->pixel
    const sx = ((pos[0] + 1) / 2) * this.canvas.width,
      sy = ((1 - pos[1]) / 2) * this.canvas.height

    // dim (0 because it's a vector)
    let dim = vec4.fromValues(w, h, -1, 0)
    vec4.transformMat4(dim, dim, mvp)
    // NDC->pixel
    const sw = (dim[0] * this.canvas.width) / 2,
      sh = (dim[1] * this.canvas.height) / 2

    // console.log(sx, sy, sw, sh)
    this.uiCanvas.strokeRect(sx, sy, sw, sh, color, width)
  }
  drawRect(camera, x, y, w, h, color) {
    // world->NDC matrix
    let mvp = camera.matrix
    // position of top left corner
    let pos = vec4.fromValues(x, y, -1, 1)
    vec4.transformMat4(pos, pos, mvp)
    // NDC->pixel
    const sx = ((pos[0] + 1) / 2) * this.canvas.width,
      sy = ((1 - pos[1]) / 2) * this.canvas.height

    // dim (0 because it's a vector)
    let dim = vec4.fromValues(w, h, -1, 0)
    vec4.transformMat4(dim, dim, mvp)
    // NDC->pixel
    const sw = (dim[0] * this.canvas.width) / 2,
      sh = (dim[1] * this.canvas.height) / 2

    // console.log(sx, sy, sw, sh)
    this.uiCanvas.drawRect(sx, sy, sw, sh, color)
  }
}
