import { Texture } from '%graphics/Texture.js'

let FALLBACK_TEXTURE = undefined

export class State {
  constructor(name, scripts, gl, animations) {
    if (!FALLBACK_TEXTURE) {
      FALLBACK_TEXTURE = new Texture(gl, 0, ['/MissingTexture.svg'])
    }
    this.name = name
    this.scripts = scripts || []
    this.textures = animations.map((obj) =>
      obj ? new Texture(gl, obj.frameTime, obj.urls) : FALLBACK_TEXTURE
    )
    /**
     * @HATODO move this ??
     */
    this.gl = gl
    this.collapsed = false
    this.animationsCollapsed = false
    this.animationsView = 'grid'
  }
  run(event, context, ...data) {
    this.scripts.forEach((script) => script.run(event, context, ...data))
  }
  reset() {
    this.scripts.forEach((script) => (script.firstRun = true))
  }
  setTexture(i, obj) {
    this.textures[i] = obj
      ? new Texture(this.gl, obj.frameTime, obj.urls)
      : FALLBACK_TEXTURE
  }
}
