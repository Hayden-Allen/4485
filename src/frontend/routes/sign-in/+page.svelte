<script>
  import fetchJson from 'frontend/utils/fetchJson.js'

  let username = undefined,
    password = undefined

  async function handleSignIn(event) {
    event.preventDefault()
    event.stopPropagation()
    try {
      await fetchJson('/api/auth/login', {
        method: 'POST',
        body: {
          username,
          password,
        },
      })
      window.location.pathname = '/my-profile'
    } catch (err) {
      console.error(err)
      window.alert(
        'Unable to sign in. Please make sure you entered the correct username and password.'
      )
    }
  }
</script>

<form
  on:submit={handleSignIn}
  class="flex flex-col w-full h-full items-center justify-center text-xl font-bold text-neutral-100 bg-neutral-900"
>
  <input
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
    class="bg-emerald-600 hover:bg-emerald-700 transition-all text-neutral-100 py-2 w-[320px] rounded-lg"
    type="submit"
    value="Sign In"
  />
</form>
