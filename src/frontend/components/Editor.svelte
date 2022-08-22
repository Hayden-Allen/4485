<script>
  import { onMount } from 'svelte'
  import Viewport from './Viewport.svelte'
  import { Game } from '%engine/Game.js'
  import { Scene } from '%component/Scene.js'
  import { SceneEntity, ControlledSceneEntity } from '%component/SceneEntity.js'
  import { Vec2 } from '%util/Vec2.js'
  import { global } from '%engine/Global.js'
  import { Window } from '%window/Window.js'
  import { UILayer } from '%window/Layer.js'
  import { EditorLayer } from '%engine/editor/EditorLayer.js'
  import {
    ScriptNodeTemplate,
    EventScriptNodeTemplate,
    InternalScriptNodeTemplate,
    ConstantScriptNodeTemplate,
  } from '%script/ScriptNodeTemplate.js'
  import { ScriptNodePort } from '%script/ScriptNode.js'
  import { ScriptGraph } from '%script/ScriptGraph.js'
  import { ScriptGraphVisualizer } from '%editor/ScriptGraphVisualizer.js'

  let canvas = undefined

  function createPlayerScript() {
    const tOnTick = new EventScriptNodeTemplate('OnTick')
    const tKeyPressed = new InternalScriptNodeTemplate(
      'KeyPressed',
      [],
      [new ScriptNodePort('key', 'string')],
      [
        new ScriptNodePort('T', 'bool'),
        new ScriptNodePort('F', 'bool'),
        new ScriptNodePort('int', 'int'),
      ],
      (_, { internal }) => {
        const pressed = global.input.isKeyPressed(internal[0])
        return [
          { value: pressed, active: pressed },
          { value: !pressed, active: !pressed },
          { value: ~~pressed },
        ]
      }
    )
    const tSubtract = new ScriptNodeTemplate(
      'Subtract',
      [new ScriptNodePort('a', 'number'), new ScriptNodePort('b', 'number')],
      [new ScriptNodePort('a-b', 'number')],
      ([a, b]) => [{ value: a - b }]
    )
    const tConstInt = new ConstantScriptNodeTemplate('ConstInt', [
      new ScriptNodePort('int', 'int'),
    ])
    const tMux2 = new ScriptNodeTemplate(
      'Mux2',
      [
        new ScriptNodePort('index', 'int'),
        new ScriptNodePort('0', 'any'),
        new ScriptNodePort('1', 'any'),
      ],
      [new ScriptNodePort('out', 'any')],
      ([index, a0, a1]) => [{ value: index ? a1 : a0 }]
    )
    const tScaleVec2 = new ScriptNodeTemplate(
      'ScaleVec2',
      [new ScriptNodePort('v', 'object'), new ScriptNodePort('s', 'number')],
      [new ScriptNodePort('v', 'object')],
      ([v, s]) => [{ value: v.scale(s) }]
    )
    const tGetControlledEntity = new ScriptNodeTemplate(
      'GetControlledEntity',
      [],
      [new ScriptNodePort('entity', 'object')],
      (_, { entity }) => [{ value: entity }]
    )
    const tVec2 = new ScriptNodeTemplate(
      'Vec2',
      [new ScriptNodePort('x', 'number'), new ScriptNodePort('y', 'number')],
      [new ScriptNodePort('v', 'object')],
      ([x, y]) => [{ value: new Vec2(x, y) }]
    )
    const tNormalize = new ScriptNodeTemplate(
      'Normalize',
      [new ScriptNodePort('v', 'object')],
      [new ScriptNodePort('n', 'object')],
      ([v]) => [{ value: v.norm() }]
    )
    const tSetEntityVelocity = new ScriptNodeTemplate(
      'SetEntityVelocity',
      [
        new ScriptNodePort('entity', 'object'),
        new ScriptNodePort('v', 'object'),
      ],
      [],
      ([entity, v]) => {
        entity.vel = v
      }
    )

    let graph = new ScriptGraph('PlayerController')
    const onTick = tOnTick.createNode(graph)
    // get input
    const keyWPressed = tKeyPressed.createNode(graph, ['w'])
    keyWPressed.attachAsInput(onTick, -1, -1)
    const keyAPressed = tKeyPressed.createNode(graph, ['a'])
    keyAPressed.attachAsInput(onTick, -1, -1)
    const keySPressed = tKeyPressed.createNode(graph, ['s'])
    keySPressed.attachAsInput(onTick, -1, -1)
    const keyDPressed = tKeyPressed.createNode(graph, ['d'])
    keyDPressed.attachAsInput(onTick, -1, -1)
    const keyShiftPressed = tKeyPressed.createNode(graph, ['shift'])
    keyShiftPressed.attachAsInput(onTick, -1, -1)

    // compute normalized velocity vector
    const dx = tSubtract.createNode(graph)
    dx.attachAsInput(keyDPressed, 2, 0)
    dx.attachAsInput(keyAPressed, 2, 1)
    const dy = tSubtract.createNode(graph)
    dy.attachAsInput(keySPressed, 2, 0)
    dy.attachAsInput(keyWPressed, 2, 1)
    const vec2 = tVec2.createNode(graph)
    vec2.attachAsInput(dx, 0, 0)
    vec2.attachAsInput(dy, 0, 1)
    const norm = tNormalize.createNode(graph)
    norm.attachAsInput(vec2, 0, 0)

    // boost if shift pressed
    const ci1 = tConstInt.createNode(graph, [500])
    const ci2 = tConstInt.createNode(graph, [1000])
    const mux = tMux2.createNode(graph)
    mux.attachAsInput(keyShiftPressed, 2, 0)
    mux.attachAsInput(ci1, 0, 1)
    mux.attachAsInput(ci2, 0, 2)
    const scale = tScaleVec2.createNode(graph)
    scale.attachAsInput(norm, 0, 0)
    scale.attachAsInput(mux, 0, 1)

    // set velocity
    const entity = tGetControlledEntity.createNode(graph)
    const setVel = tSetEntityVelocity.createNode(graph)
    setVel.attachAsInput(entity, 0, 0)
    setVel.attachAsInput(scale, 0, 1)

    return graph
  }

  onMount(() => {
    global.init()
    let playerScript = createPlayerScript()
    const gv = new ScriptGraphVisualizer(playerScript)
    console.log(gv.arrangeX())

    var game = new Game()

    var scene = new Scene()
    game.setCurrentScene(scene)
    const size = 10
    for (var y = 0; y < 500; y += size) {
      for (var x = 0; x < 500; x += size) {
        const red = parseInt((((x + y) * (x + y)) / 1000000) * 255)
        const color = `#${global.padZeroes(red.toString(16), 2)}0000`
        // create grid at z-index 0
        game.addStaticSceneEntity(
          new SceneEntity(
            new Vec2(x + 100, y + 100),
            new Vec2(size, size),
            color
          ),
          0
        )
      }
    }
    let playerController = {
      run: (player, deltaTimeSeconds) => {
        playerScript.run(player)
      },
    }
    let player = new ControlledSceneEntity(
      new Vec2(1000, 100),
      new Vec2(50, 50),
      '#0f0',
      { controllers: [playerController] }
    )
    // add player at z-index 1
    game.addControlledSceneEntity(player, 1)

    console.log(canvas)
    var window = new Window(canvas, '#00f')
    window.pushLayer(new EditorLayer(game))
    window.pushLayer(new UILayer())
    window.run()
  })
</script>

<div
  class="w-full h-full p-1 flex flex-col space-y-1 bg-gray-900 overflow-hidden"
>
  <div class="grow shrink basis-0 overflow-hidden flex flex-row space-x-1">
    <div
      class="grow shrink basis-0 p-2 overflow-hidden bg-gray-800 border-solid border border-gray-700"
    >
      <Viewport bind:canvas />
    </div>
    <div
      class="grow shrink basis-0 overflow-auto bg-gray-800 border-solid border border-gray-700"
    />
  </div>
  <div class="grow shrink basis-0 overflow-hidden flex flex-row space-x-1">
    <div
      class="grow shrink basis-0 overflow-auto bg-gray-800 border-solid border border-gray-700"
    />
    <div
      class="grow shrink basis-0 overflow-auto bg-gray-800 border-solid border border-gray-700"
    />
    <div
      class="grow shrink basis-0 overflow-auto bg-gray-800 border-solid border border-gray-700"
    />
  </div>
</div>
