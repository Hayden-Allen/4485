export class ShaderProgram {
  constructor(gl, vertsrc, fragsrc) {
    this.program = this.initProgram(gl, vertsrc, fragsrc)
    this.uniformCache = new Map()
  }
  initProgram(gl, vertsrc, fragsrc) {
    const vert = this.createShader(gl, gl.VERTEX_SHADER, vertsrc)
    const frag = this.createShader(gl, gl.FRAGMENT_SHADER, fragsrc)
    const program = gl.createProgram()
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.error(gl.getProgramInfoLog(program))
    gl.deleteShader(vert)
    gl.deleteShader(frag)

    return program
  }
  createShader(gl, type, src) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return undefined
    }
    return shader
  }
  getUniformLocation(gl, name) {
    if (this.uniformCache.has(name)) return this.uniformCache.get(name)
    gl.useProgram(this.program)
    const loc = gl.getUniformLocation(this.program, name)
    if (loc === -1) {
      console.error(`Uniform '${name}' does not exist`)
      return -1
    }
    this.uniformCache.set(name, loc)
    return loc
  }
  uniform1i(gl, name, i) {
    let loc = 0
    if ((loc = this.getUniformLocation(gl, name)) !== -1) gl.uniform1i(loc, i)
  }
  uniformMatrix4fv(gl, name, matrices, { transpose = false } = {}) {
    let loc = 0
    if ((loc = this.getUniformLocation(gl, name)) !== -1)
      gl.uniformMatrix4fv(loc, transpose, matrices)
  }
}
