<script>
  import fetchJson from 'frontend/utils/fetchJson'

  let gameId = 1
  let gameName = 'Sample Game Name'
  let gameDescription = 'Description of Game in a couple of sentences'

  async function handleSpawnClick() {
    gameId = gameId + 1
    const responseJson = await fetchJson('/api/games', {
      method: 'POST',
      body: {
        id: gameId,
        name: gameName,
        description: gameDescription,
      },
    })
    window.alert(
      `Successfully added a game named "${responseJson.name}" to the database!`
    )
  }
</script>

<input bind:value={gameId} />
<br />
<input bind:value={gameName} />
<br />
<input bind:value={gameDescription} />
<br />
<button on:click={handleSpawnClick}>Create a Game</button>
