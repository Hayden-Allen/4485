<script>
  export let x = null,
    y = null
  export let width = null,
    height = null
  export let bgColor = null
  export let fgColor = null
  export let onDestroyPopup = null
</script>

<svelte:window on:resize={onDestroyPopup} />

<div
  class="fixed left-0 top-0 w-full h-full overflow-hidden"
  on:pointerdown={(e) => {
    e.preventDefault()
    e.stopPropagation()
    onDestroyPopup()
  }}
>
  <div
    class="drop-shadow-xl absolute"
    style={`left: ${x}px; top: ${y}px; width: ${width}; height: ${height}; background-color: ${bgColor}; color: ${fgColor};`}
    on:pointerdown={(e) => {
      e.stopPropagation()
    }}
  >
    <slot />
  </div>
</div>
