<div class="game-modal">
  <div class="modal-content">
    <slot />
  </div>
</div>

<style>
  .game-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: black;
    border-radius: 5px;
    padding: 4px;
    box-shadow: 0px 5px 5px #4ae4ff;
  }

  .modal-content {
    font-weight: bold;
    background-color: #D9D9D905;
    color: white;
    align-items: center;
    font-family: 'Gilroy-Bold', sans-serif;
    padding: 15px;
  }
</style>
