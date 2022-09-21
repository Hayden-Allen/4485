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

  export function validate() {
    return !isNaN(parseInt(currentValue))
  }

  $: {
    if (currentValue !== '') {
      const x = Math.round(currentValue)
      if (!isNaN(x)) {
        currentValue = x
      }
    }
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
    type="number"
    step="1"
    on:keydown={(event) => {
      if (event.key === 'Enter') {
        onDestroyPopup()
      }
    }}
    bind:value={currentValue}
    placeholder={currentValue}
    class="grow-1 shrink-1 p-2 w-full min-w-0 border-0 outline-0 bg-inherit text-inherit"
    style={`--placeholder-color: ${placeholderColor};`}
  />
</EditorLayout>

<style>
  ::placeholder {
    color: var(--placeholder-color);
  }

  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
    margin: 0;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
