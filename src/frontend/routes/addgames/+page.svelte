<script>
    import fetchJson from 'frontend/utils/fetchJson'

    let gameId = 0
    let gameName = 'Sample Game Name'
    let gameDescription = "Sample Game Description"

    async function handleSpawnClick() {
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
  <br/>
  <input bind:value={gameName} />
  <br/>
  <input bind:value={gameDescription} />
  <br/>
  <button on:click={handleSpawnClick}>Create a Game</button>
  