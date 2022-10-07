<script>
  import { onMount, onDestroy } from 'svelte'
  import { ScriptInputLayer } from '%editor/ScriptInputLayer.js'
  import { ScriptLayer } from '%editor/ScriptLayer.js'
  import { ScriptControlsLayer } from '%editor/ScriptControlsLayer.js'
  import { Window2D } from '%window/Window2D.js'
  import Viewport from 'components/Viewport.svelte'
  import Logger from 'components/Logger.svelte'
  import ArrowLeft from 'icons/24/outline/arrow-left.svelte'

  export let context = undefined
  export let script = undefined
  export let errorsList = undefined
  export let graphIsEmpty = false
  export let onBackClicked = undefined
  export let states = undefined

  let scriptWindow = undefined,
    scriptCanvas = undefined,
    scriptLayer = undefined

  onMount(() => {
    scriptWindow = new Window2D(scriptCanvas)
    let scriptInputLayer = new ScriptInputLayer()
    let scriptControlsLayer = new ScriptControlsLayer(
      scriptInputLayer,
      scriptWindow
    )
    scriptLayer = new ScriptLayer(
      scriptInputLayer,
      scriptControlsLayer,
      undefined,
      states
    )
    scriptWindow.pushLayer(scriptControlsLayer)
    scriptWindow.pushLayer(scriptLayer)
    scriptWindow.pushLayer(scriptInputLayer)

    context.windows.push(scriptWindow)
  })

  onDestroy(() => {
    context.removeWindow(scriptWindow)
  })

  $: {
    if (scriptLayer) {
      scriptLayer.setScript(script)
      scriptLayer.graphvis.arrange()
    }
  }
</script>

<Viewport
  focusable={true}
  bind:canvas={scriptCanvas}
  onResize={() => context.propagateResizeEvent()}
/>
<Logger errors={errorsList} {graphIsEmpty} />
<button
  class="flex flex-row items-center justify-center absolute top-[16px] left-[16px] bg-neutral-300 hover:bg-neutral-400 transition-all text-neutral-900 font-bold px-4 py-2 rounded-full"
  on:click={onBackClicked}
>
  <div class="w-6 h-6 mr-2">
    <ArrowLeft />
  </div>
  <div>Back</div>
</button>
