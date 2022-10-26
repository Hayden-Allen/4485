<script>
  import { fetchGames } from 'frontend/utils/fetchJson'
  import Card from '../../components/GameCard.svelte'
  import GameModal from '../../components/GameModal.svelte'
  import Navbar from '../../components/NavBar.svelte'
  // import Carousel from 'svelte-carousel'
  // Variables to get game names
  var games = []
  var clickedGameName
  var clickedGameId
  var clickedGameDesc

  // Variable for popup
  var isPopupOpen = false

  async function getAllGames() {
    const responseJson = await fetchGames('/api/games', {
      method: 'GET',
    })
    games = responseJson
    console.log(games)
  }

  // Function to perform all card click actions together
  function onCardClick(gamename, gamedescription, gameid) {
    storeClickedGameInfo(gamename, gamedescription, gameid)
    toggle()
  }

  function storeClickedGameInfo(name, description, id) {
    clickedGameDesc = description
    clickedGameName = name
    clickedGameId = id

    console.log(name, ',', description, ',', id)
  }

  // Toggle function for modal
  function toggle() {
    isPopupOpen = !isPopupOpen
  }
</script>

<div class="background">
  <Navbar />
  {#each games as { id, name, description }}
    <button class="Card-button" on:click={onCardClick(name, description, id)}>
      <Card class="card">
        <img
          class="thumbnail"
          text-align="center"
          width="175"
          height="175"
          alt="game thumbnail"
          src="https://imgs.search.brave.com/_EV0HLkIlUJL5dDP09fpZZtngvKYC8zU9c8oTtpvtrU/rs:fit:600:600:1/g:ce/aHR0cHM6Ly9wYnMu/dHdpbWcuY29tL21l/ZGlhL0NaU0t1dGFV/Z0FFTl9RTi5wbmc"
        />

        <h3>{name}</h3>
        <h3>{description}</h3>
        <div>
          <button
            ><a target="_blank" rel="noopener noreferrer" href="/edit">Play</a
            ></button
          >
          <button on:click={toggle}
            ><a target="_blank" rel="noopener noreferrer" href="/edit">Edit</a
            ></button
          >
        </div>
      </Card>
    </button>
  {/each}

  <h1>List Games</h1>
  <button on:click={getAllGames}>Get Games</button>

  <!-- Code for popup -->
  {#if isPopupOpen}
    <GameModal>
      <img
        text-align="center"
        width="300"
        height="300"
        class="thumbnail"
        alt="game thumbnail"
        src="https://imgs.search.brave.com/_EV0HLkIlUJL5dDP09fpZZtngvKYC8zU9c8oTtpvtrU/rs:fit:600:600:1/g:ce/aHR0cHM6Ly9wYnMu/dHdpbWcuY29tL21l/ZGlhL0NaU0t1dGFV/Z0FFTl9RTi5wbmc"
      />
      <h4>{clickedGameName}</h4>
      <h4>{clickedGameDesc}</h4>
      <div>
        <button
          ><a target="_blank" rel="noopener noreferrer" href="/edit">Play</a
          ></button
        >
        <button on:click={toggle}>Close</button>
      </div>
    </GameModal>
  {/if}
</div>

<style>
  .Card-button {
    border: #0f0f0f;
    background: #d9d9d905;
  }
  a {
    text-decoration: none;
    color: #0f0f0f;
  }
  .background {
    height: 100%;
    min-height: 100vh;
    background-color: white;
  }
</style>
