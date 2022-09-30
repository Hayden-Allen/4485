<svelte:options accessors />

<script>
  import { onMount } from 'svelte'
  import { global } from '%engine/Global.js'
  import EditorLayout from 'components/popup/layouts/EditorLayout.svelte'

  export let x = null,
    y = null,
    bgColor = null,
    fgColor = null,
    placeholderColor = null
  export let onDestroyPopup = null

  export let currentValue = null

  let inputEl = null

  export function validate() {
    return currentValue.length > 0
  }

  function handleKeyDown(event) {
    event.preventDefault()
    event.stopPropagation()
    currentValue = event.key
    onDestroyPopup()
  }

  onMount(() => {
    inputEl.focus()
  })
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
    bind:this={inputEl}
    on:keydown={handleKeyDown}
    value=""
    placeholder={global.keyToDisplayStr(currentValue)}
    class="grow-1 shrink-1 p-2 w-full min-w-0 border-0 outline-none bg-inherit text-inherit"
    style={`--placeholder-color: ${placeholderColor};`}
  />
</EditorLayout>

<style>
  ::placeholder {
    color: var(--placeholder-color);
  }
</style>
