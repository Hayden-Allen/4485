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
    ConstantScriptNodeTemplate,
  } from '%script/ScriptNodeTemplate.js'
  import { ScriptGraph } from '%script/ScriptGraph.js'

  let canvas = undefined

  function runScripts() {
    const tmul = new ScriptNodeTemplate(
      'mul',
      ['number', 'number'],
      ['number'],
      ([a, b]) => [{ value: a * b, activate: true }]
    )
    const tcf = new ConstantScriptNodeTemplate('cf', ['float'])

    let graph = new ScriptGraph('graph')
    let mulA = tmul.createNode(graph)
    let mulB = tmul.createNode(graph)
    let cf5 = tcf.createNode(graph, [5])

    mulB.attachAsInput(mulA, 0, 0)
    mulB.attachAsInput(cf5, 0, 1)

    let inputs = new Map()
    inputs.set(mulA.id, [2, 3])
    console.log(graph.run(inputs))
  }

  onMount(() => {
    runScripts()

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
    let playerController = {
      run: (player, deltaTimeSeconds) => {
        player.vel = new Vec2(
          global.input.isKeyPressed('d') - global.input.isKeyPressed('a'),
          global.input.isKeyPressed('s') - global.input.isKeyPressed('w')
        )
          .norm()
          .scale(500)
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
