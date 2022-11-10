<script>
  import Select from 'svelte-select'

  const gameOptions = [
    { id: 0, option: 'All Games', endpoint: '/gamelist', target: '', rel: '' },
    { id: 1, option: 'Add Game', endpoint: '/addgames', target: '', rel: '' },
    {
      id: 2,
      option: 'Create',
      endpoint: '/edit',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ]

  function handleSearch() {
    window.alert('Clicked on Search')
  }

  function handleLogin() {
    window.alert('Clicked on Login')
  }
</script>

<div class="navbar">
  <div class="navbar-content">
    <h4 class="navbar-pages">
      <a href="/homepage">Home</a>
    </h4>
  </div>
  <!-- <div class="navbar-logo">
    <img src="public\images\fenginx_logo_white.png" alt="logo" />
    <h6>FENGINX</h6>
  </div> -->
  <div class="navbar-content">
    <h4 class="navbar-pages"><a href="/about">About</a></h4>
  </div>
  <div class="navbar-content">
    <h4 class="navbar-pages"><a href="/gamelist">Games</a></h4>
  </div>
  <div class="navbar-content">
    <h4 class="navbar-pages">
      <a target="_blank" rel="noopener noreferrer" href="/edit">Create</a>
    </h4>
  </div>
  <div class="navbar-right">
    <h4 class="navbar-pages"><a href="/" on:click={handleLogin}>Login</a></h4>
  </div>
  <div class="navbar-search">
    <input
      type="search"
      name="Search"
      label="search"
      placeholder="Search Games"
    />
  </div>
</div>

<style>
  .navbar {
    display: inline-block;
    background: #0f0f0f;
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
  .navbar-logo {
    padding: 0.5% 0% 0% 2% !important;
    border: none;
    vertical-align: middle;
    height: 48px;
    line-height: 48px;
    float: left;
  }
  a {
    text-decoration: none;
    color: #ffffff;
  }
  .navbar-right {
    padding: 0.5% 1% 0% 2% !important;
    border: none;
    vertical-align: middle;
    height: 48px;
    line-height: 48px;
    float: right;
  }
  .navbar-search {
    padding: 0.5% 1% 0% 2% !important;
    border: none;
    vertical-align: middle;
    line-height: 25px;
    float: right;
  }
  input[type='search'] {
    border-radius: 25px;
    font-size: 1.2rem;
    padding-left: 15px;
  }
</style>
