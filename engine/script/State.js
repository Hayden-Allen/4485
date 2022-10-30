import { Texture } from '%graphics/Texture.js'

let FALLBACK_TEXTURE = undefined

export class State {
  constructor(name, scripts, gl, animations) {
    this.name = name
    this.scripts = scripts || []
    this.textures = animations.map(
      (obj) => new Texture(gl, obj.frameTime, obj.urls)
    )
    /**
     * @HATODO move this ??
     */
    this.gl = gl
    this.animationsView = 'grid'
  }
  run(event, context, ...data) {
    this.scripts.forEach((script) => script.run(event, context, ...data))
  }
  reset() {
    this.scripts.forEach((script) => (script.firstRun = true))
  }
  setTexture(i, obj) {
    this.textures[i] = new Texture(this.gl, obj.frameTime, obj.urls)
  }
  serialize() {
    /**
     * @HATODO textures
     */
    return {
      name: this.name,
      scripts: this.scripts.map((script) => script.serialize()),
    }
  }
  /**
   * @HATODO
   */
  deserialize(obj) {}
}
