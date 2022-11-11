<script>
  export let canvas = undefined
  export let targetAspectRatio = undefined
  export let onResize = undefined
  export let focusable = false

  const BORDER_SIZE = 1

  let containerWidth = undefined,
    containerHeight = undefined

  $: {
    if (canvas && containerWidth && containerHeight) {
      const containerWidthMinusBorder = containerWidth - BORDER_SIZE * 2
      const containerHeightMinusBorder = containerHeight - BORDER_SIZE * 2
      if (targetAspectRatio) {
        const ratio = containerWidthMinusBorder / containerHeightMinusBorder
        // container is tall; canvas should fill horizontally
        if (ratio < targetAspectRatio) {
          const width = Math.floor(containerWidthMinusBorder),
            height = Math.floor(containerWidthMinusBorder / targetAspectRatio)
          canvas.width = width * window.devicePixelRatio
          canvas.height = height * window.devicePixelRatio
          canvas.style.width = `${width}px`
          canvas.style.height = `${height}px`
        }
        // container is wide; canvas should fill vertically
        else {
          const width = Math.floor(
              containerHeightMinusBorder * targetAspectRatio
            ),
            height = Math.floor(containerHeightMinusBorder)
          canvas.width = width * window.devicePixelRatio
          canvas.height = height * window.devicePixelRatio
          canvas.style.width = `${width}px`
          canvas.style.height = `${height}px`
        }
      } else {
        const width = Math.floor(containerWidthMinusBorder),
          height = Math.floor(containerHeightMinusBorder)
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
      if (onResize) {
        onResize()
      }
    }
  }
</script>

<div
  class="w-full h-full flex items-center justify-center overflow-hidden"
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
>
  <canvas
    class="focus:outline-0 border border-transparent outline-none focus:border-neutral-300"
    bind:this={canvas}
    tabindex={focusable ? 0 : undefined}
  />
</div>
