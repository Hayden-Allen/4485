import * as mat4 from '%glMatrix/mat4.js'
import { Texture } from './Texture.js'

let textureCache = new Map()

export class Renderable {
  constructor(gl, pos, program, vertices, indices, url, { scale = 1 } = {}) {
    this.vertexArray = undefined
    this.vertexBuffer = undefined
    this.indexBuffer = undefined
    this.init(gl, program, vertices, indices)
    this.elementCount = indices.length
    this.transform = mat4.create()
    this.scale = scale
    this.setTransform(pos)

    if (textureCache.has(url)) this.texture = textureCache.get(url)
    else {
      this.texture = new Texture(gl, url)
      textureCache.set(url, this.texture)
    }
  }
  setTransform(pos) {
    mat4.fromTranslation(this.transform, [pos.x, pos.y, 0])
    this.setScale(this.scale)
  }
  setScale(scale) {
    this.scale = scale
    this.transform[0] = this.transform[5] = this.scale
  }
  init(gl, program, vertices, indices) {
    this.vertexArray = gl.createVertexArray()
    gl.bindVertexArray(this.vertexArray)

    this.vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    // x, y
    const posLoc = program.getAttribLocation('i_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 4 * 4, 0)
    // s, t
    const texLoc = program.getAttribLocation('i_tex')
    gl.enableVertexAttribArray(texLoc)
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 4 * 4, 2 * 4)

    this.indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    )
  }
  bind(gl, shaderProgram) {
    gl.bindVertexArray(this.vertexArray)
    this.texture.bind(gl, 0)
    shaderProgram.uniform1i(gl, 'u_texture', 0)
  }
}
