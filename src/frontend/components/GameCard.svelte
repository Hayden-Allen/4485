<div class="card">
  <div class="card-content">
    <slot />
  </div>
</div>

<style>
  .card {
    display: inline-block;
    background-color: #1E1E1E;
    height: 25%;
    width: 250px;
    margin: 10px;
    border-radius: 6px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
    font-family: 'Gilroy-Bold', sans-serif;
    color: white;
    transition: transform 500ms ease;
  }

  .card-content {
    padding: 10px;
  }

  .card:hover {
    transform: scale(1.05);
  }
</style>
