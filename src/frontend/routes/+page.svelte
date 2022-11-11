<script>
  import { onMount } from 'svelte'
  import fetchJson from 'frontend/utils/fetchJson.js'
  import UserCircle from 'icons/24/outline/user-circle.svelte'

  let gamesList = undefined

  async function refreshGamesList() {
    gamesList = await fetchJson('/api/game', {
      query: {
        isMetaOnly: true,
        isPublicOnly: true,
      },
    })
  }

  onMount(async () => {
    try {
      await refreshGamesList()
    } catch (err) {
      console.error(err)
      window.alert('Unable to load games; please refresh the page.')
      gamesList = null
    }
  })
</script>

{#if gamesList}
  <div class="flex flex-col w-full h-full bg-neutral-900 overflow-hidden">
    <div
      class="relative flex flex-row items-center w-full grow-0 shrink-0 border-b border-solid border-neutral-700 text-neutral-100 overflow-hidden"
    >
      <div
        class="font-bold grow-0 shrink-0 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[50%] overflow-hidden text-overflow-ellipsis whitespace-nowrap"
      >
        Recent Games
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
    <div class="w-full h-full grow shrink overflow-hidden">
      <div
        class="flex flex-col w-full h-full grow shrink items-center text-xl font-bold text-neutral-100 p-8 overflow-x-hidden overflow-y-auto"
      >
        {#each gamesList as game, i}
          <div
            class={`flex flex-col w-[640px] p-4 ${
              i < gamesList.length - 1 ? 'mb-4' : ''
            } bg-neutral-700 w-full grow-0 shrink-0 justify-center`}
          >
            <a
              data-sveltekit-reload
              href={`/play/${game._id}`}
              class="w-full grow shrink overflow-hidden text-overflow-ellipsis whitespace-nowrap hover:underline mb-1"
            >
              {game.name}
            </a>
            <div class="text-sm font-normal italic text-neutral-300">
              Created by {game.creatorName}
            </div>
          </div>
        {/each}
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
