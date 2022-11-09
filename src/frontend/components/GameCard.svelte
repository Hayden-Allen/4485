<div class="card">
  <div>
    <slot />
  </div>
</div>

<style>
  .card {
    display: grid;
    grid-template-columns: auto auto auto;
    background-color: #1e1e1e;
    height: 285px;
    width: 250px;
    margin: 10px;
    border-radius: 6px;
    font-family: 'Gilroy-Bold', sans-serif;
    color: white;
    transition: transform 1s ease;
    overflow: hidden;
  }

  .card:hover {
    transform: scale(1.1);
    height: auto;
    width: 300px;
  }
</style>
