<script>
  import { onMount } from 'svelte'
  import fetchJson from 'frontend/utils/fetchJson.js'

  let doneLoading = false

  let username = undefined,
    password = undefined

  async function handleSignIn(event) {
    event.preventDefault()
    event.stopPropagation()
    try {
      await fetchJson('/api/user', {
        method: 'POST',
        body: {
          username,
          password,
        },
      })
      window.location.pathname = '/sign-in'
    } catch (err) {
      console.error(err)
      window.alert(
        'Unable to sign up. Username must contain at least 3 characters (no spaces) and password must contain at least 8. Try another username.'
      )
    }
  }

  onMount(async () => {
    try {
      const usersJson = await fetchJson('/api/user', {})
      if (usersJson.length !== 1) {
        throw new Error('usersJson.length !== 1')
      }
      window.location.pathname = '/my-account'
    } catch (err) {
      doneLoading = true
    }
  })
</script>

{#if doneLoading}
  <form
    on:submit={handleSignIn}
    class="flex flex-col w-full h-full items-center justify-center text-xl font-bold text-neutral-100 bg-neutral-900"
  >
    <input
      autofocus
      class="bg-neutral-800 border border-solid border-neutral-700 rounded-md px-2 py-1 mb-2 text-inherit min-w-0 w-[320px]"
      placeholder="Username"
      bind:value={username}
    />
    <input
      class="bg-neutral-800 border border-solid border-neutral-700 rounded-md px-2 py-1 mb-4 text-inherit  min-w-0 w-[320px]"
      type="password"
      placeholder="Password"
      bind:value={password}
    />
    <input
      class="bg-emerald-600 hover:bg-emerald-700 transition-all text-neutral-100 py-2 w-[320px] rounded-lg mb-4"
      type="submit"
      value="Sign Up"
    />
    <div class="text-sm font-normal italic">
      Already have an account? <a href="/sign-in" class="text-emerald-500"
        >Sign in</a
      >
    </div>
  </form>
{:else}
  <div
    class="flex flex-col w-full h-full items-center justify-center text-xl font-bold text-neutral-500 bg-neutral-900"
  >
    <div>Loading...</div>
  </div>
{/if}
