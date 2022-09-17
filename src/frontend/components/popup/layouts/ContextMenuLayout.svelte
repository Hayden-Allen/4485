<script>
  export let x = null,
    y = null
  export let width = null,
    height = null
  export let checkCanReposition = null
  export let onDestroyPopup = null
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
    style={`left: ${x}px; top: ${y}px; width: ${width}; height: ${height};`}
    on:pointerdown={(e) => {
      e.stopPropagation()
    }}
  >
    <slot />
  </div>
</div>
