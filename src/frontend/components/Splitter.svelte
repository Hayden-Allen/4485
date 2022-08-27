<script>
  export let split = undefined,
    minSplit = 0,
    maxSplit = 1,
    isVertical = false,
    context = undefined
  let mouseDown = false

  function computeSplit(e) {
    const parentRect = e.target.parentNode.getBoundingClientRect()
    if (isVertical) return (e.clientY - parentRect.y) / parentRect.height
    return (e.clientX - parentRect.x) / parentRect.width
  }
  function handleSplitterContextMenu(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleSplitterPointerDown(e) {
    if (e.button === 0) {
      handleSplitterContextMenu(e)
      e.target.setPointerCapture(e.pointerId)
      return true
    }
    return false
  }
  function handleSplitterPointerUp(e) {
    if (e.button === 0) {
      handleSplitterContextMenu(e)
      e.target.releasePointerCapture(e.pointerId)
    }
    return false
  }
</script>

<div
  class={`grow-0 shrink-0 ${
    isVertical ? 'w-full h-1 cursor-ns-resize' : 'w-1 h-full cursor-ew-resize'
  }`}
  on:contextmenu={handleSplitterContextMenu}
  on:pointerdown={(e) => (mouseDown = handleSplitterPointerDown(e))}
  on:pointerup={(e) => (mouseDown = handleSplitterPointerUp(e))}
  on:pointermove={(e) => {
    split = Math.max(
      minSplit,
      Math.min(mouseDown ? computeSplit(e) : split, maxSplit)
    )
    if (mouseDown) context.propagateResizeEvent()
  }}
/>
