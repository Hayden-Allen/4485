<script>
  export let currentValue = undefined
  export let onApply = undefined

  function validate() {
    return !isNaN(parseFloat(currentValue))
  }

  function validateAndApply() {
    if (validate()) {
      onApply(currentValue)
    }
  }

  $: {
    if (currentValue !== '') {
      const x = parseFloat(currentValue)
      if (!isNaN(x)) {
        currentValue = x
      }
    }
  }
</script>

<input
  on:change={validateAndApply}
  type="number"
  step="0.01"
  bind:value={currentValue}
  placeholder={currentValue}
  class="p-2 w-full h-full min-w-0 bg-inherit text-inherit"
/>

<style>
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
