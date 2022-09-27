<script>
  import {
    behaviorInfoBank,
    behaviorInfoIndex,
  } from '%behaviors/BehaviorInfoBank.js'
  import MagnifyingGlass from 'icons/20/mini/magnifying-glass.svelte'
  import ArrowRight from 'icons/20/mini/arrow-right.svelte'

  export let onUseBehavior = undefined

  let searchQuery = ''
  let candidates = null
  let selectedInfo = null

  function handleSelectInfo(info) {
    selectedInfo = info
    console.log(info)
  }

  $: {
    const q = searchQuery.trim()
    if (q.length >= 3) {
      candidates = []
      for (const result of behaviorInfoIndex.search(q)) {
        candidates.push(behaviorInfoBank[parseInt(result.ref)])
      }
      if (candidates.indexOf(selectedInfo) === -1) {
        if (candidates.length > 0) {
          selectedInfo = candidates[0]
        } else {
          selectedInfo = null
        }
      }
    } else {
      candidates = behaviorInfoBank
      selectedInfo = candidates[0]
    }
  }
</script>

<div class="flex flex-col w-full h-full overflow-hidden">
  <div
    class="grow-0 shrink-0 flex flex-row border-b border-solid border-neutral-700 h-10"
  >
    <input
      bind:value={searchQuery}
      placeholder="Search..."
      class="grow-1 shrink-1 p-2 pl-8 w-full min-w-0 border-0 outline-0 bg-neutral-900 text-neutral-100"
    />
    <div
      class="absolute w-8 h-10 flex items-center justify-center text-neutral-500 pointer-events-none"
    >
      <MagnifyingGlass />
    </div>
  </div>

  <div class="grow-1 shrink-1 flex flex-row w-full h-full overflow-hidden">
    <div
      class="grow-0 shrink-0 flex flex-col w-64 h-full border-r border-solid border-neutral-700"
    >
      {#each candidates as info, i}
        <button
          on:click={() => handleSelectInfo(info)}
          class={`flex flex-row items-center p-2 cursor-pointer hover:bg-neutral-700 focus:bg-neutral-700 outline-0 text-left ${
            info === selectedInfo
              ? 'bg-neutral-700 text-neutral-100'
              : 'text-neutral-300'
          } ${
            i < candidates.length - 1
              ? 'border-b border-solid border-neutral-700'
              : ''
          }`}
        >
          {info.name}
        </button>
      {/each}
    </div>
    <div
      class="grow-1 shrink-1 flex flex-row w-full h-full p-4 overflow-hidden text-neutral-300"
    >
      {#if selectedInfo}
        <div class="grow-1 shrink-1 w-full">
          <div class="font-bold text-2xl mb-2">{selectedInfo.name}</div>
          <div>{selectedInfo.description}</div>
        </div>
        <div class="flex flex-col grow-0 shrink-0 w-56 ml-4">
          <img
            class="grow-0 shrink-0 w-full rounded-md"
            alt={`${selectedInfo.name} behavior preview`}
            src="https://media2.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif"
          />
          <button
            on:click={() => onUseBehavior(selectedInfo)}
            class="mt-4 relative rounded-full bg-sky-600 font-bold w-full h-10"
          >
            <div
              class="absolute w-full"
              style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
            >
              Use This Behavior
            </div>
            <div
              class="absolute w-5 h-5"
              style="top: 50%; right: 0; transform: translate(-16px, -50%);"
            >
              <ArrowRight />
            </div>
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
