<script>
  import { global } from '%engine/Global.js'

  export let currentValue = undefined
  export let onApply = undefined

  function validate() {
    return currentValue.length > 0
  }

  function validateAndApply() {
    if (validate()) {
      onApply(currentValue)
    }
  }

  function handleKeyDown(e) {
    e.preventDefault()
    e.stopPropagation()
    currentValue = e.key
    validateAndApply()
  }
</script>

<input
  on:keydown={handleKeyDown}
  value=""
  placeholder={global.keyToDisplayStr(currentValue)}
  class="p-2 w-full h-full min-w-0 bg-inherit text-inherit"
/>

<style>
  /* Make placeholder appear same as actual value, since we only use placeholder and allow user to type over it */
  ::placeholder {
    color: rgb(212, 212, 212);
  }
</style>
