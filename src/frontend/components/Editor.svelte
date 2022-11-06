<script>
  import { onMount } from 'svelte'
  import { dndzone } from 'svelte-dnd-action'
  import Viewport from 'components/Viewport.svelte'
  import Splitter from 'components/Splitter.svelte'
  import AssetsPanel from 'components/AssetsPanel.svelte'
  import ScriptTemplatesPanel from 'components/ScriptTemplatesPanel.svelte'
  import StatesPanel from 'components/StatesPanel.svelte'
  import ScriptGraphEditor from 'components/ScriptGraphEditor.svelte'
  import { Vec2 } from '%util/Vec2.js'
  import { global } from '%engine/Global.js'
  import { Window3D } from '%window/Window3D.js'
  import { EditorLayer } from '%editor/EditorLayer.js'
  import { ScriptGraph } from '%script/ScriptGraph.js'
  import { State } from '%script/State.js'
  import PlayIcon from 'icons/24/solid/play.svelte'
  import PauseIcon from 'icons/24/solid/pause.svelte'
  import StopIcon from 'icons/24/solid/stop.svelte'
  import { Context } from '%engine/Context.js'
  import Bolt from 'icons/20/mini/bolt.svelte'
  import WorldPropertiesPanel from './WorldPropertiesPanel.svelte'
  import { Scene } from '%component/Scene.js'

  let gameCanvas = undefined,
    uiCanvas = undefined

  let gameWindow = undefined,
    editorLayer = undefined

  let graphEditorScript = undefined,
    graphEditorScriptErrors = [],
    graphEditorScriptEmpty = true,
    selectedEntity = undefined,
    selectedState = undefined

  let displayGravity = undefined

  function resetUiState() {
    //
    // TODO: After de-serialization, entities should be re-selected based on their UUID rather than just deselected
    //
    graphEditorScript = undefined
    graphEditorScriptErrors = []
    graphEditorScriptEmpty = true
    editorLayer.selectedEntity = undefined // FIXME
    selectedEntity = undefined
    selectedState = undefined
  }

  let curProject = undefined

  function serializeOnStop() {
    curProject = global.context.game.serialize()
    resetUiState()
    global.context.game.deserialize(curProject)
    global.context.game.physicsEngine.engine.gravity.scale =
      global.context.game.physicsEngine.engine.gravity.scale
  }

  $: {
    if (global.context) {
      displayGravity = global.context.game.physicsEngine.engine.gravity.scale
    }
  }

  onMount(() => {
    global.init(new Context())
    global.context.game.setCurrentScene(new Scene())

    gameWindow = new Window3D(gameCanvas, uiCanvas, [0, 0, 0, 1])
    global.gameWindow = gameWindow

    editorLayer = new EditorLayer(global.context.game, (e) => {
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

    setPlayState(global.playState)

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

  let dragItems = []

  function handleDndConsider(e) {
    dragItems = e.detail.items
  }

  let dropX = null,
    dropY = null
  function onPointerMove(e) {
    const bounds = gameWindow.canvas.getBoundingClientRect()
    if (
      e.clientX < bounds.left ||
      e.clientY < bounds.top ||
      e.clientX > bounds.right ||
      e.clientY > bounds.bottom
    ) {
      dropX = null
      dropY = null
      return
    }

    const [cx, cy] = global.transformDOMToCanvas(
      gameWindow.canvas,
      e.clientX,
      e.clientY
    )
    const [wx, wy] = global.transformCanvasToWorld(gameWindow.canvas, cx, cy)
    dropX = wx
    dropY = wy
  }

  function handleDndFinalize(e) {
    if (
      e.detail.items.length > 0 &&
      e.detail.items[0].candidate &&
      dropX !== null &&
      dropY !== null
    ) {
      global.context.game.addStaticSceneEntity(
        0,
        gameWindow,
        new Vec2(dropX, dropY),
        e.detail.items[0].candidate.frameTime,
        e.detail.items[0].candidate.urls,
        { scaleX: 32, scaleY: 32 }
      )
    }
    dragItems = []
  }

  function handleMakeDynamicEntity() {
    //
  }

  function setPlayState(newPlayState) {
    if (newPlayState === 'play') {
      gameCanvas.focus()
      global.context.paused = false
    } else if (newPlayState === 'pause') {
      global.context.paused = true
    } else if (newPlayState === 'stop') {
      global.context.paused = true
      serializeOnStop()
    }
    global.playState = newPlayState
  }
</script>

<svelte:window on:pointermove={onPointerMove} />

<div
  class="w-full h-full flex flex-col bg-neutral-800 text-neutral-300 overflow-hidden"
>
  <div
    class="grow shrink basis-0 overflow-hidden flex flex-row"
    style={`flex-basis: ${midTopBasis}%;`}
  >
    <div
      class="relative grow shrink overflow-auto bg-neutral-900"
      style={`flex-basis: ${topLeftBasis}%;`}
    >
      <div class="absolute t-0 l-0 w-full h-full">
        <AssetsPanel />
      </div>
      <div
        class={`absolute t-0 l-0 w-full h-full ${
          global.playState === 'stop'
            ? 'pointer-events-none opacity-0'
            : 'bg-black opacity-50'
        } transition-all`}
      />
    </div>
    <Splitter bind:split={topSplit} minSplit={0.1} maxSplit={0.9} />
    <div
      class="flex flex-row grow shrink relative overflow-hidden bg-neutral-900 pl-3"
      style={`flex-basis: ${topRightBasis}%;`}
    >
      <div
        class="flex flex-col grow-0 shrink-0 p-2 items-center justify-center shadow-lg"
      >
        <button
          class={`p-4 bg-neutral-700 rounded-t-lg ${
            global.playState === 'play'
              ? 'text-green-500'
              : 'text-neutral-100 hover:text-green-300'
          } transition-all`}
          on:click={() => setPlayState('play')}
        >
          <div class="w-6 h-6">
            <PlayIcon />
          </div>
        </button>
        <button
          class={`p-4 bg-neutral-700 ${
            global.playState === 'pause'
              ? 'text-cyan-500'
              : 'text-neutral-100 hover:text-cyan-300 disabled:text-neutral-500 disabled:hover:text-neutral-500 disabled:pointer-events-none'
          } transition-all`}
          on:click={() => setPlayState('pause')}
          disabled={global.playState === 'stop'}
        >
          <div class="w-6 h-6">
            <PauseIcon />
          </div>
        </button>
        <button
          class={`p-4 bg-neutral-700 rounded-b-lg ${
            global.playState === 'stop'
              ? 'text-red-500'
              : 'text-neutral-100 hover:text-red-300'
          } transition-all`}
          on:click={() => setPlayState('stop')}
        >
          <div class="w-6 h-6">
            <StopIcon />
          </div>
        </button>
      </div>
      <div
        class="relative grow shrink w-full h-full overflow-hidden bg-neutral-900"
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
        {#if global.playState === 'stop'}
          <div class="absolute t-0 l-0 w-full h-full pointer-events-none p-2">
            <div
              class="absolute top-0 left-0 w-full h-full"
              use:dndzone={{
                type: 'Animation',
                centreDraggedOnCursor: true,
                dragDisabled: true,
                morphDisabled: true,
                dropTargetStyle: '',
                items: dragItems,
              }}
              on:consider={handleDndConsider}
              on:finalize={handleDndFinalize}
            >
              {#each dragItems as item (item.id)}
                <div class="hidden" />
              {/each}
            </div>
          </div>
        {/if}
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
          let script = createEmptyScript('default')
          script.deserialize(info.script)
          script.templateName = info.name
          selectedState.scripts = [...selectedState.scripts, script]
          selectedEntity.states = selectedEntity.states
        }}
        canUseScript={selectedEntity && selectedState}
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
          states={selectedEntity.states}
        />
      {:else if selectedEntity}
        {#if selectedEntity.ops.isStatic}
          <div
            class="flex flex-col items-center justify-center w-full h-full overflow-x-hidden overflow-y-auto"
          >
            <button
              on:click={handleMakeDynamicEntity}
              class="flex grow-0 shrink-0 p-2 items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-500 transition-all"
            >
              <div class="w-5 h-5 mr-2"><Bolt /></div>
              <div>Make dynamic entity</div>
            </button>
          </div>
        {:else}
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
                selectedState = undefined
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
        {/if}
      {:else}
        <div
          class="grow-0 shrink-0 w-full h-full flex flex-col overflow-x-hidden overflow-y-auto"
        >
          {#if global.context}
            <WorldPropertiesPanel
              gravity={displayGravity}
              onSetGravity={(value) =>
                (global.context.game.physicsEngine.engine.gravity.scale =
                  value)}
            />
          {/if}
          <div
            class="flex flex-col w-full h-full grow shrink items-center justify-center text-xl font-bold text-neutral-500"
          >
            <div>Select an entity to edit</div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
