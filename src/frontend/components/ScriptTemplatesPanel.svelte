<script>
  import {
    scriptTemplateBank,
    scriptTemplateIndex,
  } from '%script/templates/ScriptTemplateBank.js'
  import MagnifyingGlass from 'icons/20/mini/magnifying-glass.svelte'
  import ArrowRight from 'icons/20/mini/arrow-right.svelte'

  export let onUseScript = undefined

  let searchQuery = ''
  let candidates = null
  let selectedTemplate = null

  function handleSelectTemplate(template) {
    selectedTemplate = template
  }

  $: {
    const q = searchQuery.trim()
    if (q.length >= 3) {
      candidates = []
      for (const result of scriptTemplateIndex.search(q)) {
        candidates.push(scriptTemplateBank[parseInt(result.ref)])
      }
      if (candidates.indexOf(selectedTemplate) === -1) {
        if (candidates.length > 0) {
          selectedTemplate = candidates[0]
        } else {
          selectedTemplate = null
        }
      }
    } else {
      candidates = scriptTemplateBank
      if (selectedTemplate === null) {
        selectedTemplate = candidates[0]
      }
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
      class="grow-1 shrink-1 p-2 pl-8 w-full min-w-0 border-0 outline-none bg-neutral-900"
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
      {#each candidates as template, i}
        <button
          on:click={() => handleSelectTemplate(template)}
          class={`flex flex-row items-center p-2 cursor-pointer hover:bg-neutral-700 focus:bg-neutral-700 outline-0 text-left ${
            template === selectedTemplate ? 'bg-neutral-700' : ''
          } ${
            i < candidates.length - 1
              ? 'border-b border-solid border-neutral-700'
              : ''
          }`}
        >
          {template.name}
        </button>
      {/each}
    </div>
    <div
      class="grow-1 shrink-1 flex flex-row w-full h-full p-4 overflow-hidden"
    >
      {#if selectedTemplate}
        <div class="grow-1 shrink-1 w-full">
          <div class="font-bold text-2xl mb-2">{selectedTemplate.name}</div>
          <div>{selectedTemplate.description}</div>
        </div>
        <div class="flex flex-col grow-0 shrink-0 w-56 ml-4">
          <img
            class="grow-0 shrink-0 w-full rounded-md"
            alt={`${selectedTemplate.name} script preview`}
            src="https://media2.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif"
          />
          <button
            on:click={() => onUseScript(selectedTemplate)}
            class="mt-4 relative rounded-full bg-sky-600 hover:bg-sky-700 transition-all font-bold w-full h-10"
          >
            <div
              class="absolute w-full"
              style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
            >
              Use This Script
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
