<script>
  export let initialValue = undefined
  export let currentValue = undefined
  export let onApply = undefined
  export let onFocus = undefined,
    onBlur = undefined

  function validate() {
    return true
  }

  function validateAndApply() {
    if (validate()) {
      onApply(currentValue)
    }
  }
</script>

<input
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
/>

<style>
  /* Make placeholder appear same as actual value, since we only use placeholder and allow user to type over it */
  ::placeholder {
    color: rgb(212, 212, 212);
  }
</style>
