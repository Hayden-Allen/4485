<script>
  import { onMount } from 'svelte'
  import fetchJson from 'frontend/utils/fetchJson.js'

  let signedOut = false

  onMount(async () => {
    try {
      await fetchJson('/api/auth/logout', { method: 'POST' })
      signedOut = true
      window.location.pathname = '/sign-in'
    } catch (err) {
      console.error(err)
      window.alert('Unable to sign out')
      signedOut = false
    }
  })
</script>

{#if signedOut}
  <div
    class="flex flex-col w-full h-full items-center justify-center text-xl font-bold text-neutral-500 bg-neutral-900"
  >
    <div>Done! Redirecting...</div>
  </div>
{:else}
  <div
    class="flex flex-col w-full h-full items-center justify-center text-xl font-bold text-neutral-500 bg-neutral-900"
  >
    <div>Loading...</div>
  </div>
{/if}
