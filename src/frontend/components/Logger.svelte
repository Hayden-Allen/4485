<script>
  import XCircle from 'icons/24/solid/x-circle.svelte'
  import ExclamationTriangle from 'icons/24/solid/exclamation-triangle.svelte'
  import CheckCircle from 'icons/24/solid/check-circle.svelte'

  export let errors = undefined
  export let graphIsEmpty = undefined

  const BASE_CLASSES =
    'w-full flex flex-row items-center p-2 rounded-md drop-shadow-md'
  const LEVEL_COLORS = {
    error: 'bg-rose-700 text-rose-100',
    warning: 'bg-yellow-500',
  }

  const INLINE_STYLES = {
    error: '',
    warning: 'color: #522A07',
  }

  let fadeOutToggle = 0
  $: {
    if (errors.length === 0) {
      fadeOutToggle ^= 1
    }
  }
</script>

<div
  class={`absolute bottom-0 right-0 w-[39%] max-h-full overflow-x-hidden overflow-y-auto ${
    errors.length === 0 ? 'pointer-events-none' : ''
  }`}
>
  <div class="flex flex-col w-full overflow-x-hidden p-4 space-y-2">
    {#each errors as error}
      <div
        class={`${BASE_CLASSES} ${LEVEL_COLORS[error.level]}`}
        style={INLINE_STYLES[error.level]}
      >
        <div class="inline-block w-6 h-6 mr-2">
          {#if error.level === 'error'}
            <XCircle />
          {:else if error.level === 'warning'}
            <ExclamationTriangle />
          {/if}
        </div>
        <span class="overflow-hidden text-ellipsis">{error.message}</span>
      </div>
    {/each}

    {#if !graphIsEmpty && errors.length === 0}
      <div
        class={`${BASE_CLASSES} bg-green-600 text-green-100`}
        style={`opacity: 0; animation: fade-out-toggle${fadeOutToggle} 2.5s;`}
      >
        <div class="inline-block w-6 h-6 mr-2">
          <CheckCircle />
        </div>
        <span class="overflow-hidden text-ellipsis">Compiled successfully!</span
        >
      </div>
    {/if}
  </div>
</div>
