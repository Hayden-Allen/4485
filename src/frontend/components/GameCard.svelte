<div class="card">
  <slot />
</div>

<style>
  .card {
    display: inline-block;
    background: rgb(245, 245, 245);
    height: 25%;
    width: 250px;
    margin: 10px;
    border-radius: 6px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
    font-family: 'Brush Script MT', cursive;
    transition: transform 500ms ease;
  }

  .card:hover {
    transform: scale(1.05);
  }
</style>
