<svelte:options accessors />

<script>
  import EditorLayout from 'components/popup/layouts/EditorLayout.svelte'

  export let x = null,
    y = null,
    bgColor = null,
    fgColor = null,
    placeholderColor = null
  export let onDestroyPopup = null

  export let currentValue = null

  function handleKeyDown(event) {
    event.preventDefault()
    event.stopPropagation()
    currentValue = event.key
    onDestroyPopup()
  }
</script>

<EditorLayout
  {x}
  {y}
  {bgColor}
  {fgColor}
  {onDestroyPopup}
  width="96px"
  height="auto"
>
  <input
    on:keydown={handleKeyDown}
    value=""
    placeholder={currentValue}
    class="grow-1 shrink-1 p-2 w-full min-w-0 border-0 outline-0 bg-inherit text-inherit"
    style={`--placeholder-color: ${placeholderColor};`}
  />
</EditorLayout>

<style>
  ::placeholder {
    color: var(--placeholder-color);
  }
</style>
