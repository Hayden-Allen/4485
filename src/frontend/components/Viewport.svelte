<script>
  import { onMount } from 'svelte'

  const GAME_WIDTH = 1920, GAME_HEIGHT = 1080

  let canvas = null, ctx = null
  let containerWidth = null, containerHeight = null

  function animate() {
    window.requestAnimationFrame(animate)

    if (!canvas || !ctx) {
      return
    }

    ctx.restore()
    ctx.save()
    ctx.scale(canvas.width / GAME_WIDTH, canvas.height / GAME_HEIGHT)

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
  }

  $: {
    if (canvas && containerWidth && containerHeight) {
      const ratio = containerWidth / containerHeight
      if (ratio < 16 / 9) {
        canvas.width = Math.floor(containerWidth) * window.devicePixelRatio
        canvas.height = Math.floor(containerWidth * (9 / 16)) * window.devicePixelRatio
      } else {
        canvas.height = Math.floor(containerHeight) * window.devicePixelRatio
        canvas.width = Math.floor(containerHeight * (16 / 9)) * window.devicePixelRatio
      }
    }
  }

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d')
      window.requestAnimationFrame(animate)
    }
  })
</script>

<div class="w-full h-full flex items-center justify-center overflow-hidden" bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>
  <canvas bind:this={canvas} />
</div>
