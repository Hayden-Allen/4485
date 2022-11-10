<script>
  import { onMount } from 'svelte'
  import fetchJson from 'frontend/utils/fetchJson.js'
  import Editor from 'components/Editor.svelte'
  import UserCircle from 'icons/24/outline/user-circle.svelte'

  export let data

  let projectTitle = undefined
  let firstLoadSerializedGameData = undefined

  onMount(async () => {
    try {
      const gamesList = await fetchJson('/api/game', {
        query: {
          gameId: data.gameId,
        },
      })
      if (gamesList.length === 1 && !!gamesList[0]) {
        if (
          typeof gamesList[0].serializedContent === 'string' &&
          gamesList[0].canEdit === true
        ) {
          firstLoadSerializedGameData = gamesList[0].serializedContent
          projectTitle = gamesList[0].name
        } else {
          window.alert(JSON.stringify(gamesList[0]))
          throw new Error('Missing serializedContent or cannot edit')
        }
      } else {
        throw new Error('gamesList.length !== 1')
      }
    } catch (err) {
      console.error(err)
      window.location.pathname = '/my-profile'
    }
  })
</script>

<div class="flex flex-col w-full h-full bg-neutral-900 overflow-hidden">
  {#if projectTitle}
    <div
      class="relative flex flex-row items-center w-full grow-0 shrink-0 border-b border-solid border-neutral-700 text-neutral-100 overflow-hidden"
    >
      <div
        class="font-bold grow-0 shrink-0 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[50%] overflow-hidden text-overflow-ellipsis whitespace-nowrap"
      >
        {projectTitle}
      </div>
      <div class="grow-1 shrink-1 w-full h-full" />
      <a
        class="group grow-0 shrink-0 h-full flex flex-row items-center justify-center p-3 border-l border-neutral-700 border-solid hover:bg-neutral-300 transition-all"
        href="/my-profile"
      >
        <div class="w-6 h-6 group-hover:text-neutral-900 transition-all">
          <UserCircle />
        </div>
      </a>
    </div>
  {/if}
  <div class="w-full h-full grow shrink overflow-hidden">
    {#if firstLoadSerializedGameData}
      <Editor {firstLoadSerializedGameData} />
    {:else}
      <div
        class="flex flex-col w-full h-full grow shrink items-center justify-center text-xl font-bold text-neutral-500"
      >
        <div>Loading...</div>
      </div>
    {/if}
  </div>
</div>
