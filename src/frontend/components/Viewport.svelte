<script>
  export let canvas = undefined
  export let targetAspectRatio = undefined
  let containerWidth = undefined,
    containerHeight = undefined

  $: {
    if (canvas && containerWidth && containerHeight) {
      if (targetAspectRatio) {
        const ratio = containerWidth / containerHeight
        // container is tall; canvas should fill horizontally
        if (ratio < targetAspectRatio) {
          const width = Math.floor(containerWidth),
            height = Math.floor(containerWidth / targetAspectRatio)
          canvas.width = width * window.devicePixelRatio
          canvas.height = height * window.devicePixelRatio
          canvas.style.width = `${width}px`
          canvas.style.height = `${height}px`
        }
        // container is wide; canvas should fill vertically
        else {
          const width = Math.floor(containerHeight * targetAspectRatio),
            height = Math.floor(containerHeight)
          canvas.width = width * window.devicePixelRatio
          canvas.height = height * window.devicePixelRatio
          canvas.style.width = `${width}px`
          canvas.style.height = `${height}px`
        }
      } else {
        const width = Math.floor(containerWidth),
          height = Math.floor(containerHeight)
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
    }
  }
</script>

<div
  class="w-full h-full flex items-center justify-center overflow-hidden"
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
>
  <canvas bind:this={canvas} tabindex="1" />
</div>
