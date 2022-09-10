import * as mat4 from '%glMatrix/mat4.js'

export class Renderer {
  constructor(gl, clearColor) {
    this.clearColor = clearColor
    this.gl = gl
    this.gl.enable(gl.BLEND)
    this.gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    this.gl.enable(gl.DEPTH_TEST)
    this.gl.depthFunc(gl.LEQUAL)
  }
  clear() {
    let gl = this.gl

    gl.clearColor(...this.clearColor)
    gl.clearDepth(1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }
  draw(renderable, camera, shaderProgram) {
    let gl = this.gl

    let mvp = mat4.create()
    mat4.mul(mvp, camera.matrix, renderable.transform)
    gl.useProgram(shaderProgram.program)
    shaderProgram.uniformMatrix4fv(gl, 'u_mvp', mvp)
    renderable.bind(gl, shaderProgram)
    gl.drawElements(
      gl.TRIANGLES,
      renderable.elementCount,
      // Uint16Array
      gl.UNSIGNED_SHORT,
      0
    )
  }
}
