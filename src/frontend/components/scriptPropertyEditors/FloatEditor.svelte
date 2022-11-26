<script>
  export let initialValue = undefined
  export let currentValue = undefined
  export let onApply = undefined
  export let onFocus = undefined,
    onBlur = undefined

  function validate() {
    return !isNaN(parseFloat(currentValue))
  }

  function validateAndApply() {
    if (validate()) {
      onApply(parseFloat(currentValue))
      initialValue = currentValue
    } else {
      currentValue = initialValue
    }
  }
</script>

<input
  on:change={validateAndApply}
  on:keydown={(event) => {
    if (event.key === 'Enter') {
      validateAndApply()
    }
  }}
  on:focus={onFocus}
  on:blur={onBlur}
  bind:value={currentValue}
  class="p-2 w-full h-full min-w-0 border-0 outline-none bg-inherit text-inherit"
/>
