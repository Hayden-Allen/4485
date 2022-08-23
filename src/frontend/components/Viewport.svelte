<script>
  import { onMount } from 'svelte'
  import { global } from '%engine/Global.js'

  /**
   * This is the canvas that the engine will draw to.
   * Always 1920x1080.
   * @HATODO make configurable per project? Like (target resolution: 1920x1080)
   */
  export let framebuffer = undefined

  const TARGET_ASPECT_RATIO =
    global.canvas.targetWidth / global.canvas.targetHeight
  /**
   * This is the canvas that the viewport will draw to.
   * Takes the 1920x1080 framebuffer and draws it to fit the actual on-screen canvas.
   */
  let canvas = undefined,
    ctx = undefined
  let containerWidth = undefined,
    containerHeight = undefined

  function update() {
    // @HATODO probably remove, only for debugging purposes
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f0f'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw framebuffer to screen
    ctx.drawImage(framebuffer, 0, 0, canvas.width, canvas.height)

    requestAnimationFrame(update)
  }

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
    // create canvas without attaching it to document
    framebuffer = document.createElement('canvas')
    framebuffer.width = global.canvas.targetWidth
    framebuffer.height = global.canvas.targetHeight

    if (canvas) {
      ctx = canvas.getContext('2d')
      // set initial size
      const container = document.getElementById('viewport-div')
      containerWidth = container.clientWidth
      containerHeight = container.clientHeight

      update()
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
