import { c as create_ssr_component, d as add_attribute, o as onDestroy, v as validate_component, f as each, e as escape } from "../../../chunks/index.js";
import { V as Viewport } from "../../../chunks/Viewport.js";
import { v4 } from "uuid";
import lunr from "lunr";
import matter from "matter-js";
const Splitter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { split = void 0, minSplit = 0, maxSplit = 1, isVertical = false } = $$props;
  if ($$props.split === void 0 && $$bindings.split && split !== void 0)
    $$bindings.split(split);
  if ($$props.minSplit === void 0 && $$bindings.minSplit && minSplit !== void 0)
    $$bindings.minSplit(minSplit);
  if ($$props.maxSplit === void 0 && $$bindings.maxSplit && maxSplit !== void 0)
    $$bindings.maxSplit(maxSplit);
  if ($$props.isVertical === void 0 && $$bindings.isVertical && isVertical !== void 0)
    $$bindings.isVertical(isVertical);
  return `<div${add_attribute(
    "class",
    `grow-0 shrink-0 ${isVertical ? "w-full h-1 cursor-ns-resize" : "w-1 h-full cursor-ew-resize"}`,
    0
  )}></div>`;
});
class Loggable {
  constructor() {
    if (this.constructor.name === "Object" || this.constructor === Loggable)
      console.error("Loggable is an abstract class");
  }
  logMessageName() {
  }
  logMessageNameNoId() {
  }
  getLogName() {
    return this.logMessageName();
  }
  logMessageFormat(message) {
    return `${this.getLogName()}: ${message}`;
  }
  logInfo(message) {
    console.log(this.logMessageFormat(message));
  }
  logWarning(message) {
    console.warn(this.logMessageFormat(message));
    console.trace();
  }
  logError(message) {
    console.error(this.logMessageFormat(message));
    console.trace();
  }
}
class System extends Loggable {
  constructor(name) {
    super();
    this.name = name;
    this.components = /* @__PURE__ */ new Map();
  }
  addComponent(component) {
    this.components.set(component.id, component);
  }
  removeComponent(component) {
    this.components.delete(component.id);
  }
  update(deltaTime) {
    this.preUpdate(deltaTime);
    this.components.forEach(
      (component) => this.innerUpdate(deltaTime, component)
    );
    this.postUpdate(deltaTime);
  }
  logMessageName() {
    return `[${this.name}]`;
  }
  logMessageNameNoId() {
    return this.logMessageName();
  }
  preUpdate(deltaTime) {
  }
  innerUpdate(deltaTime, component) {
    this.logError(
      "System.innerUpdate must be overriden by each subclass of System"
    );
  }
  postUpdate(deltaTime) {
  }
}
class SceneManager extends System {
  constructor() {
    super("SceneManager");
  }
  innerUpdate(deltaTime, scene) {
    const deltaTimeSeconds = deltaTime / 1e3;
    scene.controlledComponents.forEach(
      (component) => component.runScripts("OnTick", { camera: scene.camera })
    );
    scene.layers.forEach((layer) => layer.update(deltaTimeSeconds));
  }
}
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  equals(other) {
    return Math.abs(this.x - other.x) <= global.epsilon && Math.abs(this.y - other.y) <= global.epsilon;
  }
  plus(other) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
  minus(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }
  scale(s) {
    return new Vec2(this.x * s, this.y * s);
  }
  plusEqual(other) {
    this.x += other.x;
    this.y += other.y;
  }
  minusEqual(other) {
    this.x -= other.x;
    this.y -= other.y;
  }
  scaleEqual(s) {
    this.x *= s;
    this.y *= s;
  }
  negative() {
    return new Vec2(-this.x, -this.y);
  }
  perpendicular() {
    return new Vec2(-this.y, this.x);
  }
  lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }
  magnitude() {
    return Math.sqrt(this.lengthSquared());
  }
  norm() {
    const magnitude = this.magnitude();
    if (magnitude == 0)
      return new Vec2(0, 0);
    return this.scale(1 / magnitude);
  }
  normalize() {
    this.scaleEqual(1 / this.magnitude());
    return this;
  }
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }
}
const { Engine, Bodies, Body: Body$1, Composite, Events, Runner } = matter;
class PhysicsEngine {
  constructor(game, gravityScale) {
    this.game = game;
    this.engine = Engine.create();
    this.engine.gravity.scale *= gravityScale;
    Events.on(this.engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const normalB = new Vec2(
          pair.collision.normal.x,
          -pair.collision.normal.y
        );
        const normalA = normalB.scale(-1);
        if (pair.bodyA._owner.states)
          pair.bodyA._owner.runScripts("OnCollide", {
            camera: game.currentScene.camera,
            data: [normalA, pair.bodyB._owner]
          });
        if (pair.bodyB._owner.states)
          pair.bodyB._owner.runScripts("OnCollide", {
            camera: game.currentScene.camera,
            data: [normalB, pair.bodyA._owner]
          });
      });
    });
  }
  update(deltaTime, deltaCorrection) {
    Engine.update(this.engine, deltaTime, deltaCorrection);
  }
  createRect(pos, dim, options = {}) {
    options.inertia = Infinity;
    let rect = Bodies.rectangle(pos.x, pos.y, dim.x, dim.y, options);
    Composite.add(this.engine.world, rect);
    return rect;
  }
  deleteRect(rect) {
    Composite.remove(this.engine.world, rect);
  }
}
class Component extends Loggable {
  constructor(debugName) {
    super();
    this.debugName = debugName;
    this.id = v4();
  }
  isSameComponent(other) {
    return this.id === other.id;
  }
  logMessageName() {
    return `{${this.debugName}@${this.id}}`;
  }
  logMessageNameNoId() {
    return `{${this.debugName}}`;
  }
}
let ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
function create$1() {
  let out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
class Renderable {
  constructor(gl, pos, program, vertices, indices, { scale = 1 } = {}) {
    this.vertexArray = void 0;
    this.vertexBuffer = void 0;
    this.indexBuffer = void 0;
    this.init(gl, program, vertices, indices);
    this.elementCount = indices.length;
    this.transform = create$1();
    this.scale = scale;
    this.setTransform(pos);
  }
  setTransform(pos) {
    fromTranslation(this.transform, [pos.x, pos.y, 0]);
    this.setScale(this.scale);
  }
  setScale(scale) {
    this.scale = scale;
    this.transform[0] = this.transform[5] = this.scale;
  }
  init(gl, program, vertices, indices) {
    this.vertexArray = gl.createVertexArray();
    gl.bindVertexArray(this.vertexArray);
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const posLoc = program.getAttribLocation("i_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 4 * 4, 0);
    const texLoc = program.getAttribLocation("i_tex");
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
  }
  bind(gl, shaderProgram, texture) {
    gl.bindVertexArray(this.vertexArray);
    texture.bind(gl, 0);
    shaderProgram.uniform1i(gl, "u_texture", 0);
    shaderProgram.uniform1i(gl, "u_frame", texture.frame);
  }
  draw(gl, shaderProgram, texture) {
    this.bind(gl, shaderProgram, texture);
    gl.drawElements(
      gl.TRIANGLES,
      this.elementCount,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}
let imageCache = /* @__PURE__ */ new Map();
class Texture {
  constructor(gl, frameTime, urls) {
    this.resizeCanvas = document.createElement("canvas");
    this.resizeCtx = this.resizeCanvas.getContext("2d");
    this.texture = gl.createTexture();
    this.frame = 0;
    this.frameCount = urls.length;
    this.frameTime = frameTime;
    this.lastSwitch = 0;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);
    this.createEmptyTexture(gl, 1, 1, 1);
    let images = [];
    let bufferData = () => {
      let maxWidth = 0, maxHeight = 0;
      images.forEach((image) => {
        maxWidth = Math.max(maxWidth, image.width);
        maxHeight = Math.max(maxHeight, image.height);
      });
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);
      this.createEmptyTexture(gl, maxWidth, maxHeight, urls.length);
      images.forEach((image, i) => {
        this.resizeCanvas.width = maxWidth;
        this.resizeCanvas.height = maxHeight;
        this.resizeCtx.clearRect(0, 0, maxWidth, maxHeight);
        this.resizeCtx.drawImage(image, 0, 0, maxWidth, maxHeight);
        gl.texSubImage3D(
          gl.TEXTURE_2D_ARRAY,
          0,
          0,
          0,
          i,
          this.resizeCanvas.width,
          this.resizeCanvas.height,
          1,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          this.resizeCanvas
        );
      });
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    let loadCount = 0;
    let tryLoad = (url, img) => {
      loadCount++;
      if (loadCount === urls.length)
        bufferData();
      if (!imageCache.has(url))
        imageCache.set(url, img);
    };
    urls.forEach((url) => {
      if (imageCache.has(url)) {
        const cachedImage = imageCache.get(url);
        images.push(cachedImage);
        tryLoad();
      } else {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => tryLoad(url, img);
        img.src = url;
        images.push(img);
      }
    });
    this.urls = urls;
  }
  createEmptyTexture(gl, w, h, d) {
    gl.texImage3D(
      gl.TEXTURE_2D_ARRAY,
      0,
      gl.RGBA,
      w,
      h,
      d,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      void 0
    );
  }
  bind(gl, slot) {
    gl.activeTexture(gl.TEXTURE0 + slot);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);
    if (!global.context.paused && this.frameCount > 1 && global.time.now - this.lastSwitch >= this.frameTime) {
      this.frame = (this.frame + 1) % this.frameCount;
      this.lastSwitch = global.time.now;
    }
  }
}
const { Body } = matter;
const VERTEX_DATA = [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1];
const INDEX_DATA = [0, 1, 2, 0, 2, 3];
class SceneEntityOptions {
  constructor({
    vertices = VERTEX_DATA,
    indices = INDEX_DATA,
    isStatic = true,
    scale = 1
  } = {}) {
    this.vertices = vertices;
    this.indices = indices;
    this.isStatic = isStatic;
    this.scale = scale;
  }
}
class SceneEntity extends Component {
  constructor(game, gameWindow, pos, options = {}) {
    super("SceneEntity");
    this.ops = new SceneEntityOptions(options);
    const vertexData = this.ops.vertices, indexData = this.ops.indices;
    this.renderable = new Renderable(
      gameWindow.gl,
      pos,
      gameWindow.shaderProgram,
      vertexData,
      indexData,
      { scale: this.ops.scale }
    );
    this.minX = Infinity;
    this.maxX = -Infinity;
    this.minY = Infinity;
    this.maxY = -Infinity;
    for (var i = 0; i < vertexData.length; i += 4) {
      this.minX = Math.min(this.minX, vertexData[i]);
      this.maxX = Math.max(this.maxX, vertexData[i]);
      this.minY = Math.min(this.minY, vertexData[i + 1]);
      this.maxY = Math.max(this.maxY, vertexData[i + 1]);
    }
    this.pos = pos;
    this.game = game;
    this.createPhysicsProxy();
    this.scene = void 0;
    this.sceneZ = void 0;
  }
  bindToScene(scene, z) {
    this.scene = scene;
    this.sceneZ = z;
  }
  createPhysicsProxy() {
    this.dim = new Vec2(this.maxX - this.minX, this.maxY - this.minY).scale(
      this.ops.scale
    );
    this.physicsProxy = this.game.physicsEngine.createRect(
      this.pos.plus(this.dim.scale(0.5)),
      this.dim,
      {
        isStatic: this.ops.isStatic,
        friction: 0
      }
    );
    this.physicsProxy._owner = this;
  }
  setScale(scale) {
    if (scale === this.ops.scale)
      return;
    this.ops.scale = scale;
    this.renderable.setScale(scale);
    this.game.physicsEngine.deleteRect(this.physicsProxy);
    this.createPhysicsProxy();
  }
  destroy() {
    this.game.physicsEngine.deleteRect(this.physicsProxy);
  }
  setMass(mass) {
    Body.setMass(this.physicsProxy, mass);
  }
  getCurrentTexture() {
  }
}
class StaticSceneEntity extends SceneEntity {
  constructor(game, gameWindow, pos, frameTime, urls, options = {}) {
    super(game, gameWindow, pos, options);
    this.texture = new Texture(gameWindow.gl, frameTime, urls);
  }
  getCurrentTexture() {
    return this.texture;
  }
}
class DynamicSceneEntity extends SceneEntity {
  constructor(game, gameWindow, pos, options = {}) {
    super(game, gameWindow, pos, {
      isStatic: false,
      ...options
    });
    const v = options.vel || new Vec2(0, 0);
    Body.setVelocity(this.physicsProxy, { x: v.x, y: v.y });
  }
  move() {
    const { position } = this.physicsProxy;
    this.pos.x = position.x;
    this.pos.y = position.y;
    this.renderable.setTransform(this.pos);
  }
  applyForce(f) {
    Body.applyForce(this.physicsProxy, this.physicsProxy.position, f);
  }
  setVelocity(v) {
    this.setVelocityX(v.x);
    this.setVelocityY(v.y);
  }
  setVelocityX(x) {
    this.physicsProxy.force.x;
    this.physicsProxy.force.x = (x - this.physicsProxy.velocity.x) * this.physicsProxy.mass / (global.time.delta * global.time.delta);
  }
  setVelocityY(y) {
    this.physicsProxy.force.y = y * this.physicsProxy.mass / (global.time.delta * global.time.delta);
  }
}
class ControlledSceneEntity extends DynamicSceneEntity {
  constructor(game, gameWindow, pos, states, currentStateName, options = {}) {
    super(game, gameWindow, pos, options);
    this.states = states;
    this.currentState = this.states.get(currentStateName);
    this.animationIndex = 4;
  }
  runScripts(event, context) {
    this.currentState.run(event, { ...context, entity: this });
  }
  setState(stateName) {
    if (this.currentState.name !== stateName) {
      this.currentState = this.states.get(stateName);
      this.currentState.reset();
    }
  }
  getCurrentTexture() {
    return this.currentState.textures[this.animationIndex];
  }
  setAnimationIndex(i) {
    if (i < 0 || i > 8) {
      this.logError(`Invalid animation index ${i}`);
      return;
    }
    this.animationIndex = i;
  }
}
class Game {
  constructor(context) {
    this.physicsEngine = new PhysicsEngine(this, -5);
    this.currentScene = void 0;
    this.sceneManager = new SceneManager();
    context.addSystem(this.sceneManager);
  }
  setCurrentScene(scene) {
    this.currentScene = scene;
    this.sceneManager.addComponent(scene);
  }
  addStaticSceneEntity(z, gameWindow, pos, frameTime, urls, options = {}) {
    this.currentScene.addStaticEntity(
      new StaticSceneEntity(this, gameWindow, pos, frameTime, urls, options),
      z
    );
  }
  addDynamicSceneEntity(z, gameWindow, pos, options = {}) {
    this.currentScene.addDynamicEntity(
      new DynamicSceneEntity(this, gameWindow, pos, options),
      z
    );
  }
  addControlledSceneEntity(z, gameWindow, pos, states, currentStateName, options = {}) {
    this.currentScene.addControlledEntity(
      new ControlledSceneEntity(
        this,
        gameWindow,
        pos,
        states,
        currentStateName,
        options
      ),
      z
    );
  }
  removeStaticSceneEntity(component) {
    this.currentScene.removeStaticEntity(component);
  }
  removeDynamicSceneEntity(component) {
    this.currentScene.removeDynamicEntity(component);
  }
  removeControlledSceneEntity(component) {
    this.currentScene.removeControlledEntity(component, component.sceneZ);
  }
  draw(window2) {
    this.drawFromPerspective(window2, this.currentScene.camera);
  }
  drawFromPerspective(window2, camera) {
    this.currentScene.layers.forEach((layer) => layer.draw(window2, camera));
  }
}
class Context {
  constructor() {
    this.systems = /* @__PURE__ */ new Map();
    this.windows = [];
    this.paused = false;
    this.game = new Game(this);
    window.addEventListener("resize", () => this.propagateResizeEvent());
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }
  propagateResizeEvent() {
    this.windows.forEach((window2) => window2.propagateResizeEvent());
  }
  run() {
    requestAnimationFrame(this.run.bind(this));
    const { deltaTime, deltaCorrection } = global.beginFrame();
    if (deltaTime > 100)
      return;
    global.varyingController.update(deltaTime);
    if (!this.paused) {
      this.systems.forEach((system) => system.update(deltaTime));
      this.game.physicsEngine.update(deltaTime, deltaCorrection);
    }
    this.windows.forEach((window2) => window2.update(deltaTime));
  }
  addSystem(system) {
    if (this.systems.has(system.name))
      console.warn(`Overwriting system '${system.name}'`);
    this.systems.set(system.name, system);
  }
  removeWindow(window2) {
    const i = this.windows.indexOf(window2);
    if (i !== -1) {
      this.windows.splice(i, 1);
    }
  }
}
class VaryingController extends System {
  constructor() {
    super("VaryingController");
  }
  innerUpdate(deltaTime, component) {
    const deltaTimeSeconds = deltaTime / 1e3;
    component.value += component.step * (component.end - component.start) * deltaTimeSeconds;
    if (component.value > component.end)
      this.clamp(component, component.end);
    if (component.value < component.start)
      this.clamp(component, component.start);
  }
  clamp(component, value) {
    if (component.reset) {
      component.value = component.start;
    } else {
      component.value = value;
      component.step *= -1;
      if (!component.repeatCount)
        this.removeComponent(component);
      if (component.repeatCount != -1)
        component.repeatCount--;
    }
  }
}
var global = {
  context: void 0,
  varyingController: void 0,
  fps: 60,
  mouseX: 0,
  mouseY: 0,
  epsilon: 1e-4,
  canvas: {
    targetWidth: 1920,
    targetHeight: 1080
  },
  time: {
    last: 0,
    now: 0,
    delta: 0,
    lastDelta: 0
  },
  init: () => {
    global.context = new Context();
    global.varyingController = new VaryingController();
    global.context.addSystem(global.varyingController);
    window.oncontextmenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.onmousemove = (e) => {
      global.mouseX = e.clientX;
      global.mouseY = e.clientY;
    };
  },
  padZeroes: (s, n) => {
    while (s.length < n)
      s = "0" + s;
    return s;
  },
  updateTime: () => {
    global.time.now = performance.now();
    global.time.lastDelta = global.time.delta;
    global.time.delta = global.time.now - global.time.last;
    global.time.last = global.time.now;
    return global.time.delta;
  },
  beginFrame: () => {
    const deltaTime = global.updateTime();
    return { deltaTime, deltaCorrection: deltaTime / global.time.lastDelta };
  },
  clamp: (x, min, max) => {
    return Math.min(max, Math.max(x, min));
  },
  rectIntersect: (x0, y0, x, y, w, h) => {
    return y0 >= y && y0 <= y + h && x0 >= x && x0 <= x + w;
  },
  colorMix: (a, b, x) => {
    const ai = parseInt(a.substring(1), 16);
    const bi = parseInt(b.substring(1), 16);
    const ra = ai >> 16, rb = bi >> 16;
    const ga = ai >> 8 & 255, gb = bi >> 8 & 255;
    const ba = ai & 255, bb = bi & 255;
    const rf = Math.floor(x * ra + (1 - x) * rb);
    const gf = Math.floor(x * ga + (1 - x) * gb);
    const bf = Math.floor(x * ba + (1 - x) * bb);
    const rfs = global.padZeroes(rf.toString(16), 2);
    const gfs = global.padZeroes(gf.toString(16), 2);
    const bfs = global.padZeroes(bf.toString(16), 2);
    return `#${rfs}${gfs}${bfs}`;
  },
  lineLength: (x1, y1, x2, y2) => {
    const dx = x1 - x2, dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  },
  keyToDisplayStr: (key) => {
    if (key === " ") {
      return "Space";
    } else {
      return key;
    }
  },
  alphabetSort: (arr) => {
    return arr.sort(
      (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
  }
};
class AnimationTemplateInfo {
  constructor(name, frameTime, urls) {
    this.name = name;
    this.frameTime = frameTime;
    this.urls = urls;
  }
}
const animationTemplateBank = [
  new AnimationTemplateInfo("Blank", 0, ["/MissingTexture.svg"]),
  ...global.alphabetSort([
    new AnimationTemplateInfo("Link", 0, [
      "https://art.pixilart.com/840bcbc293e372f.png"
    ]),
    new AnimationTemplateInfo("Item", 0, [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYrGPqKAnwSbc1AwWvieLvCe5gy2LASXWOg&usqp=CAU"
    ]),
    new AnimationTemplateInfo("Link & Item", 500, [
      "https://art.pixilart.com/840bcbc293e372f.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYrGPqKAnwSbc1AwWvieLvCe5gy2LASXWOg&usqp=CAU"
    ])
  ])
];
const animationTemplateIndex = lunr(function() {
  this.field("name");
  this.ref("id");
  animationTemplateBank.forEach((info, i) => {
    this.add({
      id: i,
      name: info.name
    });
  });
});
const Magnifying_glass = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}" fill="${"currentColor"}"><path fill-rule="${"evenodd"}" d="${"M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"}" clip-rule="${"evenodd"}"></path></svg>`;
});
const AnimationTemplatesPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let searchQuery = "";
  let candidates = [], dragItems = [];
  let selectedTemplate = void 0;
  function updateDragItems(candidates2) {
    dragItems = candidates2.map((candidate) => {
      return {
        id: v4(),
        candidate,
        _timer: Date.now(),
        _frame: 0
      };
    });
  }
  let animationFrame = void 0;
  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = void 0;
    }
  });
  {
    {
      const q = searchQuery.trim();
      if (q.length >= 3) {
        candidates = [];
        for (const result of animationTemplateIndex.search(q)) {
          candidates.push(animationTemplateBank[parseInt(result.ref)]);
        }
        if (candidates.indexOf(selectedTemplate) === -1) {
          if (candidates.length > 0) {
            selectedTemplate = candidates[0];
          } else {
            selectedTemplate = null;
          }
        }
      } else {
        candidates = [...animationTemplateBank];
        if (selectedTemplate === null) {
          selectedTemplate = candidates[0];
        }
      }
      updateDragItems(candidates);
    }
  }
  return `<div class="${"grow-1 shrink-1 w-full h-full overflow-hidden flex flex-col"}"><div class="${"grow-0 shrink-0 flex flex-row border-b border-solid border-neutral-700 h-10"}"><input placeholder="${"Search..."}" class="${"grow-1 shrink-1 p-2 pl-8 w-full min-w-0 border-0 outline-none bg-neutral-900"}"${add_attribute("value", searchQuery, 0)}>
    <div class="${"absolute w-8 h-10 flex items-center justify-center text-neutral-500 pointer-events-none"}"><div class="${"w-5 h-5"}">${validate_component(Magnifying_glass, "MagnifyingGlass").$$render($$result, {}, {}, {})}</div></div></div>

  <div class="${"grow-1 shrink-1 grid grid-flow-col auto-cols-max auto-rows-max p-4 gap-4 w-full h-full overflow-x-hidden overflow-y-auto"}">${each(dragItems, (item) => {
    return `<div class="${"flex flex-col items-center justify-center grow-0 shrink-0 px-4 py-2 hover:bg-neutral-800 focus:bg-neutral-700 transition-all rounded-md"}"><div class="${"w-16 h-16 grow-0 shrink-0 overflow-hidden flex flex-row items-center justify-center bg-neutral-800 border border-solid border-neutral-700"}"><img class="${"max-w-full max-h-full"}"${add_attribute("src", item.candidate.urls[item._frame], 0)} alt="${""}"></div>
        <div class="${"w-full overflow-hidden text-ellipsis whitespace-nowrap text-center mt-2"}">${escape(item.candidate.name)}</div>
      </div>`;
  })}</div></div>`;
});
const AssetsPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let categories = ["Prefabs", "Animations", "Sounds"];
  let selectedCategory = "Animations";
  return `<div class="${"grow-1 shrink-1 flex flex-col w-full h-full overflow-hidden"}"><div class="${"grow-0 shrink-0 flex flex-row w-full border-b border-solid border-neutral-700 overflow-x-hidden overflow-y-auto"}">${each(categories, (category) => {
    return `<button${add_attribute(
      "class",
      `grow-0 shrink-0 flex flex-row items-center p-2 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis focus:bg-neutral-700 transition-all outline-0 text-left h-12 border-r border-solid border-neutral-700 ${category === selectedCategory ? "bg-neutral-700" : "hover:bg-neutral-800"}`,
      0
    )}>${escape(category)}
      </button>`;
  })}</div>
  <div class="${"grow-1 shrink-1 w-full h-full overflow-hidden"}">${`${`${validate_component(AnimationTemplatesPanel, "AnimationTemplatesPanel").$$render($$result, {}, {}, {})}`}`}</div></div>`;
});
const BlankScript = {
  name: "BlankScript",
  nodes: [],
  edges: []
};
const TopDownMove = {
  name: "TopDownMove",
  nodes: [
    {
      type: "OnTick",
      internalValues: []
    },
    {
      type: "Subtract",
      internalValues: []
    },
    {
      type: "Subtract",
      internalValues: []
    },
    {
      type: "Vec2",
      internalValues: []
    },
    {
      type: "Normalize",
      internalValues: []
    },
    {
      type: "Mux2",
      internalValues: []
    },
    {
      type: "ScaleVec2",
      internalValues: []
    },
    {
      type: "GetControlledEntity",
      internalValues: []
    },
    {
      type: "SetEntityVelocity",
      internalValues: []
    },
    {
      type: "VarKeyPressed",
      internalValues: []
    },
    {
      type: "ExportKey",
      internalValues: ["keyRun", "Shift"]
    },
    {
      type: "ExportInt",
      internalValues: ["speedWalk", 5]
    },
    {
      type: "ExportInt",
      internalValues: ["speedRun", 10]
    },
    {
      type: "VarKeyPressed",
      internalValues: []
    },
    {
      type: "ExportKey",
      internalValues: ["keyRight", "D"]
    },
    {
      type: "VarKeyPressed",
      internalValues: []
    },
    {
      type: "ExportKey",
      internalValues: ["keyLeft", "A"]
    },
    {
      type: "VarKeyPressed",
      internalValues: []
    },
    {
      type: "ExportKey",
      internalValues: ["keyDown", "S"]
    },
    {
      type: "VarKeyPressed",
      internalValues: []
    },
    {
      type: "ExportKey",
      internalValues: ["keyUp", "W"]
    }
  ],
  edges: [
    {
      in: [],
      out: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 9
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 13
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 15
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 17
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 19
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 13,
          inputNode: 1
        },
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 15,
          inputNode: 1
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 3
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 17,
          inputNode: 2
        },
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 19,
          inputNode: 2
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 2,
          inputNode: 3
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 3
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 2,
          inputNode: 3
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 4
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 4
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 6
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 9,
          inputNode: 5
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 11,
          inputNode: 5
        },
        {
          outputIndex: 0,
          inputIndex: 2,
          outputNode: 12,
          inputNode: 5
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 5,
          inputNode: 6
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 6
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 5,
          inputNode: 6
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 6,
          inputNode: 8
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 7,
          inputNode: 8
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 7,
          inputNode: 8
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 6,
          inputNode: 8
        }
      ],
      out: []
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 10,
          inputNode: 9
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 9
        }
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 9,
          inputNode: 5
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 10,
          inputNode: 9
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 11,
          inputNode: 5
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 2,
          outputNode: 12,
          inputNode: 5
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 14,
          inputNode: 13
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 13
        }
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 13,
          inputNode: 1
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 14,
          inputNode: 13
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 16,
          inputNode: 15
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 15
        }
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 15,
          inputNode: 1
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 16,
          inputNode: 15
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 18,
          inputNode: 17
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 17
        }
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 17,
          inputNode: 2
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 18,
          inputNode: 17
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 20,
          inputNode: 19
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 19
        }
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 19,
          inputNode: 2
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 20,
          inputNode: 19
        }
      ]
    }
  ]
};
const PlatformerMove = {
  name: "PlatformerMove",
  nodes: [
    {
      type: "OnTick",
      internalValues: []
    },
    {
      type: "Subtract",
      internalValues: []
    },
    {
      type: "Mux2",
      internalValues: []
    },
    {
      type: "GetControlledEntity",
      internalValues: []
    },
    {
      type: "VarKeyPressed",
      internalValues: []
    },
    {
      type: "ExportKey",
      internalValues: ["keyRun", "Shift"]
    },
    {
      type: "ExportInt",
      internalValues: ["speedWalk", 5]
    },
    {
      type: "ExportInt",
      internalValues: ["speedRun", 10]
    },
    {
      type: "VarKeyPressed",
      internalValues: []
    },
    {
      type: "ExportKey",
      internalValues: ["keyRight", "D"]
    },
    {
      type: "VarKeyPressed",
      internalValues: []
    },
    {
      type: "ExportKey",
      internalValues: ["keyLeft", "A"]
    },
    {
      type: "SetEntityVelocityX",
      internalValues: []
    },
    {
      type: "Multiply",
      internalValues: []
    }
  ],
  edges: [
    {
      in: [],
      out: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 4
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 8
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 10
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 8,
          inputNode: 1
        },
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 10,
          inputNode: 1
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 13
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 2
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 6,
          inputNode: 2
        },
        {
          outputIndex: 0,
          inputIndex: 2,
          outputNode: 7,
          inputNode: 2
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 2,
          inputNode: 13
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 12
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 5,
          inputNode: 4
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 4
        }
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 4,
          inputNode: 2
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 5,
          inputNode: 4
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 6,
          inputNode: 2
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 2,
          outputNode: 7,
          inputNode: 2
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 9,
          inputNode: 8
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 8
        }
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 0,
          outputNode: 8,
          inputNode: 1
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 9,
          inputNode: 8
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 11,
          inputNode: 10
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 10
        }
      ],
      out: [
        {
          outputIndex: 2,
          inputIndex: 1,
          outputNode: 10,
          inputNode: 1
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 11,
          inputNode: 10
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 12
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 13,
          inputNode: 12
        }
      ],
      out: []
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 13
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 2,
          inputNode: 13
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 13,
          inputNode: 12
        }
      ]
    }
  ]
};
const PlatformerMove2 = {
  "name": "PlatformerMove2",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "Subtract",
      "internalValues": []
    },
    {
      "type": "Mux2",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyRun",
        "Shift"
      ]
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyRight",
        "D"
      ]
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "keyLeft",
        "A"
      ]
    },
    {
      "type": "Multiply",
      "internalValues": []
    },
    {
      "type": "ApplyEntityForce",
      "internalValues": []
    },
    {
      "type": "Vec2",
      "internalValues": []
    },
    {
      "type": "ConstInt",
      "internalValues": [
        0
      ]
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "speedWalk",
        0.1
      ]
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "speedRun",
        0.2
      ]
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 1
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 10
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 14,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 15,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 10
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 11
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 4
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 7,
          "inputNode": 6
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 7,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 9,
          "inputNode": 8
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 8
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 9,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 10
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 10
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 10,
          "inputNode": 12
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 11
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 12,
          "inputNode": 11
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 10,
          "inputNode": 12
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 13,
          "inputNode": 12
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 12,
          "inputNode": 11
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 13,
          "inputNode": 12
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 14,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 15,
          "inputNode": 2
        }
      ]
    }
  ]
};
const PlatformerJump = {
  name: "PlatformerJump",
  nodes: [
    {
      type: "Vec2",
      internalValues: []
    },
    {
      type: "GetControlledEntity",
      internalValues: []
    },
    {
      type: "ApplyEntityForce",
      internalValues: []
    },
    {
      type: "ConstInt",
      internalValues: [0]
    },
    {
      type: "ExportFloat",
      internalValues: ["jumpHeight", 1]
    },
    {
      type: "OnSwitch",
      internalValues: []
    },
    {
      type: "ConstVec2",
      internalValues: [0, 1]
    },
    {
      type: "OnCollide",
      internalValues: []
    },
    {
      type: "Vec2Equals",
      internalValues: []
    },
    {
      type: "GetControlledEntity",
      internalValues: []
    },
    {
      type: "ExportState",
      internalValues: ["landState", "default"]
    },
    {
      type: "SetEntityState",
      internalValues: []
    }
  ],
  edges: [
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 0
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 4,
          inputNode: 0
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 5,
          inputNode: 0
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 0,
          inputNode: 2
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 2
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 2
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 0,
          inputNode: 2
        }
      ],
      out: []
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 0
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 4,
          inputNode: 0
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 5,
          inputNode: 0
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 6,
          inputNode: 8
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 7,
          inputNode: 8
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 7,
          inputNode: 8
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 6,
          inputNode: 8
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: -1,
          outputNode: 8,
          inputNode: 11
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 9,
          inputNode: 11
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 10,
          inputNode: 11
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: -1,
          outputNode: 8,
          inputNode: 11
        },
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 9,
          inputNode: 11
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 10,
          inputNode: 11
        }
      ],
      out: []
    }
  ]
};
const ChangeStateOnKey = {
  "name": "ChangeStateOnKey",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "VarKeyPressed",
      "internalValues": []
    },
    {
      "type": "ExportKey",
      "internalValues": [
        "key",
        "A"
      ]
    },
    {
      "type": "ExportState",
      "internalValues": [
        "state",
        "default"
      ]
    },
    {
      "type": "SetEntityState",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 2
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        }
      ],
      "out": []
    }
  ]
};
const MaxSpeedX = {
  "name": "MaxSpeedX",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVelocity",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityX",
      "internalValues": []
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "maxSpeed",
        5
      ]
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "Clamp",
      "internalValues": []
    },
    {
      "type": "Negative",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 5
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 4
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 4
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 8
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 5,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 5,
          "inputNode": 7
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 8
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 7
        }
      ]
    }
  ]
};
const MaxSpeedY = {
  "name": "MaxSpeedY",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVelocity",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "maxSpeed",
        5
      ]
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "Clamp",
      "internalValues": []
    },
    {
      "type": "Negative",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityY",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 4,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 6
        },
        {
          "outputIndex": 0,
          "inputIndex": 2,
          "outputNode": 4,
          "inputNode": 6
        },
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 7
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 8
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 8
        }
      ],
      "out": []
    }
  ]
};
const MinVelocityX = {
  "name": "MinVelocityX",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVelocity",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "minVelocity",
        -5
      ]
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "Max",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityX",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 6
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 7
        }
      ],
      "out": []
    }
  ]
};
const MaxVelocityX = {
  "name": "MaxVelocityX",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVelocity",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "maxVelocity",
        5
      ]
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "Min",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityX",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 6
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 7
        }
      ],
      "out": []
    }
  ]
};
const MinVelocityY = {
  name: "MinVelocityY",
  nodes: [
    {
      type: "OnTick",
      internalValues: []
    },
    {
      type: "GetControlledEntity",
      internalValues: []
    },
    {
      type: "GetEntityVelocity",
      internalValues: []
    },
    {
      type: "GetControlledEntity",
      internalValues: []
    },
    {
      type: "ExportFloat",
      internalValues: ["minVelocity", -5]
    },
    {
      type: "Vec2Components",
      internalValues: []
    },
    {
      type: "SetEntityVelocityY",
      internalValues: []
    },
    {
      type: "Max",
      internalValues: []
    }
  ],
  edges: [
    {
      in: [],
      out: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 4
        },
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 1
        }
      ]
    },
    {
      in: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 1
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 2
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 1,
          inputNode: 2
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 2,
          inputNode: 5
        }
      ]
    },
    {
      in: [],
      out: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 6
        }
      ]
    },
    {
      in: [
        {
          outputIndex: -1,
          inputIndex: -1,
          outputNode: 0,
          inputNode: 4
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 4,
          inputNode: 7
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 2,
          inputNode: 5
        }
      ],
      out: [
        {
          outputIndex: 1,
          inputIndex: 0,
          outputNode: 5,
          inputNode: 7
        }
      ]
    },
    {
      in: [
        {
          outputIndex: 0,
          inputIndex: 0,
          outputNode: 3,
          inputNode: 6
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 7,
          inputNode: 6
        }
      ],
      out: []
    },
    {
      in: [
        {
          outputIndex: 1,
          inputIndex: 0,
          outputNode: 5,
          inputNode: 7
        },
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 4,
          inputNode: 7
        }
      ],
      out: [
        {
          outputIndex: 0,
          inputIndex: 1,
          outputNode: 7,
          inputNode: 6
        }
      ]
    }
  ]
};
const MaxVelocityY = {
  "name": "MaxVelocityY",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVelocity",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "maxVelocity",
        5
      ]
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityY",
      "internalValues": []
    },
    {
      "type": "Min",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 6
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 6
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 7
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 7,
          "inputNode": 6
        }
      ]
    }
  ]
};
const HitWall = {
  "name": "HitWall",
  "nodes": [
    {
      "type": "OnCollide",
      "internalValues": []
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "NOT",
      "internalValues": []
    },
    {
      "type": "AND",
      "internalValues": []
    },
    {
      "type": "__debug",
      "internalValues": [
        "hit"
      ]
    },
    {
      "type": "EqualsConst",
      "internalValues": [
        0
      ]
    },
    {
      "type": "EqualsConst",
      "internalValues": [
        0
      ]
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 6
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 3
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 3,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 3,
          "inputNode": 4
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 5,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 6,
          "inputNode": 3
        }
      ]
    }
  ]
};
const BounceWall = {
  "name": "BounceWall",
  "nodes": [
    {
      "type": "OnCollide",
      "internalValues": []
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "NOT",
      "internalValues": []
    },
    {
      "type": "AND",
      "internalValues": []
    },
    {
      "type": "EqualsConst",
      "internalValues": [
        0
      ]
    },
    {
      "type": "EqualsConst",
      "internalValues": [
        0
      ]
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityVelocity",
      "internalValues": []
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "Negative",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityX",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 3
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 3,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 3,
          "inputNode": 7
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 7,
          "inputNode": 8
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 7,
          "inputNode": 8
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 9
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 8,
          "inputNode": 9
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 9,
          "inputNode": 11
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 10,
          "inputNode": 11
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 9,
          "inputNode": 11
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 10,
          "inputNode": 11
        }
      ],
      "out": []
    }
  ]
};
const GoombaMove = {
  "name": "GoombaMove",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "ExportFloat",
      "internalValues": [
        "velocityX",
        3
      ]
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "SetEntityVelocityX",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 1,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 1,
          "inputNode": 3
        }
      ],
      "out": []
    }
  ]
};
const ChangeStateOnHitWall = {
  "name": "ChangeStateOnHitWall",
  "nodes": [
    {
      "type": "OnCollide",
      "internalValues": []
    },
    {
      "type": "Vec2Components",
      "internalValues": []
    },
    {
      "type": "NOT",
      "internalValues": []
    },
    {
      "type": "AND",
      "internalValues": []
    },
    {
      "type": "EqualsConst",
      "internalValues": [
        0
      ]
    },
    {
      "type": "EqualsConst",
      "internalValues": [
        0
      ]
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "SetEntityState",
      "internalValues": []
    },
    {
      "type": "ExportState",
      "internalValues": [
        "state",
        "moveLeft"
      ]
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 0,
          "inputNode": 1
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 3
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 3,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 4
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 4,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 3,
          "inputNode": 7
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 7
        }
      ],
      "out": []
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 8,
          "inputNode": 7
        }
      ]
    }
  ]
};
const CameraFollow = {
  "name": "CameraFollow",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "GetControlledEntity",
      "internalValues": []
    },
    {
      "type": "GetEntityPosition",
      "internalValues": []
    },
    {
      "type": "SetCameraPosition",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 2
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 3
        }
      ],
      "out": []
    }
  ]
};
const OnMouseScrollY = {
  "name": "OnMouseScrollY",
  "nodes": [
    {
      "type": "OnTick",
      "internalValues": []
    },
    {
      "type": "MouseScroll",
      "internalValues": []
    },
    {
      "type": "ConstVec2",
      "internalValues": [
        0,
        1
      ]
    },
    {
      "type": "Vec2Equals",
      "internalValues": []
    },
    {
      "type": "ConstVec2",
      "internalValues": [
        0,
        -1
      ]
    },
    {
      "type": "Vec2Equals",
      "internalValues": []
    },
    {
      "type": "OR",
      "internalValues": []
    },
    {
      "type": "__debug",
      "internalValues": [
        "debug"
      ]
    }
  ],
  "edges": [
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 3
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 3
        },
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 2,
          "inputNode": 3
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 1,
          "outputNode": 4,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 1,
          "inputNode": 5
        },
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 5
        }
      ],
      "out": [
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 2,
          "inputIndex": 0,
          "outputNode": 3,
          "inputNode": 6
        },
        {
          "outputIndex": 2,
          "inputIndex": 1,
          "outputNode": 5,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 7
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 7
        }
      ],
      "out": []
    }
  ]
};
const SetAnimationFromVelocityX = {
  "name": "SetAnimationFromVelocityX",
  "nodes": [
    {
      "type": "IsZero",
      "internalValues": []
    },
    {
      "type": "OnRender",
      "internalValues": []
    },
    {
      "type": "LessConst",
      "internalValues": [
        0
      ]
    },
    {
      "type": "SetControlledEntityAnimationConst",
      "internalValues": [
        4
      ]
    },
    {
      "type": "SetControlledEntityAnimationConst",
      "internalValues": [
        3
      ]
    },
    {
      "type": "SetControlledEntityAnimationConst",
      "internalValues": [
        5
      ]
    },
    {
      "type": "GetControlledEntityVelocityX",
      "internalValues": []
    }
  ],
  "edges": [
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 0
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 2
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 5
        },
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 4
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 4
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 2,
          "inputNode": 5
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 0
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 6,
          "inputNode": 2
        }
      ]
    }
  ]
};
const SetAnimationFromVelocityX2 = {
  "name": "SetAnimationFromVelocityX2",
  "nodes": [
    {
      "type": "IsZero",
      "internalValues": []
    },
    {
      "type": "OnRender",
      "internalValues": []
    },
    {
      "type": "ControlledVelX",
      "internalValues": []
    },
    {
      "type": "SetControlledAnimation#",
      "internalValues": [
        4
      ]
    },
    {
      "type": "SetControlledAnimation#",
      "internalValues": [
        3
      ]
    },
    {
      "type": "SetControlledAnimation#",
      "internalValues": [
        5
      ]
    },
    {
      "type": "Less#",
      "internalValues": [
        0
      ]
    }
  ],
  "edges": [
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 0
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        },
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [],
      "out": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 2
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": -1,
          "inputIndex": -1,
          "outputNode": 1,
          "inputNode": 2
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 0
        },
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 6
        }
      ]
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 3
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 4
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 5
        }
      ],
      "out": []
    },
    {
      "in": [
        {
          "outputIndex": 0,
          "inputIndex": 0,
          "outputNode": 2,
          "inputNode": 6
        },
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 0,
          "inputNode": 6
        }
      ],
      "out": [
        {
          "outputIndex": 0,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 4
        },
        {
          "outputIndex": 1,
          "inputIndex": -1,
          "outputNode": 6,
          "inputNode": 5
        }
      ]
    }
  ]
};
class ScriptTemplateInfo {
  constructor(description, script) {
    this.name = script.name;
    this.description = description;
    this.script = script;
  }
}
const blankScriptTemplate = new ScriptTemplateInfo(
  "Create a custom script from scratch",
  BlankScript
);
const scriptTemplateBank = global.alphabetSort([
  new ScriptTemplateInfo(
    "Changes to a new state when a key is pressed",
    ChangeStateOnKey
  ),
  new ScriptTemplateInfo("Jumps", PlatformerJump),
  new ScriptTemplateInfo("Moves your character with AD", PlatformerMove),
  new ScriptTemplateInfo("Moves your character with AD", PlatformerMove2),
  new ScriptTemplateInfo("Moves your character with WASD", TopDownMove),
  new ScriptTemplateInfo("Sets maximum x-axis speed", MaxSpeedX),
  new ScriptTemplateInfo("Sets maximum y-axis speed", MaxSpeedY),
  new ScriptTemplateInfo("Sets maximum left x-axis velocity", MinVelocityX),
  new ScriptTemplateInfo("Sets maximum right x-axis velocity", MaxVelocityX),
  new ScriptTemplateInfo("Sets maximum downward y-axis velocity", MinVelocityY),
  new ScriptTemplateInfo("Sets maximum upward y-axis velocity", MaxVelocityY),
  new ScriptTemplateInfo("Does something when a wall is hit", HitWall),
  new ScriptTemplateInfo("Bounces when a wall is hit", BounceWall),
  new ScriptTemplateInfo("Moves like a goomba", GoombaMove),
  new ScriptTemplateInfo(
    "Changes to given state when a wall is hit",
    ChangeStateOnHitWall
  ),
  new ScriptTemplateInfo("Makes the camera follow this entity", CameraFollow),
  new ScriptTemplateInfo(
    "Runs when the mouse wheel is scrolled up or down",
    OnMouseScrollY
  ),
  new ScriptTemplateInfo(
    "Sets animation based on x velocity",
    SetAnimationFromVelocityX
  ),
  new ScriptTemplateInfo(
    "Sets animation based on x velocity",
    SetAnimationFromVelocityX2
  )
]);
const scriptTemplateIndex = lunr(function() {
  this.field("name");
  this.field("description");
  this.ref("id");
  scriptTemplateBank.forEach((info, i) => {
    this.add({
      id: i,
      name: info.name,
      description: info.description
    });
  });
});
const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}" fill="${"currentColor"}"><path d="${"M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"}"></path></svg>`;
});
const ScriptTemplatesPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { onUseScript = void 0 } = $$props;
  let searchQuery = "";
  let candidates = null;
  let selectedTemplate = null, hoveredTemplate = null;
  if ($$props.onUseScript === void 0 && $$bindings.onUseScript && onUseScript !== void 0)
    $$bindings.onUseScript(onUseScript);
  {
    {
      const q = searchQuery.trim();
      if (q.length >= 3) {
        candidates = [blankScriptTemplate];
        for (const result of scriptTemplateIndex.search(q)) {
          candidates.push(scriptTemplateBank[parseInt(result.ref)]);
        }
        if (candidates.indexOf(selectedTemplate) === -1) {
          if (candidates.length > 0) {
            selectedTemplate = candidates[0];
          } else {
            selectedTemplate = null;
          }
        }
      } else {
        candidates = [blankScriptTemplate, ...scriptTemplateBank];
        if (selectedTemplate === null) {
          selectedTemplate = candidates[0];
        }
      }
    }
  }
  return `<div class="${"flex flex-col w-full h-full overflow-hidden"}"><div class="${"grow-0 shrink-0 flex flex-row border-b border-solid border-neutral-700 h-10"}"><input placeholder="${"Search..."}" class="${"grow-1 shrink-1 p-2 pl-8 w-full min-w-0 border-0 outline-none bg-neutral-900"}"${add_attribute("value", searchQuery, 0)}>
    <div class="${"absolute w-8 h-10 flex items-center justify-center text-neutral-500 pointer-events-none"}"><div class="${"w-5 h-5"}">${validate_component(Magnifying_glass, "MagnifyingGlass").$$render($$result, {}, {}, {})}</div></div></div>

  <div class="${"grow-1 shrink-1 flex flex-row w-full h-full overflow-hidden"}"><div class="${"grow-0 shrink-0 flex flex-col w-full max-w-[256px] h-full border-r border-solid border-neutral-700 overflow-x-hidden overflow-y-auto"}">${each(candidates, (template, i) => {
    return `<button${add_attribute(
      "class",
      `grow-0 shrink-0 flex flex-row items-center justify-center p-2 cursor-pointer focus:bg-neutral-700 transition-all outline-0 text-left h-12 ${template === selectedTemplate ? "bg-neutral-700" : "hover:bg-neutral-800"} ${i < candidates.length - 1 ? "border-b border-solid border-neutral-700" : ""}`,
      0
    )}><div class="${"grow-1 shrink-1 w-full overflow-hidden whitespace-nowrap text-ellipsis"}">${escape(template.name)}</div>
          ${hoveredTemplate === template ? `<button class="${"flex grow-0 shrink-0 p-1 items-center justify-center rounded-md bg-emerald-700 hover:bg-emerald-600 transition-all"}"><div class="${"w-5 h-5"}">${validate_component(Plus, "Plus").$$render($$result, {}, {}, {})}</div>
            </button>` : ``}
        </button>`;
  })}</div>
    <div class="${"grow-1 shrink-1 flex flex-col w-full h-full p-4 overflow-hidden"}">${selectedTemplate ? `<div class="${"grow-1 shrink-1 w-full font-bold text-2xl overflow-hidden whitespace-nowrap text-ellipsis"}">${escape(selectedTemplate.name)}</div>
        <div class="${"grow-1 shrink-1 w-full h-full overflow-hidden text-ellipsis mt-4"}">${escape(selectedTemplate.description)}</div>` : ``}</div></div></div>`;
});
const KeyEditor_svelte_svelte_type_style_lang$1 = "";
const StateEditor_svelte_svelte_type_style_lang$1 = "";
const BoolEditor_svelte_svelte_type_style_lang$1 = "";
const StringEditor_svelte_svelte_type_style_lang$1 = "";
const scriptDataType = {
  int: 1,
  float: 2,
  number: 2 | 1,
  array: 4,
  object: 8,
  bool: 16,
  string: 32,
  any: 255
};
function resolveScriptDataType(input) {
  switch (typeof input) {
    case "number":
      return (Number.isInteger(input) ? scriptDataType.int : 0) | scriptDataType.float;
    case "object":
      return Array.isArray(input) ? scriptDataType.array : scriptDataType.object;
    case "boolean":
      return scriptDataType.bool;
    case "string":
      return scriptDataType.string;
  }
}
function validateScriptDataTypes(input, expected) {
  if (input.length != expected.length)
    return false;
  for (var i = 0; i < expected.length; i++) {
    const type = resolveScriptDataType(input[i]);
    if (!(type & expected[i])) {
      return false;
    }
  }
  return true;
}
class ScriptDataTypeList {
  constructor(typenames = []) {
    this.types = typenames.map((name) => {
      if (name === "number")
        return scriptDataType.int | scriptDataType.float;
      return scriptDataType[name];
    });
    this.length = this.types.length;
  }
}
class ScriptNodePort {
  constructor(name, typename, editorTypename) {
    this.name = name;
    this.typename = typename;
    this.editorTypename = editorTypename || typename;
  }
}
class ScriptNodeData {
  constructor(inputPorts, internalPorts, outputPorts, fn) {
    this.inputPorts = inputPorts;
    this.internalPorts = internalPorts;
    this.outputPorts = outputPorts;
    this.fn = fn;
  }
}
class ScriptNode extends Component {
  constructor(category, templateName, graph, inputPorts, outputPorts, fn, { internalPorts = [], internalValues = [], isExport = false } = {}) {
    super(templateName);
    this.category = category;
    this.graph = graph;
    this.data = new ScriptNodeData(inputPorts, internalPorts, outputPorts, fn);
    this.inputTypes = new ScriptDataTypeList(
      inputPorts.map((port) => port.typename)
    );
    this.outputs = [];
    this.active = false;
    this.internalValues = internalValues;
    this.isExport = isExport;
    this.isSource = false;
  }
  serialize() {
    const obj = {
      type: this.debugName,
      internalValues: this.internalValues
    };
    return obj;
  }
  checkIndex(types, index) {
    if (index < -1 || index > types.length) {
      this.logError(`Invalid index ${index}`);
      return false;
    }
    return true;
  }
  checkInputIndex(index) {
    return this.checkIndex(this.inputTypes, index);
  }
  checkOutputIndex(index) {
    return this.checkIndex(this.outputTypes, index);
  }
  attachBase(inputNode, inputIndex) {
    const existing = this.graph.hasInputEdgeAt(inputNode, inputIndex);
    if (existing)
      this.graph.removeEdge(
        existing.outputNode,
        existing.outputIndex,
        existing.inputNode,
        existing.inputIndex
      );
  }
  attachAsInput(outputNode, outputIndex, inputIndex) {
    this.attachBase(this, inputIndex);
    this.graph.addEdge(outputNode, outputIndex, this, inputIndex);
  }
  attachAsOutput(outputIndex, inputNode, inputIndex) {
    this.attachBase(inputNode, inputIndex);
    this.graph.addEdge(this, outputIndex, inputNode, inputIndex);
  }
  run(inputs, context) {
    if (!validateScriptDataTypes(inputs, this.inputTypes.types)) {
      this.graph.pushError(`Invalid input to '${this.debugName}'`);
      return;
    }
    const results = this.data.fn(inputs, {
      entity: context.entity,
      scene: context.entity.scene,
      input: context.inputCache,
      camera: context.camera,
      internal: this.internalValues,
      node: this
    }) || [];
    this.outputs = results.map((result) => result.value);
    const outboundEdges = this.graph.getEdges(this).out;
    for (var i = 0; i < outboundEdges.length; i++) {
      const edge = outboundEdges[i];
      if (edge.inputIndex === -1 && edge.outputIndex === -1) {
        edge.inputNode.active = true;
      } else {
        const { active } = results[edge.outputIndex];
        if (active || !this.isSource && active === void 0) {
          edge.inputNode.active = true;
        }
        if (active === false)
          edge.inputNode.active = false;
      }
    }
  }
}
class ScriptNodeTemplate extends ScriptNodeData {
  constructor(category, name, inputPorts, outputPorts, fn, isExport = false) {
    super(inputPorts, [], outputPorts, fn);
    this.category = category;
    this.name = name;
    this.isExport = isExport;
  }
  createNode(graph) {
    return new ScriptNode(
      this.category,
      this.name,
      graph,
      this.inputPorts,
      this.outputPorts,
      this.fn,
      { isExport: this.isExport }
    );
  }
}
class EventScriptNodeTemplate extends ScriptNodeTemplate {
  constructor(category, name, outputPorts) {
    super(
      category,
      name,
      [],
      outputPorts,
      (_, { node }) => node.outputs.map((value) => {
        return { value, activate: true };
      }),
      false
    );
  }
}
class InternalScriptNodeTemplate extends ScriptNodeTemplate {
  constructor(category, name, inputPorts, internalPorts, defaultValues, outputPorts, fn, isExport = false) {
    super(category, name, inputPorts, outputPorts, fn, isExport);
    this.internalPorts = internalPorts;
    this.defaultValues = defaultValues;
    this.internalTypes = internalPorts.map(
      (port) => scriptDataType[port.typename]
    );
  }
  createNode(graph, internalValues) {
    internalValues = internalValues || [...this.defaultValues];
    if (!validateScriptDataTypes(internalValues, this.internalTypes)) {
      console.error("Invalid inputs");
      console.log(internalValues, this.internalPorts, this.internalTypes);
      return;
    }
    let node = new ScriptNode(
      this.category,
      this.name,
      graph,
      this.inputPorts,
      this.outputPorts,
      this.fn,
      {
        internalPorts: this.internalPorts,
        internalValues,
        isExport: this.isExport
      }
    );
    return node;
  }
}
class ConstantScriptNodeTemplate extends InternalScriptNodeTemplate {
  constructor(category, name, ports, defaultValues) {
    super(
      category,
      name,
      [],
      ports,
      defaultValues,
      ports,
      (_, { internal }) => internal.map((value) => ({ value, activate: false }))
    );
  }
}
class ExportNodeTemplate extends InternalScriptNodeTemplate {
  constructor(category, name, valueName, value, valueType, valueEditorType, additionalPorts, additionalValues) {
    super(
      category,
      name,
      [],
      [
        new ScriptNodePort("name", "string"),
        new ScriptNodePort(valueName, valueType, valueEditorType),
        ...additionalPorts
      ],
      ["export", value, ...additionalValues],
      [new ScriptNodePort(valueName, valueType)],
      (_, { internal }) => [{ value: internal[1] }],
      true
    );
  }
}
class ScriptNodeTemplateBank {
  constructor() {
    this.bank = /* @__PURE__ */ new Map();
    this.init();
  }
  getNodeTypeNames() {
    return [...this.bank.keys()].sort();
  }
  get(name) {
    return this.bank.get(name);
  }
  mapPorts(ports) {
    return ports.map(
      ([name, type, editorType]) => new ScriptNodePort(name, type, editorType)
    );
  }
  create(category, name, inputs, outputs, fn) {
    this.bank.set(
      name,
      new ScriptNodeTemplate(
        category,
        name,
        this.mapPorts(inputs),
        this.mapPorts(outputs),
        fn
      )
    );
  }
  createEvent(category, name, outputs) {
    this.bank.set(
      name,
      new EventScriptNodeTemplate(category, name, this.mapPorts(outputs))
    );
  }
  createInternal(category, name, inputs, internals, defaultValues, outputs, fn) {
    this.bank.set(
      name,
      new InternalScriptNodeTemplate(
        category,
        name,
        this.mapPorts(inputs),
        this.mapPorts(internals),
        defaultValues,
        this.mapPorts(outputs),
        fn
      )
    );
  }
  createConstant(category, name, ports, defaultValues) {
    this.bank.set(
      name,
      new ConstantScriptNodeTemplate(
        category,
        name,
        this.mapPorts(ports),
        defaultValues
      )
    );
  }
  createExport(category, name, valueName, value, valueType, {
    additionalPorts = [],
    additionalValues = [],
    valueEditorType = valueType
  } = {}) {
    this.bank.set(
      name,
      new ExportNodeTemplate(
        category,
        name,
        valueName,
        value,
        valueType,
        valueEditorType,
        this.mapPorts(additionalPorts),
        additionalValues
      )
    );
  }
  init() {
    this.createEntity();
    this.createEvents();
    this.createInput();
    this.createLogic();
    this.createMath();
    this.createExports();
    this.createInternal(
      "logic",
      "__debug",
      [],
      [["msg", "string"]],
      ["debug"],
      [],
      (_, { internal, entity }) => {
        entity.logInfo(internal[0]);
      }
    );
  }
  createEvents() {
    this.createEvent("event", "OnTick", []);
    this.createEvent("event", "OnRender", []);
    this.createEvent("event", "OnCollide", [
      ["normal", "object"],
      ["entity", "object"]
    ]);
    this.createEvent("event", "OnSwitch", []);
  }
  createInput() {
    this.createInternal(
      "input",
      "KeyPressed",
      [],
      [["key", "string", "key"]],
      ["A"],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      (_, { internal, input }) => {
        const pressed = input.isKeyPressed(internal[0]);
        return [
          { value: pressed, active: pressed },
          { value: !pressed, active: !pressed },
          { value: ~~pressed }
        ];
      }
    );
    this.create(
      "input",
      "VarKeyPressed",
      [["key", "string"]],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([key], { input }) => {
        const pressed = input.isKeyPressed(key);
        return [
          { value: pressed, active: pressed },
          { value: !pressed, active: !pressed },
          { value: ~~pressed }
        ];
      }
    );
    this.create(
      "input",
      "MouseScroll",
      [],
      [["v", "object"]],
      (_, { input }) => [{ value: input.mouseScroll }]
    );
  }
  createMath() {
    this.createConstant("math", "ConstInt", [["int", "int"]], [0]);
    this.createConstant("math", "ConstFloat", [["float", "float"]], [0]);
    this.create(
      "math",
      "Subtract",
      [
        ["a", "number"],
        ["b", "number"]
      ],
      [["a-b", "number"]],
      ([a, b]) => [{ value: a - b }]
    );
    this.create(
      "math",
      "Multiply",
      [
        ["a", "number"],
        ["b", "number"]
      ],
      [["a*b", "number"]],
      ([a, b]) => [{ value: a * b }]
    );
    this.create(
      "math",
      "Min",
      [
        ["a", "number"],
        ["b", "number"]
      ],
      [["min", "number"]],
      ([a, b]) => [{ value: Math.min(a, b) }]
    );
    this.create(
      "math",
      "Max",
      [
        ["a", "number"],
        ["b", "number"]
      ],
      [["max", "number"]],
      ([a, b]) => [{ value: Math.max(a, b) }]
    );
    this.create(
      "math",
      "Clamp",
      [
        ["x", "number"],
        ["min", "number"],
        ["max", "number"]
      ],
      [["clamped", "number"]],
      ([x, min, max]) => [{ value: global.clamp(x, min, max) }]
    );
    this.create(
      "math",
      "Negative",
      [["x", "number"]],
      [["-x", "number"]],
      ([x]) => [{ value: -x }]
    );
    this.create(
      "math",
      "Equals",
      [
        ["a", "number"],
        ["b", "number"]
      ],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a, b]) => {
        const equal = a == b;
        return [
          { value: equal, active: equal },
          { value: !equal, active: !equal },
          { value: ~~equal }
        ];
      }
    );
    this.createInternal(
      "math",
      "EqualsConst",
      [["a", "number"]],
      [["b", "number"]],
      [0],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a], { internal }) => {
        const equal = a == internal[0];
        return [
          { value: equal, active: equal },
          { value: !equal, active: !equal },
          { value: ~~equal }
        ];
      }
    );
    this.create(
      "math",
      "Greater",
      [
        ["a", "number"],
        ["b", "number"]
      ],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a, b]) => {
        const r = a > b;
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r }
        ];
      }
    );
    this.create(
      "math",
      "GreaterEquals",
      [
        ["a", "number"],
        ["b", "number"]
      ],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a, b]) => {
        const r = a >= b;
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r }
        ];
      }
    );
    this.create(
      "math",
      "Less",
      [
        ["a", "number"],
        ["b", "number"]
      ],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a, b]) => {
        const r = a < b;
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r }
        ];
      }
    );
    this.createInternal(
      "math",
      "LessConst",
      [["a", "number"]],
      [["b", "number"]],
      [0],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a], { internal }) => {
        const r = a < internal[0];
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r }
        ];
      }
    );
    this.createInternal(
      "math",
      "Less#",
      [["a", "number"]],
      [["b", "number"]],
      [0],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a], { internal }) => {
        const r = a < internal[0];
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r }
        ];
      }
    );
    this.create(
      "math",
      "LessEquals",
      [
        ["a", "number"],
        ["b", "number"]
      ],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a, b]) => {
        const r = a <= b;
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r }
        ];
      }
    );
    this.create(
      "math",
      "IsZero",
      [["a", "number"]],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a]) => {
        const r = Math.abs(a) <= global.epsilon;
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r }
        ];
      }
    );
    this.create(
      "math",
      "IsNonZero",
      [["a", "number"]],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a]) => {
        const r = Math.abs(a) > global.epsilon;
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r }
        ];
      }
    );
    this.create("math", "PrintVec2", [["v", "object"]], [], ([v]) => {
      console.log(v);
    });
    this.create(
      "math",
      "Vec2",
      [
        ["x", "number"],
        ["y", "number"]
      ],
      [["v", "object"]],
      ([x, y]) => {
        return [{ value: new Vec2(x, y) }];
      }
    );
    this.create(
      "math",
      "Vec2Components",
      [["v", "object"]],
      [
        ["x", "number"],
        ["y", "number"]
      ],
      ([v]) => [{ value: v.x }, { value: v.y }]
    );
    this.create(
      "math",
      "ScaleVec2",
      [
        ["v", "object"],
        ["s", "number"]
      ],
      [["v", "object"]],
      ([v, s]) => [{ value: v.scale(s) }]
    );
    this.create(
      "math",
      "ClampVec2",
      [
        ["v", "object"],
        ["min", "number"],
        ["max", "number"]
      ],
      [["v", "object"]],
      ([v, min, max]) => {
        const l2 = v.lengthSquared();
        if (l2 < min * min) {
          v.normalize().scaleEqual(min);
        } else if (l2 > max * max) {
          v.normalize().scaleEqual(max);
        }
        return [{ value: v }];
      }
    );
    this.create(
      "math",
      "Normalize",
      [["v", "object"]],
      [["n", "object"]],
      ([v]) => [{ value: v.norm() }]
    );
    this.create(
      "math",
      "Vec2Equals",
      [
        ["v1", "object"],
        ["v2", "object"]
      ],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([v1, v2]) => {
        const equal = v1.equals(v2);
        return [
          { value: equal, active: equal },
          { value: !equal, active: !equal },
          { value: ~~equal }
        ];
      }
    );
    this.createInternal(
      "math",
      "ConstVec2",
      [],
      [
        ["x", "number"],
        ["y", "number"]
      ],
      [0, 0],
      [["v", "object"]],
      (_, { internal }) => [{ value: new Vec2(internal[0], internal[1]) }]
    );
  }
  createLogic() {
    this.create(
      "logic",
      "AND",
      [
        ["a", "any"],
        ["b", "any"]
      ],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a, b]) => {
        const and = a && b;
        return [
          { value: and, active: and },
          { value: !and, active: !and },
          { value: ~~and }
        ];
      }
    );
    this.create(
      "logic",
      "OR",
      [
        ["a", "any"],
        ["b", "any"]
      ],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a, b]) => {
        const or = a || b;
        return [
          { value: or, active: or },
          { value: !or, active: !or },
          { value: ~~or }
        ];
      }
    );
    this.create(
      "logic",
      "XOR",
      [
        ["a", "any"],
        ["b", "any"]
      ],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a, b]) => {
        const xor = a ^ b;
        return [
          { value: xor, active: xor },
          { value: !xor, active: !xor },
          { value: ~~xor }
        ];
      }
    );
    this.create(
      "logic",
      "NOT",
      [["a", "any"]],
      [
        ["T", "bool"],
        ["F", "bool"],
        ["int", "int"]
      ],
      ([a]) => {
        const not = !a;
        return [
          { value: not, active: not },
          { value: !not, active: !not },
          { value: ~~not }
        ];
      }
    );
    this.create(
      "logic",
      "Mux2",
      [
        ["index", "int"],
        ["0", "any"],
        ["1", "any"]
      ],
      [["out", "any"]],
      ([index, a0, a1]) => [{ value: index ? a1 : a0 }]
    );
  }
  createEntity() {
    this.create(
      "entity",
      "GetControlledEntity",
      [],
      [["entity", "object"]],
      (_, { entity }) => [{ value: entity }]
    );
    this.create(
      "entity",
      "SetEntityVelocity",
      [
        ["entity", "object"],
        ["v", "object"]
      ],
      [],
      ([entity, v]) => {
        if (entity.setVelocity) {
          entity.setVelocity(v);
        }
      }
    );
    this.create(
      "entity",
      "SetEntityVelocityX",
      [
        ["entity", "object"],
        ["x", "number"]
      ],
      [],
      ([entity, x]) => {
        if (entity.setVelocity) {
          entity.setVelocityX(x);
        }
      }
    );
    this.create(
      "entity",
      "SetEntityVelocityY",
      [
        ["entity", "object"],
        ["y", "number"]
      ],
      [],
      ([entity, y]) => {
        if (entity.setVelocity) {
          entity.setVelocityY(y);
        }
      }
    );
    this.create(
      "entity",
      "ApplyEntityForce",
      [
        ["entity", "object"],
        ["force", "object"]
      ],
      [],
      ([entity, force]) => {
        entity.applyForce(force);
      }
    );
    this.create(
      "entity",
      "GetEntityVelocity",
      [["entity", "object"]],
      [["v", "object"]],
      ([entity]) => {
        const { x, y } = entity.getVelocity();
        return [{ value: new Vec2(x, y) }];
      }
    );
    this.create(
      "entity",
      "GetEntityVelocityX",
      [["entity", "object"]],
      [["x", "number"]],
      ([entity]) => [{ value: entity.physicsProxy.velocity.x }]
    );
    this.create(
      "entity",
      "GetControlledEntityVelocityX",
      [],
      [["x", "number"]],
      (_, { entity }) => [{ value: entity.physicsProxy.velocity.x }]
    );
    this.create(
      "entity",
      "ControlledVelX",
      [],
      [["x", "number"]],
      (_, { entity }) => [{ value: entity.physicsProxy.velocity.x }]
    );
    this.create(
      "entity",
      "GetEntityVelocityY",
      [["entity", "object"]],
      [["y", "number"]],
      ([entity]) => [{ value: entity.physicsProxy.velocity.y }]
    );
    this.create(
      "entity",
      "GetEntityVelocityXY",
      [["entity", "object"]],
      [
        ["x", "number"],
        ["y", "number"]
      ],
      ([entity]) => {
        const { x, y } = entity.getVelocity();
        console.log(x, y);
        return [{ value: x }, { value: y }];
      }
    );
    this.create(
      "entity",
      "SetEntityScale",
      [
        ["entity", "object"],
        ["scale", "number"]
      ],
      [],
      ([entity, s]) => {
        entity.setScale(s);
      }
    );
    this.create(
      "entity",
      "SetEntityState",
      [
        ["entity", "object"],
        ["state", "string"]
      ],
      [],
      ([entity, state]) => {
        entity.setState(state);
      }
    );
    this.create(
      "entity",
      "DestroyEntity",
      [["entity", "object"]],
      [],
      ([entity], { scene }) => {
        scene.removeControlledEntity(entity);
      }
    );
    this.create(
      "entity",
      "GetEntityPosition",
      [["entity", "object"]],
      [["pos", "object"]],
      ([entity]) => [{ value: entity.pos }]
    );
    this.create(
      "entity",
      "SetCameraPosition",
      [["pos", "object"]],
      [],
      ([pos], { camera }) => {
        camera.setPosition(pos);
      }
    );
    this.create(
      "entity",
      "SetCameraZoom",
      [["zoom", "number"]],
      [],
      ([zoom], { camera }) => {
        camera.setZoom(zoom);
      }
    );
    this.create(
      "entity",
      "SetEntityAnimation",
      [
        ["entity", "object"],
        ["index", "int"]
      ],
      [],
      ([entity, index]) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(index);
        }
      }
    );
    this.createInternal(
      "entity",
      "SetEntityAnimationConst",
      [["entity", "object"]],
      [["index", "int"]],
      [4],
      [],
      ([entity], { internal }) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(internal[0]);
        }
      }
    );
    this.create(
      "entity",
      "SetControlledEntityAnimation",
      [["index", "int"]],
      [],
      ([index], { entity }) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(index);
        }
      }
    );
    this.createInternal(
      "entity",
      "SetControlledEntityAnimationConst",
      [],
      [["index", "int"]],
      [4],
      [],
      (_, { entity, internal }) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(internal[0]);
        }
      }
    );
    this.createInternal(
      "entity",
      "SetControlledAnimation#",
      [],
      [["index", "int"]],
      [4],
      [],
      (_, { entity, internal }) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(internal[0]);
        }
      }
    );
  }
  createExports() {
    this.createExport("math", "ExportInt", "value", 0, "int");
    this.createExport("math", "ExportIntRange", "value", 0, "int", {
      additionalPorts: [
        ["min", "int"],
        ["max", "int"]
      ],
      additionalValues: [0, 10]
    });
    this.createExport("math", "ExportFloat", "value", 0, "float");
    this.createExport("input", "ExportKey", "key", "A", "string", {
      valueEditorType: "key"
    });
    this.createExport("entity", "ExportState", "state", "---", "string", {
      valueEditorType: "state"
    });
  }
}
const scriptNodeTemplateBank = new ScriptNodeTemplateBank();
const KeyEditor_svelte_svelte_type_style_lang = "";
const IntEditor_svelte_svelte_type_style_lang = "";
const BoolEditor_svelte_svelte_type_style_lang = "";
const FloatEditor_svelte_svelte_type_style_lang = "";
const StateEditor_svelte_svelte_type_style_lang = "";
const StringEditor_svelte_svelte_type_style_lang = "";
function create() {
  let out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}
