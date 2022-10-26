<script>
  import { onMount } from 'svelte'
  import Viewport from './Viewport.svelte'
  import { Game } from '%engine/Game.js'
  import { Scene } from '%component/Scene.js'
  // import { SceneEntity, ControlledSceneEntity } from '%component/SceneEntity.js'
  import { ControlledSceneEntity } from '%component/SceneEntity.js'
  import { Vec2 } from '%util/Vec2.js'
  import { global } from '%engine/Global.js'
  import { Window } from '%window/Window.js'
  import { GameLayer } from '%engine/game/GameLayer.js'

  let canvas = undefined

  onMount(() => {})
</script>

<Viewport bind:canvas />
