<script>
  import { onMount, onDestroy } from 'svelte'

  export let x = null,
    y = null
  export let width = null,
    height = null
  export let checkCanReposition = null
  export let onDestroyPopup = null

  export let borderAlphaVarying = null

  let borderAlpha = null
  let animationFrame = null

  function animate() {
    animationFrame = window.requestAnimationFrame(animate)
    borderAlpha = borderAlphaVarying.getValue()
  }

  onMount(() => {
    animationFrame = window.requestAnimationFrame(animate)
  })

  onDestroy(() => {
    window.cancelAnimationFrame(animationFrame)
    animationFrame = null
  })
</script>

<svelte:window on:resize={onDestroyPopup} />

<div
  class="fixed left-0 top-0 w-full h-full overflow-hidden"
  on:pointerdown={(e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.button === 2 && checkCanReposition(e.clientX, e.clientY)) {
      x = e.clientX
      y = e.clientY
    } else {
      onDestroyPopup()
    }
  }}
>
  <div
    class="bg-neutral-800 text-neutral-100 drop-shadow-xl absolute"
    style={`border: 2px solid rgba(212, 212, 212, ${borderAlpha}); left: ${x}px; top: ${y}px; width: ${width}; height: ${height};`}
    on:pointerdown={(e) => {
      e.stopPropagation()
    }}
  >
    <slot />
  </div>
</div>
