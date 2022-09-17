export class SceneLayer {
  constructor() {
    this.static = new Map()
    this.dynamic = new Map()
  }
  // called by the [Editor|Game]Layer that contains the game that contains the scene that contains this layer
  draw(window) {
    this.static.forEach((entity) => window.draw(entity.renderable))
    this.dynamic.forEach((entity) => window.draw(entity.renderable))
  }
  update(deltaTimeSeconds) {
    this.dynamic.forEach((entity) => entity.move(deltaTimeSeconds))
  }
}
