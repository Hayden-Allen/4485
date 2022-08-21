<script>
  import { onMount, setContext } from 'svelte'

  export let canvas = undefined

  const TARGET_ASPECT_RATIO = 1920 / 1080,
    R_TARGET_ASPECT_RATIO = 1 / TARGET_ASPECT_RATIO
  let containerWidth = undefined,
    containerHeight = undefined

  function resize() {
    if (canvas && containerWidth && containerHeight) {
      const ratio = containerWidth / containerHeight
      // container is tall; canvas should fill horizontally
      if (ratio < TARGET_ASPECT_RATIO) {
        canvas.width = Math.floor(containerWidth) * window.devicePixelRatio
        canvas.height =
          Math.floor(containerWidth * R_TARGET_ASPECT_RATIO) *
          window.devicePixelRatio
      }
      // container is wide; canvas should fill vertically
      else {
        canvas.height = Math.floor(containerHeight) * window.devicePixelRatio
        canvas.width =
          Math.floor(containerHeight * TARGET_ASPECT_RATIO) *
          window.devicePixelRatio
      }
    }
  }

  $: containerWidth, containerHeight, resize()

  onMount(() => {
    if (canvas) {
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
