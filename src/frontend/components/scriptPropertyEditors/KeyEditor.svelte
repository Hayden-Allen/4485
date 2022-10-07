<script>
  import { global } from '%engine/Global.js'

  export let currentValue = undefined
  export let onApply = undefined
  export let onFocus = undefined,
    onBlur = undefined

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
    currentValue = e.key.length === 1 ? e.key.toUpperCase() : e.key
    validateAndApply()
  }
</script>

<input
  on:keydown={handleKeyDown}
  on:focus={onFocus}
  on:blur={onBlur}
  value=""
  placeholder={global.keyToDisplayStr(currentValue)}
  class="p-2 w-full h-full min-w-0 border-0 outline-none bg-inherit text-inherit"
/>

<style>
  /* Make placeholder appear same as actual value, since we only use placeholder and allow user to type over it */
  ::placeholder {
    color: rgb(212, 212, 212);
  }
</style>
