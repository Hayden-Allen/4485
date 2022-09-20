<script>
  import { onMount } from 'svelte'
  import Viewport from './Viewport.svelte'
  import Splitter from './Splitter.svelte'
  import Logger from './Logger.svelte'
  import { Game } from '%engine/Game.js'
  import { Scene } from '%component/Scene.js'
  import { SceneEntity, ControlledSceneEntity } from '%component/SceneEntity.js'
  import { Vec2 } from '%util/Vec2.js'
  import { global } from '%engine/Global.js'
  import { Window2D } from '%window/Window2D.js'
  import { Window3D } from '%window/Window3D.js'
  import { EditorLayer } from '%editor/EditorLayer.js'
  import { ScriptGraphInputLayer } from '%editor/ScriptGraphInputLayer.js'
  import { ScriptGraphLayer } from '%editor/ScriptGraphLayer.js'
  import { ScriptGraphControlsLayer } from '%editor/ScriptGraphControlsLayer.js'
  import { ScriptGraph } from '%script/ScriptGraph.js'
  import { Context } from '%engine/Context.js'

  let context = undefined

  let gameCanvas = undefined,
    uiCanvas = undefined,
    scriptCanvas = undefined

  let gameWindow = undefined,
    scriptWindow = undefined,
    playerScript = undefined,
    playerScriptErrors = []

  function createPlayerScript(inputCache) {
    let graph = new ScriptGraph(
      'PlayerController',
      inputCache,
      (s) => (playerScriptErrors = [...playerScriptErrors, s]),
      () => (playerScriptErrors = [])
    )
    const onTick = graph.createNode('OnTick')
    // get input
    const keyShiftPressed = graph.createNode('KeyPressed', ['shift'])
    keyShiftPressed.attachAsInput(onTick, -1, -1)
    const keyWPressed = graph.createNode('KeyPressed', ['w'])
    keyWPressed.attachAsInput(onTick, -1, -1)
    const keyAPressed = graph.createNode('KeyPressed', ['a'])
    keyAPressed.attachAsInput(onTick, -1, -1)
    const keySPressed = graph.createNode('KeyPressed', ['s'])
    keySPressed.attachAsInput(onTick, -1, -1)
    const keyDPressed = graph.createNode('KeyPressed', ['d'])
    keyDPressed.attachAsInput(onTick, -1, -1)

    // compute normalized velocity vector
    const dx = graph.createNode('Subtract')
    dx.attachAsInput(keyDPressed, 2, 0)
    dx.attachAsInput(keyAPressed, 2, 1)
    const dy = graph.createNode('Subtract')
    dy.attachAsInput(keySPressed, 2, 0)
    dy.attachAsInput(keyWPressed, 2, 1)
    const vec2 = graph.createNode('Vec2')
    vec2.attachAsInput(dx, 0, 0)
    vec2.attachAsInput(dy, 0, 1)
    const norm = graph.createNode('Normalize')
    norm.attachAsInput(vec2, 0, 0)

    // boost if shift pressed
    const ci1 = graph.createNode('ConstInt', [5])
    const ci2 = graph.createNode('ConstInt', [10])
    const mux = graph.createNode('Mux2')
    mux.attachAsInput(keyShiftPressed, 2, 0)
    mux.attachAsInput(ci1, 0, 1)
    mux.attachAsInput(ci2, 0, 2)
    const scale = graph.createNode('ScaleVec2')
    scale.attachAsInput(norm, 0, 0)
    scale.attachAsInput(mux, 0, 1)

    // set velocity
    const entity = graph.createNode('GetControlledEntity')
    const setVel = graph.createNode('SetEntityVelocity')
    setVel.attachAsInput(entity, 0, 0)
    setVel.attachAsInput(scale, 0, 1)

    return graph
  }

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

    playerScript = createPlayerScript(gameWindow.inputCache)
    let playerController = {
      run: (player /* deltaTimeSeconds */) => {
        playerScript.run(player)
      },
    }
    let player = new ControlledSceneEntity(
      gameWindow,
      new Vec2(0, 0),
      'https://art.pixilart.com/840bcbc293e372f.png',
      { controllers: [playerController], scale: 25 }
    )
    // add player at z-index 1
    game.addControlledSceneEntity(player, 1)

    gameWindow.pushLayer(new EditorLayer(game))

    scriptWindow = new Window2D(scriptCanvas)
    let scriptGraphInputLayer = new ScriptGraphInputLayer()
    let scriptGraphControlsLayer = new ScriptGraphControlsLayer(
      scriptGraphInputLayer,
      scriptWindow
    )
    scriptWindow.pushLayer(scriptGraphControlsLayer)
    scriptWindow.pushLayer(
      new ScriptGraphLayer(
        scriptGraphInputLayer,
        scriptGraphControlsLayer,
        playerScript
      )
    )
    scriptWindow.pushLayer(scriptGraphInputLayer)

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
  let midSplit = 2 / 3
  let leftSplit = 1 / 3
  let rightSplit = 2 / 3

  let topLeftBasis = null,
    topRightBasis = null
  let midTopBasis = null,
    midBottomBasis = null
  let bottomLeftBasis = null,
    bottomMidBasis = null,
    bottomRightBasis = null

  $: {
    topLeftBasis = topSplit * 100
    topRightBasis = (1 - topSplit) * 100
    midTopBasis = midSplit * 100
    midBottomBasis = (1 - midSplit) * 100
    bottomLeftBasis = leftSplit * 100
    bottomMidBasis = (rightSplit - leftSplit) * 100
    bottomRightBasis = (1 - rightSplit) * 100
  }
</script>

<div class="w-full h-full flex flex-col bg-neutral-800 overflow-hidden">
  <div
    class="grow shrink basis-0 overflow-hidden flex flex-row"
    style={`flex-basis: ${midTopBasis}%;`}
  >
    <div
      class="relative grow shrink overflow-hidden bg-neutral-900"
      style={`flex-basis: ${topLeftBasis}%;`}
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
      <Viewport
        focusable={true}
        bind:canvas={scriptCanvas}
        onResize={() => context.propagateResizeEvent()}
      />
      <Logger errors={playerScriptErrors} />
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
      <p id="fps" class="text-neutral-100" />
    </div>
    <Splitter
      bind:context
      bind:split={leftSplit}
      minSplit={0.1}
      maxSplit={rightSplit - 0.1}
    />
    <div
      class="grow shrink overflow-auto bg-neutral-900"
      style={`flex-basis: ${bottomMidBasis}%;`}
    />
    <Splitter
      bind:context
      bind:split={rightSplit}
      minSplit={leftSplit + 0.1}
      maxSplit={0.9}
    />
    <div
      class="grow shrink overflow-auto bg-neutral-900"
      style={`flex-basis: ${bottomRightBasis}%;`}
    />
  </div>
</div>
