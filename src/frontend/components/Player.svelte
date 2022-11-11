<script>
  import { onMount } from 'svelte'
  import Viewport from 'components/Viewport.svelte'
  import { global } from '%engine/Global.js'
  import { Window3D } from '%window/Window3D.js'
  import { Context } from '%engine/Context.js'
  import { Scene } from '%component/Scene.js'
  import { GameLayer } from '%game/GameLayer.js'

  export let firstLoadSerializedGameData = undefined

  let gameCanvas = undefined,
    uiCanvas = undefined

  let gameWindow = undefined

  onMount(() => {
    global.isEditor = false
    global.init(new Context())
    global.context.game.setCurrentScene(new Scene())

    gameWindow = new Window3D(gameCanvas, uiCanvas, [0, 0, 0, 1])
    gameWindow.pushLayer(new GameLayer(global.context.game))
    global.gameWindow = gameWindow

    global.context.windows.push(gameWindow)

    global.context.game.deserialize(firstLoadSerializedGameData)
    global.playState = 'play'
    gameCanvas.focus()
    global.context.paused = false

    global.context.run()
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
</div>
