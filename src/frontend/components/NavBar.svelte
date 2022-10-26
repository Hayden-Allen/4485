<script>
  function handleSearch() {
    window.alert('Clicked on Search')
  }

  function handleLogin() {
    window.alert('Clicked on Login')
  }
</script>

<div class="navbar">
  <div class="navbar-content">
    <h4 class="navbar-pages"><a href="/homepage">Home</a></h4>
  </div>
  <div class="navbar-content">
    <h4 class="navbar-pages"><a href="/about">About</a></h4>
  </div>
  <div class="navbar-content">
    <h4 class="navbar-pages"><a href="/trending">Trending</a></h4>
  </div>
  <div class="navbar-content">
    <h4 class="navbar-pages"><a href="/gamelist">Games</a></h4>
  </div>
  <div class="navbar-content">
    <h4 class="navbar-pages"><a href="/addgames">Add Game</a></h4>
  </div>
  <div class="navbar-content">
    <h4 class="navbar-pages"><a href="/edit">Create</a></h4>
  </div>
  <div class="navbar-content">
    <h4 class="navbar-pages"><a href="/leaderboard">Leaderboard</a></h4>
  </div>
  <div class="navbar-right">
    <h4 class="navbar-pages"><a href="/" on:click={handleLogin}>Login</a></h4>
  </div>
  <div class="navbar-right">
    <h4 class="navbar-pages"><a href="/" on:click={handleSearch}>Search</a></h4>
  </div>
</div>



<style>
  .navbar {
    display: inline-block;
    background: #0F0F0F;
    height: 5%;
    width: 100%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
    font-family: 'Gilroy-Bold', sans-serif;
  }
  .navbar-content {
    padding: 0.5% 0% 0% 2% !important;
    border: none;
    vertical-align: middle;
    height: 48px;
    line-height: 48px;
    float: left;
  }
  a {
    text-decoration: none;
    color: #FFFFFF;
  }
  .navbar-right {
    padding: 0.5% 1% 0% 2% !important;
    border: none;
    vertical-align: middle;
    height: 48px;
    line-height: 48px;
    float: right;
  }
</style>
