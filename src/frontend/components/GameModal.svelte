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
    box-shadow: 2px 5px #888888;
  }

  .modal-content {
    font-weight: bold;
    align-items: center;
    font-family: 'Brush Script MT', cursive;
    padding: 15px;
  }
</style>
