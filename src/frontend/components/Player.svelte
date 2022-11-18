<script>
  import Viewport from 'components/Viewport.svelte'
  import { global } from '%engine/Global.js'
  import { Window3D } from '%window/Window3D.js'
  import { Context } from '%engine/Context.js'
  import { Scene } from '%component/Scene.js'
  import { GameLayer } from '%game/GameLayer.js'
  import { onMount } from 'svelte'

  export let firstLoadSerializedGameData = undefined

  let gameCanvas = undefined,
    uiCanvas = undefined

  let gameWindow = undefined

  let loading = true,
    beforeLoad = true

  function beginLoading() {
    gameWindow = new Window3D(gameCanvas, uiCanvas, [0, 0, 0, 1])
    gameWindow.pushLayer(new GameLayer(global.context.game))
    global.gameWindow = gameWindow

    global.context.windows.push(gameWindow)

    global.context.game.deserialize(firstLoadSerializedGameData)
    global.setPlayState('stop')
    gameCanvas.focus()
    global.context.paused = true

    global.context.run()

    window.setTimeout(doneLoading, 5000)

    beforeLoad = false
  }

  function doneLoading() {
    global.setPlayState('play')
    global.context.paused = false
    loading = false
  }

  onMount(() => {
    global.isEditor = false
    global.init(new Context())
    global.context.game.setCurrentScene(new Scene())
  })
</script>

<div class="w-full h-full bg-neutral-800 text-neutral-300 overflow-hidden">
  <div class="absolute top-0 left-0 w-full h-full p-2">
    <Viewport
      focusable={true}
      targetAspectRatio={global.canvas.targetWidth / global.canvas.targetHeight}
      bind:canvas={gameCanvas}
      onResize={() => global.context.propagateResizeEvent()}
    />
  </div>
  <div class="absolute top-0 left-0 w-full h-full pointer-events-none p-2">
    <Viewport
      targetAspectRatio={global.canvas.targetWidth / global.canvas.targetHeight}
      bind:canvas={uiCanvas}
      onResize={() => global.context.propagateResizeEvent()}
    />
  </div>
  {#if loading}
    <div
      class="absolute top-0 left-0 flex flex-col w-full h-full items-center justify-center text-xl font-bold text-neutral-500 bg-neutral-900"
    >
      {#if beforeLoad}
        <button
          on:click={beginLoading}
          class="bg-neutral-100 hover:bg-neutral-300 transition-all text-neutral-900 px-3 py-2"
          >Begin game</button
        >
      {:else}
        <div>Loading...</div>
      {/if}
    </div>
  {/if}
</div>
