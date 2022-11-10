<script>
  import { onMount } from 'svelte'
  import fetchJson from 'frontend/utils/fetchJson.js'
  import Player from 'components/Player.svelte'
  import UserCircle from 'icons/24/outline/user-circle.svelte'

  export let data

  let firstLoadGameInfo = undefined

  onMount(async () => {
    try {
      const gamesList = await fetchJson('/api/game', {
        query: {
          gameId: data.gameId,
        },
      })
      if (gamesList.length === 1 && !!gamesList[0]) {
        if (typeof gamesList[0].serializedContent === 'string') {
          firstLoadGameInfo = gamesList[0]
        } else {
          throw new Error('Missing serializedContent')
        }
      } else {
        throw new Error('gamesList.length !== 1')
      }
    } catch (err) {
      console.error(err)
      window.alert(
        'Unable to load game; make sure you copied the link correctly and refresh the page.'
      )
    }
  })
</script>

<div class="flex flex-col w-full h-full bg-neutral-900 overflow-hidden">
  {#if firstLoadGameInfo}
    <div
      class="relative flex flex-row items-center w-full grow-0 shrink-0 border-b border-solid border-neutral-700 text-neutral-100 overflow-hidden"
    >
      <div
        class="font-bold grow-0 shrink-0 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[50%] overflow-hidden text-overflow-ellipsis whitespace-nowrap"
      >
        {firstLoadGameInfo.name}
      </div>
      <div class="grow-1 shrink-1 w-full h-full" />
      <a
        class="group grow-0 shrink-0 h-full flex flex-row items-center justify-center p-3 border-l border-neutral-700 border-solid hover:bg-neutral-300 transition-all"
        href="/my-account"
      >
        <div class="w-6 h-6 mr-2 group-hover:text-neutral-900 transition-all">
          <UserCircle />
        </div>
        <div class="group-hover:text-neutral-900 transition-all">
          My Account
        </div>
      </a>
    </div>
  {/if}
  <div class="w-full h-full grow shrink overflow-hidden">
    {#if firstLoadGameInfo && firstLoadGameInfo.serializedContent}
      <Player
        firstLoadSerializedGameData={firstLoadGameInfo.serializedContent}
      />
    {:else}
      <div
        class="flex flex-col w-full h-full grow shrink items-center justify-center text-xl font-bold text-neutral-500"
      >
        <div>Loading...</div>
      </div>
    {/if}
  </div>
</div>
