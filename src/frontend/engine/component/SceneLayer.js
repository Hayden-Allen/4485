export class SceneLayer {
  constructor() {
    this.static = new Map()
    this.dynamic = new Map()
  }
  // called by the [Editor|Game]Layer that contains the game that contains the scene that contains this layer
  draw(window, camera) {
    this.static.forEach((entity) => window.draw(entity, camera))
    this.dynamic.forEach((entity) => {
      if (entity.states) entity.runScripts('OnRender')
      window.draw(entity, camera)
    })
  }
  update(deltaTimeSeconds) {
    this.dynamic.forEach((entity) => entity.move(deltaTimeSeconds))
  }
}
