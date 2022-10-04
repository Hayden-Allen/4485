<script>
  import { v4 as uuidv4 } from 'uuid'
  import { flip } from 'svelte/animate'
  import { dndzone } from 'svelte-dnd-action'
  import ScriptPropertiesGroup from 'components/ScriptPropertiesGroup.svelte'
  import Plus from 'icons/20/mini/plus.svelte'

  export let scripts = undefined
  export let onRearrangeScripts = undefined
  export let onEditScript = undefined
  export let onDeleteScript = undefined
  export let isLast = false
  export let onAddScript = undefined

  let dndItems = undefined

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
  class="flex flex-col w-full h-full overflow-x-hidden overflow-y-auto"
>
  {#each dndItems as item, i (item.id)}
    <div
      class="grow-0 shrink-0 overflow-x-hidden bg-neutral-900"
      animate:flip={{ duration: 100 }}
    >
      <ScriptPropertiesGroup
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
</div>
<button
  on:click={onAddScript}
  class="grow-0 shrink-0 ml-4 relative rounded-full bg-sky-600 hover:bg-sky-700 transition-all font-bold w-52 h-10"
>
  <div
    class="absolute w-full"
    style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
  >
    New Script
  </div>
  <div
    class="absolute w-5 h-5"
    style="top: 50%; right: 0; transform: translate(-16px, -50%);"
  >
    <Plus />
  </div>
</button>
