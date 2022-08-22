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
    ConstantScriptNodeTemplate,
  } from '%script/ScriptNodeTemplate.js'
  import { ScriptGraph } from '%script/ScriptGraph.js'

  let framebuffer = undefined

  function createPlayerScript() {
    {
      // const trun = new ScriptNodeTemplate('run', [], [], () => [
      //   { activate: true },
      // ])
      // // const tmux2 = new ScriptNodeTemplate(
      // //   'mux2',
      // //   ['int', 'any', 'any'],
      // //   ['any'],
      // //   ([index, x0, x1]) => [{ value: (index ? x1 : x0) }]
      // // )
      // const tbranch = new ScriptNodeTemplate(
      //   'branch',
      //   ['bool'],
      //   ['bool', 'bool', 'int'],
      //   ([b]) => [
      //     { value: b, activate: b },
      //     { value: !b, activate: !b },
      //     { value: ~~b, activate: true },
      //   ]
      // )
      // const tmul = new ScriptNodeTemplate(
      //   'mul',
      //   ['number', 'number'],
      //   ['number'],
      //   ([a, b]) => [{ value: a * b }]
      // )
      // const tcf = new ConstantScriptNodeTemplate('cf', ['float'])
      // const tcb = new ConstantScriptNodeTemplate('cb', ['bool'])
      // let graph = new ScriptGraph('graph')
      // let run = trun.createNode(graph)
      // let mulA = tmul.createNode(graph)
      // let mulB = tmul.createNode(graph)
      // let cf2 = tcf.createNode(graph, [2])
      // let cf3 = tcf.createNode(graph, [3])
      // let cf4 = tcf.createNode(graph, [4])
      // let branch = tbranch.createNode(graph)
      // let cb = tcb.createNode(graph, [false])
      // // run.attachAsOutput(-1, mulA, -1)
      // // mulA.attachAsInput(cf2, 0, 0)
      // // mulA.attachAsInput(cf3, 0, 1)
      // // mulB.attachAsInput(mulA, 0, 0)
      // // mulB.attachAsInput(cf4, 0, 1)
      // run.attachAsOutput(-1, branch, -1)
      // // 2 * 3
      // cf2.attachAsOutput(0, mulA, 0)
      // cf3.attachAsOutput(0, mulA, 1)
      // // 3 * 4
      // cf3.attachAsOutput(0, mulB, 0)
      // cf4.attachAsOutput(0, mulB, 1)
      // // cb ? 2 * 3 : 3 * 4
      // cb.attachAsOutput(0, branch, 0)
      // branch.attachAsOutput(0, mulA, -1)
      // branch.attachAsOutput(1, mulB, -1)
    }

    const tOnTick = new EventScriptNodeTemplate('OnTick')
    const tKey = new ConstantScriptNodeTemplate('Key', ['string'])
    const tKeyPressed = new ScriptNodeTemplate(
      'KeyPressed',
      ['string'],
      ['bool', 'bool', 'int'],
      ([key]) => {
        const pressed = global.input.isKeyPressed(key)
        return [
          { value: pressed, active: pressed },
          { value: !pressed, active: !pressed },
          { value: ~~pressed, active: true },
        ]
      }
    )
    const tSubtract = new ScriptNodeTemplate(
      'Subtract',
      ['number', 'number'],
      ['number'],
      ([a, b]) => [{ value: a - b }]
    )
    const tConstInt = new ConstantScriptNodeTemplate('ConstInt', ['int'])
    const tMux2 = new ScriptNodeTemplate(
      'Mux2',
      ['int', 'any', 'any'],
      ['any'],
      ([index, a0, a1]) => [{ value: index ? a1 : a0 }]
    )
    // const tMultiply = new ScriptNodeTemplate(
    //   'Multiply',
    //   ['number', 'number'],
    //   ['number'],
    //   ([a, b]) => [{ value: a * b }]
    // )
    const tScaleVec2 = new ScriptNodeTemplate(
      'ScaleVec2',
      ['object', 'number'],
      ['object'],
      ([v, s]) => [{ value: v.scale(s) }]
    )
    /**
     * @HATODO properly. Store owning entity in graph or something
     */
    const tGetControlledEntity = new ScriptNodeTemplate(
      'GetControlledEntity',
      [],
      ['object'],
      (_, entity) => [{ value: entity }]
    )
    const tVec2 = new ScriptNodeTemplate(
      'Vec2',
      ['number', 'number'],
      ['object'],
      ([x, y]) => [{ value: new Vec2(x, y) }]
    )
    const tNormalize = new ScriptNodeTemplate(
      'Normalize',
      ['object'],
      ['object'],
      ([v]) => [{ value: v.norm() }]
    )
    const tSetEntityVelocity = new ScriptNodeTemplate(
      'SetEntityVelocity',
      ['object', 'object'],
      [],
      ([entity, v]) => {
        entity.vel = v
      }
    )

    let graph = new ScriptGraph('PlayerController')
    const onTick = tOnTick.createNode(graph)
    // get input
    const keyW = tKey.createNode(graph, ['w'])
    const keyA = tKey.createNode(graph, ['a'])
    const keyS = tKey.createNode(graph, ['s'])
    const keyD = tKey.createNode(graph, ['d'])
    const keyShift = tKey.createNode(graph, ['shift'])
    const keyWPressed = tKeyPressed.createNode(graph)
    keyWPressed.attachAsInput(keyW, 0, 0)
    keyWPressed.attachAsInput(onTick, -1, -1)
    const keyAPressed = tKeyPressed.createNode(graph)
    keyAPressed.attachAsInput(keyA, 0, 0)
    keyAPressed.attachAsInput(onTick, -1, -1)
    const keySPressed = tKeyPressed.createNode(graph)
    keySPressed.attachAsInput(keyS, 0, 0)
    keySPressed.attachAsInput(onTick, -1, -1)
    const keyDPressed = tKeyPressed.createNode(graph)
    keyDPressed.attachAsInput(keyD, 0, 0)
    keyDPressed.attachAsInput(onTick, -1, -1)
    const keyShiftPressed = tKeyPressed.createNode(graph)
    keyShiftPressed.attachAsInput(keyShift, 0, 0)
    keyShiftPressed.attachAsInput(onTick, -1, -1)

    // compute normalized velocity vector
    const dx = tSubtract.createNode(graph)
    dx.attachAsInput(keyDPressed, 2, 0)
    dx.attachAsInput(keyAPressed, 2, 1)
    const dy = tSubtract.createNode(graph)
    dy.attachAsInput(keySPressed, 2, 0)
    dy.attachAsInput(keyWPressed, 2, 1)

    // create normalized velocity vector
    const vec2 = tVec2.createNode(graph)
    vec2.attachAsInput(dx, 0, 0)
    vec2.attachAsInput(dy, 0, 1)
    const norm = tNormalize.createNode(graph)
    norm.attachAsInput(vec2, 0, 0)

    // boost if necessary
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
    let playerScript = createPlayerScript()
    let playerController = {
      run: (player, deltaTimeSeconds) => {
        // player.vel = new Vec2(
        //   global.input.isKeyPressed('d') - global.input.isKeyPressed('a'),
        //   global.input.isKeyPressed('s') - global.input.isKeyPressed('w')
        // )
        //   .norm()
        //   .scale(500)
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

    var window = new Window(framebuffer, '#00f')
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
      <Viewport bind:framebuffer />
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
