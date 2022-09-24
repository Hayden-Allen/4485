<svelte:options accessors />

<script>
  import { onMount } from 'svelte'
  import {
    NODE_CATEGORY_COLORS,
    scriptNodeTemplateBank,
  } from '%script/ScriptNodeTemplateBank.js'
  import ContextMenuLayout from 'components/popup/layouts/ContextMenuLayout.svelte'
  import MagnifyingGlass from 'icons/20/mini/magnifying-glass.svelte'

  export let x = undefined,
    y = undefined
  export let checkCanReposition = undefined
  export let onDestroyPopup = undefined

  export let onAddNode = undefined
  export let borderAlphaVarying = undefined

  export let searchQuery = ''

  let inputEl = undefined,
    containerEl = undefined
  let selectedCategory = 'all'
  let categories = []

  $: {
    const candidates = scriptNodeTemplateBank.getNodeTypeNames()
    const q = searchQuery.trim().replace(/\s/g, '').toLowerCase()
    if (q.length > 0) {
      for (let i = 0; i < candidates.length; ++i) {
        if (candidates[i].toLowerCase().indexOf(q) === -1) {
          candidates.splice(i, 1)
          --i
        }
      }
    }

    const categoriesMap = new Map()
    categoriesMap.set('all', {
      bgColor: NODE_CATEGORY_COLORS['all'].bgColor,
      borderColor: NODE_CATEGORY_COLORS['all'].borderColor,
      nodeNames: [],
    })
    const categoryAll = categoriesMap.get('all')
    for (const name of candidates) {
      const node = scriptNodeTemplateBank.get(name)
      if (!categoriesMap.has(node.category)) {
        categoriesMap.set(node.category, {
          bgColor: NODE_CATEGORY_COLORS[node.category].bgColor,
          borderColor: NODE_CATEGORY_COLORS[node.category].borderColor,
          nodeNames: [],
        })
      }

      const category = categoriesMap.get(node.category)
      category.nodeNames.push({
        dotColor: NODE_CATEGORY_COLORS[node.category].bgColor,
        name,
      })
      categoryAll.nodeNames.push({
        dotColor: NODE_CATEGORY_COLORS[node.category].bgColor,
        name,
      })
    }
    if (!categoriesMap.has(selectedCategory)) {
      selectedCategory = 'all'
    }

    categories = []
    for (const [key, value] of categoriesMap) {
      categories.push({
        name: key,
        ...value,
      })
    }
    categories.sort((a, b) => (a.name > b.name ? 1 : -1))
  }

  onMount(() => {
    inputEl.focus()

    containerEl.addEventListener('keydown', (e) => {
      console.log(e)
      if (e.key === 'Shift') searchQuery = ''
      else if (e.key === 'Escape') onDestroyPopup()
      else inputEl.focus()
    })
  })
</script>

<ContextMenuLayout
  {x}
  {y}
  {checkCanReposition}
  {onDestroyPopup}
  {borderAlphaVarying}
  width="400px"
  height="320px"
>
  <div
    bind:this={containerEl}
    class="flex flex-col w-full h-full overflow-hidden"
  >
    <div
      class="grow-0 shrink-0 flex flex-row border-b border-solid border-neutral-700 h-10"
    >
      <input
        bind:this={inputEl}
        bind:value={searchQuery}
        placeholder="Search..."
        class="grow-1 shrink-1 p-2 pl-8 w-full min-w-0 border-0 outline-0 bg-neutral-800 text-neutral-100"
      />
      <div
        class="absolute w-8 h-10 flex items-center justify-center text-neutral-500 pointer-events-none"
      >
        <MagnifyingGlass />
      </div>
    </div>
    <div class="flex flex-row grow-1 shrink-1 w-full h-full overflow-hidden">
      <div
        class="flex flex-col grow-0 shrink-0 w-[160px] h-full border-r border-solid border-neutral-700 overflow-x-hidden overflow-y-auto"
      >
        {#each categories as category}
          <button
            on:click={() => {
              selectedCategory = category.name
            }}
            class={`p-2 cursor-pointer hover:bg-neutral-700 focus:bg-neutral-700 outline-0 border-l-4 border-solid text-left transition-all`}
            style={`border-color: ${category.borderColor}; color: ${
              category.bgColor
            }; ${
              selectedCategory === category.name
                ? `background-color: ${category.bgColor}; color: #171717; font-weight: 700;`
                : ''
            }`}
          >
            {`${category.name[0].toUpperCase()}${category.name.slice(1)}`}
          </button>
        {/each}
      </div>
      <div
        class="flex flex-col grow-1 shrink-1 w-full h-full flex flex-col overflow-x-hidden overflow-y-auto"
      >
        {#each categories as category}
          {#if category.name === selectedCategory}
            {#each category.nodeNames as name}
              <button
                on:click={() => {
                  onAddNode(name.name)
                  onDestroyPopup()
                }}
                class="flex flex-row items-center p-2 cursor-pointer hover:bg-neutral-700 focus:bg-neutral-700 outline-0 text-left"
              >
                <div
                  class="grow-0 shrink-0 mr-2 w-[8px] h-[8px] rounded-full"
                  style={`background-color: ${name.dotColor}`}
                />
                <div
                  class="grow-1 shrink-1 overflow-hidden whitespace-nowrap text-ellipsis"
                >
                  {name.name}
                </div>
              </button>
            {/each}
          {/if}
        {/each}
      </div>
    </div>
  </div>
</ContextMenuLayout>
