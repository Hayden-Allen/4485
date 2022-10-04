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
  export let states = null

  let inputEl = null
  let items = []

  function updateItems() {
    items = []
    for (const [key, value] of states) {
      items.push({
        name: key,
        state: value,
      })
    }
    items.sort((a, b) => (a.name > b.name ? 1 : -1))
  }

  onMount(() => {
    inputEl.focus()
    currentValue = items[0].name
  })

  $: {
    updateItems(states)
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
  <select
    bind:this={inputEl}
    on:change={(e) => {
      currentValue = e.target.value
      onDestroyPopup()
    }}
    value={currentValue}
    class="grow-1 shrink-1 p-2 w-full min-w-0 border-0 outline-0 bg-inherit text-inherit"
    style={`--placeholder-color: ${placeholderColor};`}
  >
    {#each items as item}
      <option value={item.name}>{item.name}</option>
    {/each}
  </select>
</EditorLayout>

<style>
  ::placeholder {
    color: var(--placeholder-color);
  }
</style>
