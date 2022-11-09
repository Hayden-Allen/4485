<script>
  import NavBar from '../../components/NavBar.svelte'

  const devs = [
    { name: 'George Goodman', role: 'Game Engine Developer' },
    { name: 'Hayden Allen', role: 'Game Engine Devleoper' },
    { name: 'Ruben Thomas', role: 'UI/UX Developer' },
    { name: 'Matthew Vu', role: 'UI/UX Developer' },
    { name: 'Jafar Ali', role: 'UI/UX Developer' },
  ]
</script>

<div class="background">
  <NavBar />

  <div class="about-section">
    <h1 class="text" style="text-align: center;">About Us</h1>

    <p class="text" style="padding: 10px;">
      We aim to provide non-technical users with a means to implement their own
      2D arcade-style game ideas. Our product will be a web-based turnkey
      solution for no-code game development, with primary attention being given
      to a WYSIWYG level editor, a minimalist, no-code trigger/action system for
      defining entity behaviors, and a hosting platform serving a live,
      playable-in-browser instance of published games at a public URL.
    </p>
  </div>

  <div class="team-section">
    <h1 class="text" style="text-align: center;">Meet the Team</h1>
    {#each devs as dev, index}
      <div class="profile">
        <img
          class="profile-img"
          src="public\images\Profile_pic.jpg"
          alt="prof_pic_{index}"
        />
        <h3 class="text">{dev.name}</h3>
        <h7 class="text italic">{dev.role}</h7>
      </div>
    {/each}
  </div>

  <div />
</div>

<style>
  .background {
    height: 100%;
    min-height: 100vh;
    background-color: #0f0f0f;
  }
  .text {
    color: white;
  }
  .profile {
    display: inline-block;
    padding-top: 35px;
    text-align: center;
  }
  .profile-img {
    border-radius: 200px;
    max-width: 50%;
    max-height: 50%;
    border: 5px solid #00fff0;
  }
  .italic {
    font-style: italic;
  }
  .about-section {
    padding: 10px;
    border: 3px solid #ff7a00;
    border-radius: 10px;
    margin: 10px;
  }
  .team-section {
    margin: 10px;
    border: 3px solid #ff7a00;
    border-radius: 10px;
  }
</style>
