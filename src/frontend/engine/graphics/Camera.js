import * as mat4 from '%glMatrix/mat4.js'

export class Camera {
  constructor(
    position,
    left,
    right,
    bottom,
    top,
    { near = 0.01, far = 1000 } = {}
  ) {
    let proj = mat4.create(),
      tran = mat4.create()
    // mat4.perspective(proj, (fovDegrees * Math.PI) / 180, aspect, near, far)
    mat4.ortho(proj, left, right, bottom, top, near, far)
    mat4.translate(tran, tran, position)

    this.matrix = mat4.create()
    mat4.mul(this.matrix, proj, tran)
  }
}
