<script>
  import { onMount } from 'svelte'
  import { global } from '%engine/Global.js'

  export let canvas = undefined
  const TARGET_ASPECT_RATIO =
    global.canvas.targetWidth / global.canvas.targetHeight
  let ctx = undefined
  let containerWidth = undefined,
    containerHeight = undefined

  function resize() {
    if (canvas && containerWidth && containerHeight) {
      const ratio = containerWidth / containerHeight
      // container is tall; canvas should fill horizontally
      if (ratio < TARGET_ASPECT_RATIO) {
        const width = Math.floor(containerWidth),
          height = Math.floor(containerWidth / TARGET_ASPECT_RATIO)
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
      // container is wide; canvas should fill vertically
      else {
        const width = Math.floor(containerHeight * TARGET_ASPECT_RATIO),
          height = Math.floor(containerHeight)
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
    }
  }

  $: containerWidth, containerHeight, resize()

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d')
      // set initial size
      const container = document.getElementById('viewport-div')
      containerWidth = container.clientWidth
      containerHeight = container.clientHeight
    }
  })
</script>

<div
  id="viewport-div"
  class="w-full h-full flex items-center justify-center overflow-hidden"
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
>
  <canvas bind:this={canvas} />
</div>
