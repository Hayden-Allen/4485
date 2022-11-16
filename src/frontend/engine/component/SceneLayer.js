import { global } from '%engine/Global.js'

export class SceneLayer {
  constructor() {
    this.static = new Map()
    this.dynamic = new Map()
  }
  serialize() {
    // these reference entries in the Scene's entity list
    return {
      static: Array.from(this.static.values()).map((entity) => entity.id),
      dynamic: Array.from(this.dynamic.values()).map((entity) => entity.id),
    }
  }
  /**
   * @HATODO
   */
  deserialize(obj, entities) {
    this.static = new Map()
    this.dynamic = new Map()
    obj.static.forEach((id) => this.static.set(id, entities.get(id)))
    obj.dynamic.forEach((id) => this.dynamic.set(id, entities.get(id)))
  }
  // called by the [Editor|Game]Layer that contains the game that contains the scene that contains this layer
  draw(window, camera) {
    this.static.forEach((entity) => window.draw(entity, camera))
    this.dynamic.forEach((entity) => {
      if (entity.states && global.playState === 'play')
        entity.runScripts('OnRender')
      window.draw(entity, camera)
    })
  }
  update(deltaTimeSeconds) {
    this.dynamic.forEach((entity) => entity.move(deltaTimeSeconds))
  }
}
