<script>
  import { onMount } from 'svelte'

  import 'tailwind/app.css'

  let padRight = false

  onMount(() => {
    if (navigator.platform.toLowerCase().indexOf('mac') !== -1) {
      padRight = true
    }
  })
</script>

{#if padRight}
  <style>
    .mac-pad-right-fix-scrollbar {
      padding-right: 12px;
    }
  </style>
{/if}

<slot />
