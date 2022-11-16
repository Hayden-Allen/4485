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
    this.left = left
    this.right = right
    this.bottom = bottom
    this.top = top
    this.near = near
    this.far = far
    this.pos = position
    this.originalPos = [...position]
    this.originalZoom = 1
    this.init(this.originalZoom)
  }
  init(zoom = 1) {
    let proj = mat4.create()
    mat4.ortho(
      proj,
      this.left / zoom,
      this.right / zoom,
      this.bottom / zoom,
      this.top / zoom,
      this.near,
      this.far
    )

    let tran = mat4.create()
    mat4.translate(tran, tran, this.pos)

    this.matrix = mat4.create()
    mat4.mul(this.matrix, proj, tran)
  }
  inverse() {
    let i = mat4.create()
    mat4.invert(i, this.matrix)
    return i
  }
  setPosition(vec2) {
    this.pos = [-vec2.x, -vec2.y, 0]
    this.init(this.originalZoom)
  }
  setPositionFromEditor(vec2) {
    this.originalPos = [-vec2.x, -vec2.y, 0]
    this.setPosition(vec2)
  }
  setZoom(z) {
    this.init(z)
  }
  setZoomFromEditor(z) {
    this.originalZoom = z
    this.setZoom(z)
  }
}
