<script>
  import { onMount } from 'svelte'
  import fetchJson from 'frontend/utils/fetchJson.js'
  import ArrowLeftOnRectangle from 'icons/24/outline/arrow-left-on-rectangle.svelte'
  import { Context } from '%engine/Context.js'
  import { Game } from '%engine/Game.js'
  import { Scene } from '%component/Scene.js'

  let userInfo = undefined
  let gamesList = undefined

  async function refreshGamesList() {
    gamesList = await fetchJson('/api/game', {
      query: {
        creatorId: userInfo.id,
      },
    })
  }

  async function handleNewGame() {
    let name = window.prompt('Game name:')
    if (name) {
      name = name.trim()
    }
    if (!name) {
      return
    }

    let created = false
    try {
      const game = new Game(new Context())
      game.setCurrentScene(new Scene())
      const serializedContent = game.serialize(name)

      await fetchJson('/api/game', {
        method: 'POST',
        body: {
          isPublic: true,
          name,
          serializedContent,
        },
      })
      created = true
    } catch (err) {
      console.error(err)
      window.alert('Unable to create new game')
    }

    if (created) {
      try {
        await refreshGamesList()
      } catch (err) {
        console.error(err)
        window.alert(
          'Game created but unable to refresh games list. Please refresh the page.'
        )
      }
    }
  }

  onMount(async () => {
    try {
      const usersJson = await fetchJson('/api/user', {})
      if (usersJson.length !== 1) {
        throw new Error('usersJson.length !== 1')
      }
      userInfo = usersJson[0]
      await refreshGamesList()
    } catch (err) {
      console.error(err)
      userInfo = null
      gamesList = null
      window.location.pathname = '/sign-in'
    }
  })
</script>

{#if userInfo && gamesList}
  <div class="flex flex-col w-full h-full bg-neutral-900 overflow-hidden">
    <div
      class="relative flex flex-row items-center w-full grow-0 shrink-0 border-b border-solid border-neutral-700 text-neutral-100 overflow-hidden"
    >
      <div
        class="font-bold grow-0 shrink-0 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[50%] overflow-hidden text-overflow-ellipsis whitespace-nowrap"
      >
        {userInfo.username}
      </div>
      <div class="grow-1 shrink-1 w-full h-full" />
      <a
        class="group grow-0 shrink-0 h-full flex flex-row items-center justify-center p-3 border-l border-neutral-700 border-solid hover:bg-neutral-300 transition-all"
        href="/sign-out"
      >
        <div class="w-6 h-6 mr-2 group-hover:text-neutral-900 transition-all">
          <ArrowLeftOnRectangle />
        </div>
        <div class="group-hover:text-neutral-900 transition-all">Sign Out</div>
      </a>
    </div>
    <div class="w-full h-full grow shrink overflow-hidden">
      <div
        class="flex flex-col w-full h-full grow shrink items-center text-xl font-bold text-neutral-100 p-8 overflow-x-hidden overflow-y-auto"
      >
        {#each gamesList as game, i}
          <a
            href={`/edit/${game._id}`}
            class="w-[640px] p-4 mb-4 bg-neutral-700 hover:underline overflow-hidden text-overflow-ellipsis whitespace-nowrap"
            >{game.name}</a
          >
        {/each}
        <button
          on:click={handleNewGame}
          class="w-[640px] p-4 mb-4 bg-neutral-700 hover:underline overflow-hidden text-overflow-ellipsis whitespace-nowrap text-left"
          >New Game</button
        >
      </div>
    </div>
  </div>
{:else}
  <div
    class="flex flex-col w-full h-full items-center justify-center text-xl font-bold text-neutral-500 bg-neutral-900"
  >
    <div>Loading...</div>
  </div>
{/if}
