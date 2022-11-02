<script>
  import { onMount } from 'svelte'
  import Viewport from 'components/Viewport.svelte'
  import Splitter from 'components/Splitter.svelte'
  import AssetsPanel from 'components/AssetsPanel.svelte'
  import ScriptTemplatesPanel from 'components/ScriptTemplatesPanel.svelte'
  import StatesPanel from 'components/StatesPanel.svelte'
  import ScriptGraphEditor from 'components/ScriptGraphEditor.svelte'
  import { Scene } from '%component/Scene.js'
  import { Vec2 } from '%util/Vec2.js'
  import { global } from '%engine/Global.js'
  import { Window3D } from '%window/Window3D.js'
  import { EditorLayer } from '%editor/EditorLayer.js'
  import { ScriptGraph } from '%script/ScriptGraph.js'
  import { State } from '%script/State.js'

  let gameCanvas = undefined,
    uiCanvas = undefined

  let gameWindow = undefined,
    graphEditorScriptErrors = [],
    graphEditorScriptEmpty = true,
    editorLayer = undefined,
    selectedEntity = undefined,
    selectedState = undefined

  let graphEditorScript = undefined

  function genRect(game, size, width, height, pos) {
    let vertices = [],
      indices = [],
      i = 0
    for (var y = 0; y < height; y += size) {
      for (var x = 0; x < width; x += size) {
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
      0,
      gameWindow,
      pos,
      0,
      [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYrGPqKAnwSbc1AwWvieLvCe5gy2LASXWOg&usqp=CAU',
      ],
      { vertices, indices, scale: 32 }
    )
  }

  onMount(() => {
    global.init()

    var game = global.context.game

    gameWindow = new Window3D(gameCanvas, uiCanvas, [0, 0, 0, 1])

    var scene = new Scene()
    game.setCurrentScene(scene)

    genRect(game, 10, 700, 50, new Vec2(-960, -544))
    genRect(game, 10, 20, 20, new Vec2(-800, -384))
    genRect(game, 10, 20, 20, new Vec2(-544, -384))

    // add player at z-index 1
    game.addControlledSceneEntity(
      1,
      gameWindow,
      new Vec2(0, 0),
      new Map([
        [
          'Default',
          new State('Default', [], gameWindow.gl, [
            null,
            null,
            null,
            null,
            {
              frameTime: 500,
              urls: [
                'https://art.pixilart.com/840bcbc293e372f.png',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYrGPqKAnwSbc1AwWvieLvCe5gy2LASXWOg&usqp=CAU',
              ],
            },
            null,
            null,
            null,
            null,
          ]),
        ],
      ]),
      'Default',
      { scale: 32 }
    )

    game.addControlledSceneEntity(
      1,
      gameWindow,
      new Vec2(-710, 0),
      new Map([
        [
          'Default',
          new State('Default', [], gameWindow.gl, [
            null,
            null,
            null,
            null,
            {
              frameTime: 0,
              urls: ['https://art.pixilart.com/840bcbc293e372f.png'],
            },
            null,
            null,
            null,
            null,
          ]),
        ],
      ]),
      'Default',
      { scale: 32 }
    )

    editorLayer = new EditorLayer(game, (e) => {
      selectedEntity = e
      if (!selectedEntity) {
        graphEditorScript = undefined
        selectedState = undefined
      } else {
        selectedState = selectedEntity.currentState
      }
    })
    gameWindow.pushLayer(editorLayer)

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

  function createEmptyScript(name) {
    return new ScriptGraph(
      name,
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
      <AssetsPanel />
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
      {#if selectedEntity}
        <ScriptTemplatesPanel
          onUseScript={(info) => {
            let script = createEmptyScript('default')
            script.deserialize(info.script)
            script.templateName = info.name
            selectedState.scripts = [...selectedState.scripts, script]
            selectedEntity.states = selectedEntity.states
          }}
        />
      {:else}
        <div
          class="grow-0 shrink-0 w-full h-full flex flex-col items-center justify-center overflow-hidden text-xl font-bold text-neutral-500"
        >
          <div>Select an entity to edit</div>
        </div>
      {/if}
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
          states={selectedEntity.states}
        />
      {:else if selectedEntity}
        <div
          class="flex flex-col w-full h-full overflow-x-hidden overflow-y-auto"
        >
          <StatesPanel
            states={selectedEntity.states}
            {selectedEntity}
            {selectedState}
            onSelectState={(name, state) => {
              selectedState = state
            }}
            onRenameState={(name, state) => {
              let newName = window.prompt('Enter new state name:')
              if (!newName) return
              newName = newName.trim()

              selectedEntity.states.delete(name)
              selectedEntity.states.set(newName, state)
              selectedEntity.setState(newName)
              selectedEntity.states = selectedEntity.states
            }}
            onDeleteState={(name, state) => {
              selectedEntity.states.delete(name)
              selectedEntity.states = selectedEntity.states
            }}
            onEditScript={(script) => (graphEditorScript = script)}
            onAddState={() => {
              let name = window.prompt('Enter new state name:')
              if (!name) return
              name = name.trim()

              if (selectedEntity.states.has(name))
                if (!window.confirm(`State '${name}' exists. Overwrite?`))
                  return
              const newState = new State(name, [], gameWindow.gl, [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
              ])
              selectedEntity.states.set(name, newState)
              selectedState = newState
              selectedEntity.states = selectedEntity.states
            }}
          />
        </div>
      {:else}
        <div
          class="grow-0 shrink-0 w-full h-full flex flex-col items-center justify-center overflow-hidden text-xl font-bold text-neutral-500"
        >
          <div>Select an entity to edit</div>
        </div>
      {/if}
    </div>
  </div>
</div>
