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
  export let variables = null

  let inputEl = null
  let items = []

  function updateItems() {
    items = []
    for (const [key, value] of variables) {
      items.push({
        name: key,
        variable: value,
      })
    }
    global.alphabetSort(items)
  }

  function isValidVariableName(variable) {
    return variables.has(variable)
  }

  export function validate() {
    return isValidVariableName(currentValue)
  }

  onMount(() => {
    inputEl.focus()
  })

  $: {
    updateItems(variables)
    if (!validate()) {
      if (items.length > 0) {
        currentValue = items[0].name
      } else {
        currentValue = ''
      }
    }
  }
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
      currentValue = e.target.value
      onDestroyPopup()
    }}
    value={currentValue}
    class="grow shrink p-2 w-full min-w-0 border-0 outline-0 bg-inherit text-inherit"
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
