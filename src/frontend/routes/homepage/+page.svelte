<script>
  import { fetchGames } from 'frontend/utils/fetchJson'
  import Card from '../../components/GameCard.svelte'
  import Navbar from '../../components/NavBar.svelte'

  var games = []

  async function getAllGames() {
    const responseJson = await fetchGames('/api/games', {
      method: 'GET',
    })
    games = responseJson
    console.log(games)
  }
</script>

<Navbar />
{#each games as { id, name, description }}
  <Card>
    <img
      class="thumbnail"
      text-align="center"
      width="175"
      height="175"
      alt="game thumbnail"
      src="https://imgs.search.brave.com/_EV0HLkIlUJL5dDP09fpZZtngvKYC8zU9c8oTtpvtrU/rs:fit:600:600:1/g:ce/aHR0cHM6Ly9wYnMu/dHdpbWcuY29tL21l/ZGlhL0NaU0t1dGFV/Z0FFTl9RTi5wbmc"
    />

    <h3>{name}</h3>
    <h4>{description}</h4>
  </Card>
{/each}

<h1>List Games</h1>
<button on:click={getAllGames}>Get Games</button>
