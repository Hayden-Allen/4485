<script>
  import { onMount } from 'svelte'
  import Viewport from './Viewport.svelte'
  import Splitter from './Splitter.svelte'
  import Logger from './Logger.svelte'
  import BehaviorsPanel from './BehaviorsPanel.svelte'
  import { Game } from '%engine/Game.js'
  import { Scene } from '%component/Scene.js'
  import {
    SceneEntity,
    ControlledSceneEntity,
    DynamicSceneEntity,
  } from '%component/SceneEntity.js'
  import { Vec2 } from '%util/Vec2.js'
  import { global } from '%engine/Global.js'
  import { Window2D } from '%window/Window2D.js'
  import { Window3D } from '%window/Window3D.js'
  import { EditorLayer } from '%editor/EditorLayer.js'
  import { ScriptInputLayer } from '%editor/ScriptInputLayer.js'
  import { ScriptLayer } from '%editor/ScriptLayer.js'
  import { ScriptControlsLayer } from '%editor/ScriptControlsLayer.js'
  import { ScriptGraph } from '%script/ScriptGraph.js'
  import { Context } from '%engine/Context.js'

  let context = undefined

  let gameCanvas = undefined,
    uiCanvas = undefined,
    scriptCanvas = undefined

  let gameWindow = undefined,
    scriptWindow = undefined,
    scriptLayer = undefined,
    playerScript = undefined,
    playerScriptErrors = [],
    playerScriptEmpty = true

  onMount(() => {
    if (context) {
      return
    }

    context = new Context()
    global.init(context)
    var game = new Game(context)

    gameWindow = new Window3D(gameCanvas, uiCanvas, [0, 0, 1, 1])

    var scene = new Scene()
    game.setCurrentScene(scene)
    const size = 10
    let vertices = [],
      indices = [],
      i = 0
    for (var y = 0; y < 50; y += size) {
      for (var x = 0; x < 50; x += size) {
        const sx = x / 10,
          sy = y / 10
        const s = 1
        vertices.push(
          sx,
          sy,
          0,
          0,
          sx + s,
          sy,
          1,
          0,
          sx + s,
          sy + s,
          1,
          1,
          sx,
          sy + s,
          0,
          1
        )
        const b = i * 4
        indices.push(b, b + 1, b + 2, b, b + 2, b + 3)
        i++
      }
    }
    game.addStaticSceneEntity(
      new SceneEntity(
        gameWindow,
        new Vec2(0, 0),
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYrGPqKAnwSbc1AwWvieLvCe5gy2LASXWOg&usqp=CAU',
        { vertices, indices, scale: 25 }
      ),
      0
    )

    playerScript = new ScriptGraph(
      'blah',
      gameWindow.inputCache,
      (s) => {
        playerScriptErrors = [...playerScriptErrors, s]
        playerScriptEmpty = false
      },
      (empty) => {
        playerScriptErrors = []
        playerScriptEmpty = empty
      }
    )

    let player = new ControlledSceneEntity(
      gameWindow,
      new Vec2(0, 0),
      'https://art.pixilart.com/840bcbc293e372f.png',
      playerScript,
      { scale: 25 }
    )
    // add player at z-index 1
    game.addControlledSceneEntity(player, 1)

    game.addDynamicSceneEntity(
      new DynamicSceneEntity(
        gameWindow,
        new Vec2(-100, 0),
        'https://art.pixilart.com/840bcbc293e372f.png',
        { scale: 25 }
      ),
      1
    )

    gameWindow.pushLayer(new EditorLayer(game))

    scriptWindow = new Window2D(scriptCanvas)
    let scriptInputLayer = new ScriptInputLayer()
    let scriptControlsLayer = new ScriptControlsLayer(
      scriptInputLayer,
      scriptWindow
    )
    scriptLayer = new ScriptLayer(
      scriptInputLayer,
      scriptControlsLayer,
      playerScript
    )
    scriptWindow.pushLayer(scriptControlsLayer)
    scriptWindow.pushLayer(scriptLayer)
    scriptWindow.pushLayer(scriptInputLayer)

    context.windows.push(gameWindow)
    context.windows.push(scriptWindow)
    context.run()
  })

  $: {
    if (gameCanvas) {
      gameWindow.setCanvas(gameCanvas)
    }
  }

  $: {
    if (uiCanvas) {
      gameWindow.setUICanvas(uiCanvas)
    }
  }

  $: {
    if (scriptCanvas) {
      scriptWindow.setCanvas(scriptCanvas)
    }
  }

  /*
   * Handles
   */

  let topSplit = 1 / 2
  let midSplit = 1 / 2
  let bottomSplit = 1 / 2

  let topLeftBasis = null,
    topRightBasis = null
  let midTopBasis = null,
    midBottomBasis = null
  let bottomLeftBasis = null,
    bottomRightBasis = null

  $: {
    topLeftBasis = topSplit * 100
    topRightBasis = (1 - topSplit) * 100
    midTopBasis = midSplit * 100
    midBottomBasis = (1 - midSplit) * 100
    bottomLeftBasis = bottomSplit * 100
    bottomRightBasis = (1 - bottomSplit) * 100
  }
