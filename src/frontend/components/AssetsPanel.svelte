<script>
  import AnimationTemplatesPanel from 'components/AnimationTemplatesPanel.svelte'

  let categories = ['Prefabs', 'Animations', 'Sounds']
  let selectedCategory = 'Animations'

  function handleSelectCategory(category) {
    selectedCategory = category
  }
</script>

<div class="grow-1 shrink-1 flex flex-col w-full h-full overflow-hidden">
  <div
    class="grow-0 shrink-0 flex flex-row w-full border-b border-solid border-neutral-700 overflow-x-hidden overflow-y-auto"
  >
    {#each categories as category}
      <button
        on:click={() => handleSelectCategory(category)}
        class={`grow-0 shrink-0 flex flex-row items-center p-2 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis focus:bg-neutral-700 transition-all outline-0 text-left h-12 border-r border-solid border-neutral-700 ${
          category === selectedCategory
            ? 'bg-neutral-700'
            : 'hover:bg-neutral-800'
        }`}
      >
        {category}
      </button>
    {/each}
  </div>
  <div class="grow-1 shrink-1 w-full h-full overflow-hidden">
    {#if selectedCategory === 'Prefabs'}
      <!-- TODO -->
    {:else if selectedCategory === 'Animations'}
      <AnimationTemplatesPanel />
    {:else if selectedCategory === 'Sounds'}
      <!-- TODO -->
    {/if}
  </div>
</div>
