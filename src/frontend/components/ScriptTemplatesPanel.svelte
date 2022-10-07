<script>
  import {
    blankScriptTemplate,
    scriptTemplateBank,
    scriptTemplateIndex,
  } from '%script/templates/ScriptTemplateBank.js'
  import MagnifyingGlass from 'icons/20/mini/magnifying-glass.svelte'
  import Plus from 'icons/20/mini/plus.svelte'

  export let onUseScript = undefined

  let searchQuery = ''
  let candidates = null
  let selectedTemplate = null,
    hoveredTemplate = null

  function handleSelectTemplate(template) {
    selectedTemplate = template
  }

  function handleHoverTemplate(template) {
    hoveredTemplate = template
  }

  function handleUnhoverTemplate() {
    hoveredTemplate = null
  }

  $: {
    const q = searchQuery.trim()
    if (q.length >= 3) {
      candidates = [blankScriptTemplate]
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
      candidates = [blankScriptTemplate, ...scriptTemplateBank]
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
      class="grow-0 shrink-0 flex flex-col w-full max-w-[256px] h-full border-r border-solid border-neutral-700 overflow-x-hidden overflow-y-auto"
    >
      {#each candidates as template, i}
        <button
          on:mouseenter={() => handleHoverTemplate(template)}
          on:mouseleave={handleUnhoverTemplate}
          on:click={() => handleSelectTemplate(template)}
          class={`grow-0 shrink-0 flex flex-row items-center justify-center p-2 cursor-pointer hover:bg-neutral-800 focus:bg-neutral-700 transition-all outline-0 text-left h-12 ${
            template === selectedTemplate ? 'bg-neutral-700' : ''
          } ${
            i < candidates.length - 1
              ? 'border-b border-solid border-neutral-700'
              : ''
          }`}
        >
          <div
            class="grow-1 shrink-1 w-full overflow-hidden whitespace-nowrap text-ellipsis"
          >
            {template.name}
          </div>
          {#if hoveredTemplate === template}
            <button
              on:click={() => onUseScript(template)}
              class="flex grow-0 shrink-0 p-1 items-center justify-center rounded-md bg-emerald-700 hover:bg-emerald-600 transition-all"
            >
              <div class="w-5 h-5"><Plus /></div>
            </button>
          {/if}
        </button>
      {/each}
    </div>
    <div
      class="grow-1 shrink-1 flex flex-col w-full h-full p-4 overflow-hidden"
    >
      {#if selectedTemplate}
        <div
          class="grow-1 shrink-1 w-full font-bold text-2xl overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {selectedTemplate.name}
        </div>
        <div
          class="grow-1 shrink-1 w-full h-full overflow-hidden text-ellipsis mt-4"
        >
          {selectedTemplate.description}
        </div>
      {/if}
    </div>
  </div>
</div>
