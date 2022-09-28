<script>
  import { onMount } from 'svelte'
  import Viewport from 'components/Viewport.svelte'
  import Splitter from 'components/Splitter.svelte'
  import ScriptTemplatesPanel from 'components/ScriptTemplatesPanel.svelte'
  import ScriptPropertiesPanel from 'components/ScriptPropertiesPanel.svelte'
  import ScriptGraphEditor from 'components/ScriptGraphEditor.svelte'
  import { Game } from '%engine/Game.js'
  import { Scene } from '%component/Scene.js'
  import {
    SceneEntity,
    ControlledSceneEntity,
    DynamicSceneEntity,
  } from '%component/SceneEntity.js'
  import { Vec2 } from '%util/Vec2.js'
  import { global } from '%engine/Global.js'
  import { Window3D } from '%window/Window3D.js'
  import { EditorLayer } from '%editor/EditorLayer.js'
  import { ScriptGraph } from '%script/ScriptGraph.js'
  import { Behavior } from '%script/Behavior.js'

  let gameCanvas = undefined,
    uiCanvas = undefined

  let gameWindow = undefined,
    player = undefined,
    graphEditorScriptErrors = [],
    graphEditorScriptEmpty = true

  let graphEditorScript = undefined

  onMount(() => {
    global.init()

    var game = new Game(global.context)

    gameWindow = new Window3D(gameCanvas, uiCanvas, [0, 0, 1, 1])

    var scene = new Scene()
    game.setCurrentScene(scene)
    const size = 10
    let vertices = [],
      indices = [],
      i = 0
    for (var y = 0; y < 50; y += size) {
      for (var x = 0; x < 500; x += size) {
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
        new Vec2(-700, -300),
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYrGPqKAnwSbc1AwWvieLvCe5gy2LASXWOg&usqp=CAU',
        { vertices, indices, scale: 25 }
      ),
      0
    )

    player = new ControlledSceneEntity(
      gameWindow,
      new Vec2(0, 0),
      'https://art.pixilart.com/840bcbc293e372f.png',
      new Behavior('default'),
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

    global.context.windows.push(gameWindow)
    global.context.run()
  })

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

<div
  class="w-full h-full flex flex-col bg-neutral-800 text-neutral-300 overflow-hidden"
>
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
    <Splitter bind:split={topSplit} minSplit={0.1} maxSplit={0.9} />
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
          onResize={() => global.context.propagateResizeEvent()}
        />
      </div>
      <div class="absolute t-0 l-0 w-full h-full pointer-events-none p-2">
        <Viewport
          targetAspectRatio={global.canvas.targetWidth /
            global.canvas.targetHeight}
          bind:canvas={uiCanvas}
          onResize={() => global.context.propagateResizeEvent()}
        />
      </div>
      <div class="absolute t-0 l-0 w-full h-full pointer-events-none p-2">
        <p id="fps" />
      </div>
    </div>
  </div>
  <Splitter
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
      <ScriptTemplatesPanel
        onUseScript={(info) => {
          let script = new ScriptGraph(
            'default',
            gameWindow.inputCache,
            (s) => {
              graphEditorScriptErrors = [...graphEditorScriptErrors, s]
              graphEditorScriptEmpty = false
            },
            (empty) => {
              graphEditorScriptErrors = []
              graphEditorScriptEmpty = empty
            }
          )
          script.deserialize(info.script)
          player.addScript(script)
          player.behavior.scripts = player.behavior.scripts
        }}
      />
    </div>
    <Splitter bind:split={bottomSplit} minSplit={0.1} maxSplit={0.9} />
    <div
      class="relative grow shrink overflow-hidden bg-neutral-900"
      style={`flex-basis: ${bottomRightBasis}%;`}
    >
      {#if graphEditorScript}
        <ScriptGraphEditor
          context={global.context}
          script={graphEditorScript}
          errorsList={graphEditorScriptErrors}
          graphIsEmpty={graphEditorScriptEmpty}
          onBackClicked={() => (graphEditorScript = undefined)}
        />
      {:else if player}
        <div
          class="flex flex-col w-full h-full overflow-x-hidden overflow-y-auto"
        >
          <ScriptPropertiesPanel
            entity={player}
            onEditScript={(script) => (graphEditorScript = script)}
            onDeleteScript={(script) => {
              player.removeScript(script)
              player.behavior.scripts = player.behavior.scripts
            }}
          />
        </div>
      {/if}
    </div>
  </div>
</div>