</script>

<div class="w-full h-full flex flex-col bg-neutral-800 overflow-hidden">
  <div
    class="grow shrink basis-0 overflow-hidden flex flex-row"
    style={`flex-basis: ${midTopBasis}%;`}
  >
    <div
      class="grow shrink overflow-auto bg-neutral-900"
      style={`flex-basis: ${topLeftBasis}%;`}
    >
      <!-- Prefabs -->
    </div>
    <Splitter
      bind:context
      bind:split={topSplit}
      minSplit={0.1}
      maxSplit={0.9}
    />
    <div
      class="relative grow shrink overflow-hidden bg-neutral-900"
      style={`flex-basis: ${topRightBasis}%;`}
    >
      <div class="absolute t-0 l-0 w-full h-full p-2">
        <Viewport
          focusable={true}
          targetAspectRatio={global.canvas.targetWidth /
            global.canvas.targetHeight}
          bind:canvas={gameCanvas}
          onResize={() => context.propagateResizeEvent()}
        />
      </div>
      <div class="absolute t-0 l-0 w-full h-full pointer-events-none p-2">
        <Viewport
          targetAspectRatio={global.canvas.targetWidth /
            global.canvas.targetHeight}
          bind:canvas={uiCanvas}
          onResize={() => context.propagateResizeEvent()}
        />
      </div>
      <div class="absolute t-0 l-0 w-full h-full pointer-events-none p-2">
        <p id="fps" class="text-neutral-100" />
      </div>
    </div>
  </div>
  <Splitter
    bind:context
    bind:split={midSplit}
    isVertical={true}
    minSplit={0.1}
    maxSplit={0.9}
  />
  <div
    class="grow shrink overflow-hidden flex flex-row"
    style={`flex-basis: ${midBottomBasis}%;`}
  >
    <div
      class="grow shrink overflow-auto bg-neutral-900"
      style={`flex-basis: ${bottomLeftBasis}%;`}
    >
      <BehaviorsPanel
        onUseBehavior={(info) => {
          playerScript.deserialize(info.script)
          scriptLayer.graphvis.arrange()
        }}
      />
    </div>
    <Splitter
      bind:context
      bind:split={bottomSplit}
      minSplit={0.1}
      maxSplit={0.9}
    />
    <div
      class="relative grow shrink overflow-hidden bg-neutral-900"
      style={`flex-basis: ${bottomRightBasis}%;`}
    >
      <Viewport
        focusable={true}
        bind:canvas={scriptCanvas}
        onResize={() => context.propagateResizeEvent()}
      />
      <Logger errors={playerScriptErrors} graphIsEmpty={playerScriptEmpty} />
    </div>
  </div>
</div>
