import * as mat4 from '%glMatrix/mat4.js'

export class Renderable {
  constructor(
    gl,
    pos,
    program,
    vertices,
    indices,
    { scaleX = 1, scaleY = 1 } = {}
  ) {
    this.vertices = vertices
    this.vertexArray = undefined
    this.vertexBuffer = undefined
    this.indexBuffer = undefined
    this.init(gl, program, vertices, indices)
    this.elementCount = indices.length
    this.transform = mat4.create()
    this.scaleX = scaleX
    this.scaleY = scaleY
    this.setTransform(pos)
    this.gl = gl
  }
  setTransform(pos) {
    mat4.fromTranslation(this.transform, [pos.x, pos.y, 0])
    this.setScale(this.scaleX, this.scaleY)
  }
  setScale(sx, sy) {
    this.scaleX = sx
    this.scaleY = sy
    this.transform[0] = this.scaleX
    this.transform[5] = this.scaleY
  }
  bufferVertices() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      this.gl.STATIC_DRAW
    )
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
  bind(gl, shaderProgram, texture) {
    gl.bindVertexArray(this.vertexArray)
    texture.bind(gl, 0)
    shaderProgram.uniform1i(gl, 'u_texture', 0)
    shaderProgram.uniform1i(gl, 'u_frame', texture.frame)
  }
  draw(gl, shaderProgram, texture) {
    this.bind(gl, shaderProgram, texture)
    gl.drawElements(
      gl.TRIANGLES,
      this.elementCount,
      // Uint16Array
      gl.UNSIGNED_SHORT,
      0
    )
  }
}
