<script>
  import { onMount } from 'svelte'
  import { fetchGames } from 'frontend/utils/fetchJson'
  import Card from '../../components/GameCard.svelte'
  import Navbar from '../../components/NavBar.svelte'

  // import Carousel from 'svelte-carousel'
  // Variables to get game names
  var games = []
  var clickedGameName
  var clickedGameId
  var clickedGameDesc
  const pagename = 'Home'

  // Variable for popup
  var isPopupOpen = false

  // Dynamically load game cards when page is loaded
  onMount(async () => {
    getAllGames()
  })

  async function getAllGames() {
    const responseJson = await fetchGames('/api/games', {
      method: 'GET',
    })
    games = responseJson
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
    <button class="Card-button">
      <Card>
        <img
          class="thumbnail"
          width="250wh"
          height="250vh"
          alt="game thumbnail"
          src="public\images\fenginx_logo.png"
        />

        <h3>{name}</h3>
        <p>{description}</p>
        <div>
          <button class="card-game-button" on:click={toggle}
            ><a target="_blank" rel="noopener noreferrer" href="/edit">Play</a
            ></button
          >
          <button class="card-game-button" on:click={toggle}
            ><a target="_blank" rel="noopener noreferrer" href="/edit">Edit</a
            ></button
          >
        </div>
      </Card>
    </button>
  {/each}

  <button
    class="Card-button"
    onclick="location.href = 'http://localhost:5173/addgames';"
  >
    <Card>
      <img
        class="thumbnail"
        width="250wh"
        height="250vh"
        alt="game thumbnail"
        src="public\images\add-game.png"
      />
      <h3>Add Custom Game</h3>
      <p>Have a custom game? Add it to our collection...</p>
    </Card>
  </button>
</div>

<style>
  .Card-button {
    border: black;
    background-color: #0f0f0f;
  }
  a {
    text-decoration: none;
    color: #0f0f0f;
  }
  .background {
    height: 100%;
    min-height: 100vh;
    background-color: #0f0f0f;
  }
  .text {
    color: white;
  }
  .card-game-button {
    font-weight: bold;
    font-family: 'Gilroy-Bold', sans-serif;
    width: 45%;
    border-radius: 25px;
    background-color: #c5ff4a;
  }
  .get-game-button {
    font-weight: bold;
    font-family: 'Gilroy-Bold', sans-serif;
    width: 10%;
    border-radius: 25px;
    background-color: #c5ff4a;
  }
</style>
