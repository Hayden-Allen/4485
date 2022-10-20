import { Component } from './Component.js'
import { Vec2 } from '%util/Vec2.js'
import { Renderable } from '%graphics/Renderable.js'
import { global } from '%engine/Global.js'
import { Texture } from '%graphics/Texture.js'
import matter from 'matter-js'
const { Body } = matter

const VERTEX_DATA = [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1]
const INDEX_DATA = [0, 1, 2, 0, 2, 3]
class SceneEntityOptions {
  constructor({
    vertices = VERTEX_DATA,
    indices = INDEX_DATA,
    isStatic = true,
    scale = 1,
  } = {}) {
    this.vertices = vertices
    this.indices = indices
    this.isStatic = isStatic
    this.scale = scale
  }
}

// base class for everything that exists in the scene
class SceneEntity extends Component {
  constructor(game, gameWindow, pos, options = {}) {
    super('SceneEntity')
    this.ops = new SceneEntityOptions(options)
    const vertexData = this.ops.vertices,
      indexData = this.ops.indices

    this.renderable = new Renderable(
      gameWindow.gl,
      pos,
      gameWindow.shaderProgram,
      vertexData,
      indexData,
      { scale: this.ops.scale }
    )

    this.minX = Infinity
    this.maxX = -Infinity
    this.minY = Infinity
    this.maxY = -Infinity
    for (var i = 0; i < vertexData.length; i += 4) {
      this.minX = Math.min(this.minX, vertexData[i])
      this.maxX = Math.max(this.maxX, vertexData[i])
      this.minY = Math.min(this.minY, vertexData[i + 1])
      this.maxY = Math.max(this.maxY, vertexData[i + 1])
    }

    this.pos = pos
    this.game = game
    this.createPhysicsProxy()

    // set when added to scene (Scene.js)
    this.scene = undefined
    this.sceneZ = undefined
  }
  bindToScene(scene, z) {
    this.scene = scene
    this.sceneZ = z
  }
  createPhysicsProxy() {
    this.dim = new Vec2(this.maxX - this.minX, this.maxY - this.minY).scale(
      this.ops.scale
    )
    this.physicsProxy = this.game.physicsEngine.createRect(
      this.pos.plus(this.dim.scale(0.5)),
      this.dim,
      {
        isStatic: this.ops.isStatic,
        friction: 0,
      }
    )
    this.physicsProxy._owner = this
    // console.log(this.physicsProxy)
    /**
     * @HATODO for platformers?
     */
    // Body.setCentre(
    //   this.physicsProxy,
    //   { x: -this.dim.x / 2, y: this.dim.y / 2 },
    //   true
    // )
  }
  setScale(scale) {
    if (scale === this.ops.scale) return

    this.ops.scale = scale
    this.renderable.setScale(scale)
    this.game.physicsEngine.deleteRect(this.physicsProxy)
    this.createPhysicsProxy()
  }
  destroy() {
    this.game.physicsEngine.deleteRect(this.physicsProxy)
  }
  setMass(mass) {
    Body.setMass(this.physicsProxy, mass)
  }
  getCurrentTexture() {}
  serialize() {
    return {
      pos: this.pos,
    }
  }
  /**
   * @HATODO
   */
  deserialize(obj) {}
}

export class StaticSceneEntity extends SceneEntity {
  constructor(game, gameWindow, pos, frameTime, urls, options = {}) {
    super(game, gameWindow, pos, options)
    this.texture = new Texture(gameWindow.gl, frameTime, urls)
  }
  getCurrentTexture() {
    return this.texture
  }
}

export class DynamicSceneEntity extends SceneEntity {
  constructor(game, gameWindow, pos, options = {}) {
    super(game, gameWindow, pos, {
      isStatic: false,
      ...options,
    })
    const v = options.vel || new Vec2(0, 0)
    Body.setVelocity(this.physicsProxy, { x: v.x, y: v.y })
  }
  move() {
    // copy position from physics simulation
    const { position } = this.physicsProxy
    this.pos.x = position.x
    this.pos.y = position.y

    this.renderable.setTransform(this.pos)
  }
  applyForce(f) {
    Body.applyForce(this.physicsProxy, this.physicsProxy.position, f)
  }
  setVelocity(v) {
    // Body.setVelocity(this.physicsProxy, { x: v.x, y: v.y })
    this.setVelocityX(v.x)
    this.setVelocityY(v.y)
  }
  setVelocityX(x) {
    const px = this.physicsProxy.force.x
    this.physicsProxy.force.x =
      ((x - this.physicsProxy.velocity.x) * this.physicsProxy.mass) /
      (global.time.delta * global.time.delta)
    // console.log(px, this.physicsProxy.force.x)
    // Body.setVelocity(this.physicsProxy, {
    //   x,
    //   y: this.physicsProxy.velocity.y,
    // })
  }
  setVelocityY(y) {
    this.physicsProxy.force.y =
      (y * this.physicsProxy.mass) / (global.time.delta * global.time.delta)
    // Body.setVelocity(this.physicsProxy, {
    //   x: this.physicsProxy.velocity.x,
    //   y,
    // })
  }
}

export class ControlledSceneEntity extends DynamicSceneEntity {
  constructor(game, gameWindow, pos, states, currentStateName, options = {}) {
    super(game, gameWindow, pos, options)
    this.states = states
    this.currentState = this.states.get(currentStateName)
    this.animationIndex = 4
  }
  runScripts(event, context) {
    /**
     * @HATODO optimize this (cache actual current state, not just name)
     */
    this.currentState.run(event, { ...context, entity: this })
  }
  setState(stateName) {
    if (this.currentState.name !== stateName) {
      this.currentState = this.states.get(stateName)
      // set firstRun=true for all scripts in new state
      this.currentState.reset()
    }
  }
  getCurrentTexture() {
    return this.currentState.textures[this.animationIndex]
  }
  setAnimationIndex(i, resetFrame) {
    if (i < 0 || i > 8) {
      this.logError(`Invalid animation index ${i}`)
      return
    }
    if (this.animationIndex !== i) {
      this.animationIndex = i
      if (resetFrame) this.currentState.textures[this.animationIndex].reset()
    }
  }
  serialize() {
    return {
      ...super.serialize(),
      states: Array.from(this.states.values()).map((state) =>
        state.serialize()
      ),
    }
  }
  /**
   * @HATODO
   */
  deserialize(obj) {}
}
