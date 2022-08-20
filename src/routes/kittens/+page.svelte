<script>
  import fetchJson from '../../lib/frontend/fetchJson'

  let createKittenName = 'Test Kitten'

  async function handleSpawnClick() {
    const responseJson = await fetchJson('/api/kittens', {
      method: 'POST',
      body: {
        name: createKittenName,
      },
    })
    window.alert(`Successfully added a kitten named "${responseJson.name}" to the database!`)
  }
</script>

<input bind:value={createKittenName} />
<button on:click={handleSpawnClick}>Spawn a Kitten</button>
