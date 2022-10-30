import * as mat4 from 'gl-matrix/mat4'

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
  draw(entity, camera, shaderProgram) {
    /**
     * @HATODO temporary hack (until camera is moved into EditorLayer)
     */
    if (!camera) return

    let gl = this.gl

    let mvp = mat4.create()
    mat4.mul(mvp, camera.matrix, entity.renderable.transform)
    gl.useProgram(shaderProgram.program)
    shaderProgram.uniformMatrix4fv(gl, 'u_mvp', mvp)
    entity.renderable.draw(gl, shaderProgram, entity.getCurrentTexture())
  }
}
