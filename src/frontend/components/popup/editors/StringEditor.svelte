<svelte:options accessors />

<script>
  import { onMount } from 'svelte'
  import EditorLayout from 'components/popup/layouts/EditorLayout.svelte'

  export let x = null,
    y = null,
    bgColor = null,
    fgColor = null,
    placeholderColor = null
  export let onDestroyPopup = null

  export let currentValue = null

  let inputEl = null

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
  width="128px"
  height="auto"
>
  <input
    bind:this={inputEl}
    bind:value={currentValue}
    on:change={onDestroyPopup}
    class="grow shrink p-2 w-full min-w-0 border-0 outline-none bg-inherit text-inherit"
    style={`--placeholder-color: ${placeholderColor};`}
  />
</EditorLayout>

<style>
  ::placeholder {
    color: var(--placeholder-color);
  }
</style>
