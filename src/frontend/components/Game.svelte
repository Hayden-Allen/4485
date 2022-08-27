<script>
  import { onMount } from 'svelte'
  import Viewport from './Viewport.svelte'
  import { Game } from '%engine/Game.js'
  import { Scene } from '%component/Scene.js'
  import { SceneEntity, ControlledSceneEntity } from '%component/SceneEntity.js'
  import { Vec2 } from '%util/Vec2.js'
  import { global } from '%engine/Global.js'
  import { Window } from '%window/Window.js'
  import { GameLayer } from '%engine/game/GameLayer.js'

  let canvas = undefined

  onMount(() => {
    global.init()
    var game = new Game()

    var scene = new Scene()
    game.setCurrentScene(scene)
    const size = 10
    for (var y = 0; y < 500; y += size) {
      for (var x = 0; x < 500; x += size) {
        const red = parseInt((((x + y) * (x + y)) / 1000000) * 255)
        const color = `#${global.padZeroes(red.toString(16), 2)}0000`
        // create grid at z-index 0
        game.addStaticSceneEntity(
          new SceneEntity(
            new Vec2(x + 100, y + 100),
            new Vec2(size, size),
            color
          ),
          0
        )
      }
    }
    let playerController = {
      run: (player /* deltaTimeSeconds */) => {
        player.vel = new Vec2(
          global.input.isKeyPressed('d') - global.input.isKeyPressed('a'),
          global.input.isKeyPressed('s') - global.input.isKeyPressed('w')
        )
          .norm()
          .scale(500)
      },
    }
    let player = new ControlledSceneEntity(
      new Vec2(1000, 100),
      new Vec2(50, 50),
      '#0f0',
      { controllers: [playerController] }
    )
    // add player at z-index 1
    game.addControlledSceneEntity(player, 1)

    var window = new Window(canvas, '#000')
    window.pushLayer(new GameLayer(game))
    window.run()
  })
</script>

<Viewport bind:canvas />
