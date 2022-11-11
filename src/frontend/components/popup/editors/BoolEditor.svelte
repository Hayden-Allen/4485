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
  <select
    bind:this={inputEl}
    on:change={(e) => {
      currentValue = e.target.value === 'true' ? true : false
      onDestroyPopup()
    }}
    value={currentValue ? 'true' : 'false'}
    class="grow shrink p-2 w-full min-w-0 border-0 outline-0 bg-inherit text-inherit"
    style={`--placeholder-color: ${placeholderColor};`}
  >
    <option value="true">True</option>
    <option value="false">False</option>
  </select>
</EditorLayout>

<style>
  ::placeholder {
    color: var(--placeholder-color);
  }
</style>
