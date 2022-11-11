<script>
  import { global } from '%engine/Global.js'

  export let currentValue = undefined
  export let onApply = undefined
  export let onFocus = undefined,
    onBlur = undefined

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

  function validate() {
    return isValidVariableName(currentValue)
  }

  function validateAndApply() {
    if (validate()) {
      onApply(currentValue)
    }
  }

  $: {
    updateItems(variables)
    if (!isValidVariableName(currentValue)) {
      if (items.length > 0) {
        currentValue = items[0].name
      } else {
        currentValue = ''
      }
      validateAndApply()
    }
  }
</script>

<select
  bind:this={inputEl}
  on:change={(e) => {
    currentValue = e.target.value
    validateAndApply()
  }}
  on:keydown={(e) => {
    if (e.key === 'Enter') {
      currentValue = e.target.value
      validateAndApply()
    }
  }}
  on:focus={onFocus}
  on:blur={onBlur}
  value={currentValue}
  class="p-2 w-full h-full min-w-0 border-0 outline-none bg-inherit text-inherit"
>
  {#each items as item}
    <option class="bg-neutral-900" value={item.name}>{item.name}</option>
  {/each}
</select>

<style>
  /* Make placeholder appear same as actual value, since we only use placeholder and allow user to type over it */
  ::placeholder {
    color: rgb(212, 212, 212);
  }
</style>
