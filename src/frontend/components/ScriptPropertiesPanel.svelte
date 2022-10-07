<script>
  import { v4 as uuidv4 } from 'uuid'
  import { flip } from 'svelte/animate'
  import { dndzone } from 'svelte-dnd-action'
  import ScriptPropertiesGroup from 'components/ScriptPropertiesGroup.svelte'

  export let parentStateSelected = false
  export let states = undefined
  export let scripts = undefined
  export let onRearrangeScripts = undefined
  export let onEditScript = undefined
  export let onDeleteScript = undefined
  export let isLast = false

  let dndItems = undefined
  let hovered = false

  function handleConsider(e) {
    dndItems = e.detail.items
  }

  function handleFinalize(e) {
    onRearrangeScripts(e.detail.items.map((item) => item.script))
  }

  function updateDndItems() {
    dndItems = []
    for (const script of scripts) {
      dndItems.push({
        id: uuidv4(),
        script,
      })
    }
  }

  $: {
    updateDndItems(scripts)
  }
</script>

<div
  use:dndzone={{ items: dndItems, flipDurationMs: 100 }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  class="flex flex-col w-full h-full overflow-x-hidden overflow-y-auto -z-9999"
>
  {#if dndItems.length > 0}
    {#each dndItems as item, i (item.id)}
      <div
        class={`grow-0 shrink-0 w-full overflow-x-hidden ${
          parentStateSelected ? 'bg-[#1a1a1a]' : 'bg-neutral-900'
        }`}
        animate:flip={{ duration: 100 }}
      >
        <ScriptPropertiesGroup
          {states}
          script={item.script}
          onEditScript={() => onEditScript(item.script)}
          onDelete={() => onDeleteScript(item.script)}
          isLast={isLast && i === dndItems.length - 1}
          collapsed={item.script.collapsed}
          onToggleCollapsed={() =>
            (item.script.collapsed = !item.script.collapsed)}
        />
      </div>
    {/each}
  {:else}
    <div
      class={`grow-0 shrink-0 w-full h-48 overflow-hidden p-4 ${
        parentStateSelected ? 'bg-[#1a1a1a]' : 'bg-neutral-900'
      }`}
    >
      <div
        class={`grow-0 shrink-0 w-full h-full flex flex-col items-center justify-center overflow-hidden text-xl font-bold border-2 border-dashed rounded-lg transition-all ${
          hovered
            ? 'border-neutral-500 text-neutral-500'
            : 'border-neutral-600 text-neutral-600'
        }`}
      >
        <div>Add or drag a script</div>
      </div>
    </div>
  {/if}
</div>