(function() {
  let vec = create();
  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if (!stride) {
      stride = 4;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }
    return a;
  };
})();
class ScriptEdge {
  constructor(outputNode, outputIndex, inputNode, inputIndex) {
    this.id = v4();
    this.outputNode = outputNode;
    this.outputIndex = outputIndex;
    this.inputNode = inputNode;
    this.inputIndex = inputIndex;
  }
  serialize(nodeIndex) {
    const obj = {
      outputIndex: this.outputIndex,
      inputIndex: this.inputIndex,
      outputNode: nodeIndex.get(this.outputNode.id),
      inputNode: nodeIndex.get(this.inputNode.id)
    };
    return obj;
  }
}
class ScriptNodeEdgeList {
  constructor() {
    this.in = [];
    this.out = [];
  }
  serialize(nodeIndex) {
    let inbound = this.in.map((edge) => edge.serialize(nodeIndex));
    let outbound = this.out.map((edge) => edge.serialize(nodeIndex));
    return { in: inbound, out: outbound };
  }
}
const EVENT_NODE_NAMES = /* @__PURE__ */ new Set();
EVENT_NODE_NAMES.add("OnTick");
EVENT_NODE_NAMES.add("OnPostTick");
EVENT_NODE_NAMES.add("OnCollide");
EVENT_NODE_NAMES.add("OnSwitch");
EVENT_NODE_NAMES.add("OnRender");
class ExportNodeProxy {
  constructor(node) {
    this.node = node;
    this.name = node.internalValues[0];
    this.value = node.internalValues[1];
    this.valueType = node.data.internalPorts[1].typename;
    this.editorType = node.data.internalPorts[1].editorTypename;
  }
  setName(name) {
    this.name = name;
    this.node.internalValues[0] = name;
  }
  setValue(value) {
    this.value = value;
    this.node.internalValues[1] = value;
  }
}
class ScriptGraph extends Component {
  constructor(name, inputCache, pushErrorCallback, clearErrorsCallback) {
    super(name);
    this.inputCache = inputCache;
    this.pushErrorCallback = pushErrorCallback;
    this.clearErrorsCallback = clearErrorsCallback;
    this.collapsed = false;
    this.firstRun = true;
    this.reset();
  }
  isEmpty() {
    return !this.nodes.size;
  }
  reset() {
    this.nodes = /* @__PURE__ */ new Map();
    this.eventNodes = /* @__PURE__ */ new Map();
    this.sourceNodes = [];
    this.exportNodes = [];
    this.edges = /* @__PURE__ */ new Map();
    this.cachedCompile = void 0;
    this.canErr = true;
    this.firstRun = true;
  }
  serialize() {
    let nodes = [];
    let nodeIndex = /* @__PURE__ */ new Map();
    this.nodes.forEach((node) => {
      nodeIndex.set(node.id, nodes.length);
      nodes.push(node.serialize());
    });
    let edges = [];
    this.edges.forEach((edgeList) => edges.push(edgeList.serialize(nodeIndex)));
    const obj = {
      name: this.debugName,
      nodes,
      edges
    };
    return obj;
  }
  deserialize(obj) {
    obj = JSON.parse(JSON.stringify(obj));
    this.reset();
    this.debugName = obj.name;
    let nodeIndex = /* @__PURE__ */ new Map();
    for (const node of obj.nodes) {
      const newNode = this.createNode(node.type, node.internalValues);
      this.nodes.set(newNode.id, newNode);
      nodeIndex.set(nodeIndex.size, newNode);
    }
    for (var i = 0; i < obj.edges.length; i++) {
      const edgeList = obj.edges[i];
      const node = nodeIndex.get(i);
      let list = this.edges.get(node.id);
      for (const edge of edgeList.in)
        list.in.push(
          new ScriptEdge(
            nodeIndex.get(edge.outputNode),
            edge.outputIndex,
            nodeIndex.get(edge.inputNode),
            edge.inputIndex
          )
        );
      for (const edge of edgeList.out)
        list.out.push(
          new ScriptEdge(
            nodeIndex.get(edge.outputNode),
            edge.outputIndex,
            nodeIndex.get(edge.inputNode),
            edge.inputIndex
          )
        );
      this.edges.set(node.id, list);
    }
    this.compile();
  }
  pushError(string) {
    if (this.canErr) {
      this.pushErrorCallback({
        level: "error",
        message: string
      });
    }
  }
  pushWarning(string) {
    if (this.canErr) {
      this.pushErrorCallback({
        level: "warning",
        message: string
      });
    }
  }
  createNode(name, internalValues) {
    this.cachedCompile = void 0;
    const node = scriptNodeTemplateBank.get(name).createNode(this, internalValues);
    this.nodes.set(node.id, node);
    this.edges.set(node.id, new ScriptNodeEdgeList());
    return node;
  }
  removeNode(node) {
    this.cachedCompile = void 0;
    this.getEdges(node).in.forEach((edge) => {
      this.removeEdge(
        edge.outputNode,
        edge.outputIndex,
        edge.inputNode,
        edge.inputIndex
      );
    });
    this.getEdges(node).out.forEach((edge) => {
      this.removeEdge(
        edge.outputNode,
        edge.outputIndex,
        edge.inputNode,
        edge.inputIndex
      );
    });
    this.nodes.delete(node.id);
    this.edges.delete(node.id);
  }
  addEdge(outputNode, outputIndex, inputNode, inputIndex) {
    this.cachedCompile = void 0;
    const edge = new ScriptEdge(outputNode, outputIndex, inputNode, inputIndex);
    this.edges.get(outputNode.id).out.push(edge);
    this.edges.get(inputNode.id).in.push(edge);
  }
  removeEdge(outputNode, outputIndex, inputNode, inputIndex) {
    this.getEdges(outputNode).out = this.getEdges(outputNode).out.filter(
      (edge) => !(edge.inputNode === inputNode && edge.inputIndex === inputIndex && edge.outputNode === outputNode && edge.outputIndex === outputIndex)
    );
    this.getEdges(inputNode).in = this.getEdges(inputNode).in.filter(
      (edge) => !(edge.inputNode === inputNode && edge.inputIndex === inputIndex && edge.outputNode === outputNode && edge.outputIndex === outputIndex)
    );
  }
  getEdges(node) {
    return this.edges.get(node.id);
  }
  hasEdges(node) {
    if (!this.edges.has(node.id))
      return false;
    const edges = this.getEdges(node);
    return edges.in.length || edges.out.length;
  }
  hasInputEdgeAt(node, inputIndex) {
    const edges = this.getEdges(node).in;
    for (var i = 0; i < edges.length; i++)
      if (edges[i].inputIndex === inputIndex)
        return edges[i];
    return false;
  }
  hasOutputEdgeAt(node, outputIndex) {
    const edges = this.getEdges(node).out;
    for (var i = 0; i < edges.length; i++)
      if (edges[i].outputIndex === outputIndex)
        return edges[i];
    return false;
  }
  forceCompile() {
    this.cachedCompile = void 0;
    return this.compile();
  }
  compile() {
    if (this.cachedCompile)
      return this.cachedCompile;
    this.clearErrorsCallback(this.isEmpty());
    this.canErr = true;
    this.eventNodes = /* @__PURE__ */ new Map();
    this.sourceNodes = [];
    this.exportNodes = [];
    let buildNodes = [];
    this.nodes.forEach((node) => {
      if (EVENT_NODE_NAMES.has(node.debugName)) {
        this.eventNodes.set(node.debugName, node);
        buildNodes.push(node);
      } else if (!this.getEdges(node).in.length) {
        node.isSource = true;
        this.sourceNodes.push(node);
        buildNodes.push(node);
      } else {
        node.isSource = false;
      }
      if (node.isExport)
        this.exportNodes.push(new ExportNodeProxy(node));
    });
    let visited = /* @__PURE__ */ new Map();
    let order = [];
    buildNodes.forEach((node) => this.traverse(node, visited, order));
    this.cachedCompile = order;
    return order;
  }
  traverse(node, visited, order) {
    if (visited.has(node.id)) {
      if (visited.get(node.id) === 1) {
        this.logError("Cycle detected");
      }
      return;
    }
    visited.set(node.id, 1);
    let outboundEdges = this.getEdges(node).out;
    outboundEdges.forEach(
      (edge) => this.traverse(edge.inputNode, visited, order)
    );
    visited.set(node.id, 2);
    order.unshift(node);
  }
  run(eventName, context) {
    this.compile();
    if (this.firstRun) {
      this.firstRun = false;
      this.run("OnSwitch", context);
    }
    let startNode = this.eventNodes.get(eventName);
    if (!startNode)
      return;
    this.nodes.forEach((node) => node.active = false);
    startNode.active = true;
    startNode.outputs = context.data || [];
    this.sourceNodes.forEach((node) => node.active = true);
    this.cachedCompile.forEach((node) => {
      if (!node.active)
        return;
      let inputs = [];
      const edges = this.getEdges(node);
      const inboundEdges = edges.in;
      inboundEdges.forEach((edge) => {
        if (edge.inputIndex != -1)
          inputs[edge.inputIndex] = edge.outputNode.outputs[edge.outputIndex];
      });
      node.run(inputs, { ...context, inputCache: this.inputCache });
    });
    this.canErr = false;
  }
}
const Editor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let gameCanvas = void 0, uiCanvas = void 0;
  let gameWindow = void 0, graphEditorScriptErrors = [], selectedEntity = void 0, selectedState = void 0;
  let topSplit = 1 / 2;
  let midSplit = 1 / 2;
  let bottomSplit = 1 / 2;
  let topLeftBasis = null, topRightBasis = null;
  let midTopBasis = null, midBottomBasis = null;
  let bottomLeftBasis = null, bottomRightBasis = null;
  function createEmptyScript(name) {
    return new ScriptGraph(
      name,
      gameWindow.inputCache,
      (s) => {
        graphEditorScriptErrors = [...graphEditorScriptErrors, s];
      },
      (empty) => {
        graphEditorScriptErrors = [];
      }
    );
  }
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        topLeftBasis = topSplit * 100;
        topRightBasis = (1 - topSplit) * 100;
        midTopBasis = midSplit * 100;
        midBottomBasis = (1 - midSplit) * 100;
        bottomLeftBasis = bottomSplit * 100;
        bottomRightBasis = (1 - bottomSplit) * 100;
      }
    }
    $$rendered = `<div class="${"w-full h-full flex flex-col bg-neutral-800 text-neutral-300 overflow-hidden"}"><div class="${"grow shrink basis-0 overflow-hidden flex flex-row"}"${add_attribute("style", `flex-basis: ${midTopBasis}%;`, 0)}><div class="${"grow shrink overflow-auto bg-neutral-900"}"${add_attribute("style", `flex-basis: ${topLeftBasis}%;`, 0)}>${validate_component(AssetsPanel, "AssetsPanel").$$render($$result, {}, {}, {})}</div>
    ${validate_component(Splitter, "Splitter").$$render(
      $$result,
      {
        minSplit: 0.1,
        maxSplit: 0.9,
        split: topSplit
      },
      {
        split: ($$value) => {
          topSplit = $$value;
          $$settled = false;
        }
      },
      {}
    )}
    <div class="${"relative grow shrink overflow-hidden bg-neutral-900"}"${add_attribute("style", `flex-basis: ${topRightBasis}%;`, 0)}><div class="${"absolute t-0 l-0 w-full h-full p-2"}">${validate_component(Viewport, "Viewport").$$render(
      $$result,
      {
        focusable: true,
        targetAspectRatio: global.canvas.targetWidth / global.canvas.targetHeight,
        onResize: () => global.context.propagateResizeEvent(),
        canvas: gameCanvas
      },
      {
        canvas: ($$value) => {
          gameCanvas = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>
      <div class="${"absolute t-0 l-0 w-full h-full pointer-events-none p-2"}">${validate_component(Viewport, "Viewport").$$render(
      $$result,
      {
        targetAspectRatio: global.canvas.targetWidth / global.canvas.targetHeight,
        onResize: () => global.context.propagateResizeEvent(),
        canvas: uiCanvas
      },
      {
        canvas: ($$value) => {
          uiCanvas = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>
      <div class="${"absolute t-0 l-0 w-full h-full pointer-events-none p-2"}"><p id="${"fps"}"></p></div></div></div>
  ${validate_component(Splitter, "Splitter").$$render(
      $$result,
      {
        isVertical: true,
        minSplit: 0.1,
        maxSplit: 0.9,
        split: midSplit
      },
      {
        split: ($$value) => {
          midSplit = $$value;
          $$settled = false;
        }
      },
      {}
    )}
  <div class="${"grow shrink overflow-hidden flex flex-row"}"${add_attribute("style", `flex-basis: ${midBottomBasis}%;`, 0)}><div class="${"grow shrink overflow-auto bg-neutral-900"}"${add_attribute("style", `flex-basis: ${bottomLeftBasis}%;`, 0)}>${validate_component(ScriptTemplatesPanel, "ScriptTemplatesPanel").$$render(
      $$result,
      {
        onUseScript: (info) => {
          let script = createEmptyScript("default");
          script.deserialize(info.script);
          selectedState.scripts = [...selectedState.scripts, script];
          selectedEntity.states = selectedEntity.states;
        }
      },
      {},
      {}
    )}</div>
    ${validate_component(Splitter, "Splitter").$$render(
      $$result,
      {
        minSplit: 0.1,
        maxSplit: 0.9,
        split: bottomSplit
      },
      {
        split: ($$value) => {
          bottomSplit = $$value;
          $$settled = false;
        }
      },
      {}
    )}
    <div class="${"relative grow shrink overflow-hidden bg-neutral-900"}"${add_attribute("style", `flex-basis: ${bottomRightBasis}%;`, 0)}>${`${``}`}</div></div></div>`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Editor, "Editor").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
