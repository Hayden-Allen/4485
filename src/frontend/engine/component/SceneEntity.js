import { Component } from './Component.js'
import { Vec2 } from '%util/Vec2.js'
import { Renderable } from '%graphics/Renderable.js'
import { global } from '%engine/Global.js'
import { Texture } from '%graphics/Texture.js'
import { State } from '%script/State.js'
import matter from 'matter-js'
const { Body } = matter

const VERTEX_DATA = [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1]
const INDEX_DATA = [0, 1, 2, 0, 2, 3]
class SceneEntityOptions {
  constructor({
    vertices = [...VERTEX_DATA],
    indices = [...INDEX_DATA],
    isStatic = true,
    scaleX = 1,
    scaleY = 1,
  } = {}) {
    this.vertices = vertices
    this.indices = indices
    this.isStatic = isStatic
    this.scaleX = scaleX
    this.scaleY = scaleY
  }
}

// base class for everything that exists in the scene
class SceneEntity extends Component {
  constructor(game, gameWindow, pos, options = {}) {
    super('SceneEntity')
    this.ops = new SceneEntityOptions(options)
    const vertexData = this.ops.vertices,
      indexData = this.ops.indices

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
    this.originalPos = new Vec2(pos.x, pos.y)
    this.game = game
    this.scaleX = typeof this.ops.scaleX !== 'undefined' ? this.ops.scaleX : 1
    this.scaleY = typeof this.ops.scaleY !== 'undefined' ? this.ops.scaleY : 1
    this.createPhysicsProxy(this.scaleX, this.scaleY)

    // set when added to scene (Scene.js)
    this.scene = undefined
    this.sceneZ = undefined

    this.renderable = new Renderable(
      gameWindow.gl,
      pos,
      gameWindow.shaderProgram,
      vertexData,
      indexData,
      { scaleX: this.scaleX, scaleY: this.scaleY }
    )
  }
  bindToScene(scene, z) {
    this.scene = scene
    this.sceneZ = z
  }
  createPhysicsProxy(sx, sy) {
    this.dim = new Vec2(
      sx * (this.maxX - this.minX),
      sy * (this.maxY - this.minY)
    )
    this.physicsProxy = this.game.physicsEngine.createRect(
      this.pos,
      //this.pos.plus(this.dim.scale(0.5)),
      this.dim,
      {
        isStatic: this.ops.isStatic,
        friction: 0,
      }
    )
    this.physicsProxy._owner = this
  }
  setScale(sx, sy) {
    // this.ops.scale = scale
    this.scaleX = sx
    this.scaleY = sy
    this.renderable.setScale(sx, sy)
    this.game.physicsEngine.deleteRect(this.physicsProxy)
    this.createPhysicsProxy(sx, sy)
  }
  setScaleFromEditor(sx, sy) {
    this.ops.scaleX = sx
    this.ops.scaleY = sy
    this.setScale(sx, sy)
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
      id: this.id,
      pos: this.originalPos,
      ops: this.ops,
    }
  }
  setPosition(x, y) {
    this.pos.x = x
    this.pos.y = y
    this.renderable.setTransform(this.pos)
    this.destroy()
    this.createPhysicsProxy(this.scaleX, this.scaleY)
  }
  getTexCoordX() {
    return this.renderable.vertices[6]
  }
  getTexCoordY() {
    return this.renderable.vertices[11]
  }
  setTexCoordX(tx) {
    this.renderable.vertices[6] = this.renderable.vertices[10] = tx
    this.renderable.bufferVertices()
  }
  setTexCoordY(ty) {
    this.renderable.vertices[11] = this.renderable.vertices[15] = ty
    this.renderable.bufferVertices()
  }
  setPositionFromEditor(x, y) {
    this.originalPos.x = x
    this.originalPos.y = y
    this.setPosition(x, y)
  }
}

export class StaticSceneEntity extends SceneEntity {
  constructor(game, gameWindow, pos, frameTime, urls, options = {}) {
    super(game, gameWindow, pos, options)
    this.texture = new Texture(gameWindow.gl, frameTime, urls)
  }
  getCurrentTexture() {
    return this.texture
  }
  serialize() {
    return {
      ...super.serialize(),
      texture: this.texture.serialize(),
    }
  }
  static deserialize(obj) {
    const pos = new Vec2(obj.pos.x, obj.pos.y)
    return new StaticSceneEntity(
      global.context.game,
      global.gameWindow,
      pos,
      obj.texture.frameTIme,
      obj.texture.urls,
      obj.ops
    )
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
    this.physicsCollapsed = false
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
  createPhysicsProxy(sx, sy) {
    this.dim = new Vec2(
      sx * (this.maxX - this.minX),
      sy * (this.maxY - this.minY)
    )
    this.physicsProxy = this.game.physicsEngine.createRect(this.pos, this.dim, {
      isStatic: this.ops.isStatic,
      friction: 0,
    })
    this.physicsProxy._owner = this
  }
}

export class EntityVariable {
  constructor(name, defaultValue) {
    this.name = name
    this.defaultValue = defaultValue
    this.currentValue = defaultValue
  }
  reset() {
    this.currentValue = this.defaultValue
  }
  set(v) {
    this.currentValue = v
  }
}
export class ControlledSceneEntity extends DynamicSceneEntity {
  constructor(game, gameWindow, pos, states, currentStateName, options = {}) {
    super(game, gameWindow, pos, options)
    this.states = states
    this.currentState = this.states.get(currentStateName)
    this.animationIndex = 4
    this.variables = new Map()
    this.variablesCollapsed = false
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
  static deserialize(obj) {
    const pos = new Vec2(obj.pos.x, obj.pos.y)
    let states = new Map()
    let defaultState = undefined
    obj.states.forEach((state) => {
      if (!defaultState) defaultState = state.name
      states.set(state.name, State.deserialize(state))
    })
    return new ControlledSceneEntity(
      global.context.game,
      global.gameWindow,
      pos,
      states,
      defaultState,
      obj.ops
    )
  }
}
