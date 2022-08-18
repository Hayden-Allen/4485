<script>
  import fetchJson from '../../lib/frontend/fetchJson'

  let createKittenName = 'Test Kitten'

  async function handleSpawnClick() {
    await fetchJson('/kittens', {
      method: 'POST',
      body: {
        name: createKittenName,
      },
    })
  }
</script>

<input bind:value={createKittenName} />
<button on:click={handleSpawnClick}>Spawn a Kitten</button>
