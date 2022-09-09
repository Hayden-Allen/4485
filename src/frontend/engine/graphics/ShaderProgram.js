export class ShaderProgram {
  constructor(gl, vertsrc, fragsrc) {
    this.attribs = new Map()
    this.uniforms = new Map()
    this.program = this.initProgram(gl, vertsrc, fragsrc)
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

    const attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
    for (let i = 0; i < attribCount; ++i) {
      const info = gl.getActiveAttrib(program, i)
      this.attribs.set(info.name, gl.getAttribLocation(program, info.name))
    }

    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < uniformCount; ++i) {
      const info = gl.getActiveUniform(program, i)
      this.uniforms.set(info.name, gl.getUniformLocation(program, info.name))
    }

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
  getAttribLocation(name) {
    return this.attribs.get(name)
  }
  getUniformLocation(name) {
    return this.uniforms.get(name)
  }
  uniform1i(gl, name, i) {
    gl.uniform1i(this.getUniformLocation(name), i)
  }
  uniformMatrix4fv(gl, name, matrices, { transpose = false } = {}) {
    gl.uniformMatrix4fv(this.getUniformLocation(name), transpose, matrices)
  }
}
