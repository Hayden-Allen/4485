<div class="card">
  <div class="card-content">
    <slot />
  </div>
</div>

<style>
  .card {
    display: inline-block;
    background-color: #1e1e1e;
    height: 225px;
    width: 250px;
    margin: 10px;
    border-radius: 6px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
    font-family: 'Gilroy-Bold', sans-serif;
    color: white;
    transition: transform 1s ease;
    overflow: hidden;
  }

  .card-content {
    padding: 10px;
  }

  .card:hover {
    transform: scale(1.1);
    height: auto;
    width: 300px;
  }
</style>
