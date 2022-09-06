import * as mat4 from '%glMatrix/mat4.js'
import { Texture } from './Texture.js'

let textureCache = new Map()

export class Renderable {
  constructor(gl, vertices, indices, url) {
    this.vertexArray = undefined
    this.vertexBuffer = undefined
    this.indexBuffer = undefined
    this.init(gl, vertices, indices)
    this.elementCount = indices.length
    this.transform = mat4.create()

    if (textureCache.has(url)) this.texture = textureCache.get(url)
    else {
      this.texture = new Texture(gl, url)
      textureCache.set(url, this.texture)
    }
  }
  setTransform(vec2) {
    mat4.fromTranslation(this.transform, [vec2.x, vec2.y, -25])
  }
  init(gl, vertices, indices) {
    this.vertexArray = gl.createVertexArray()
    gl.bindVertexArray(this.vertexArray)

    /**
     * @HATODO this is hardcoded to match shaders
     */
    this.vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    // x, y
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4 * 4, 0)
    // s, t
    gl.enableVertexAttribArray(1)
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * 4, 2 * 4)

    this.indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    /**
     * @HATODO make this either non-constant or 32-bit?
     */
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
