<script>
  import ScriptPropertiesPanel from 'components/ScriptPropertiesPanel.svelte'
  import ChevronRight from 'icons/20/mini/chevron-right.svelte'
  import Pencil from 'icons/20/mini/pencil.svelte'
  import Trash from 'icons/20/mini/trash.svelte'
  import Plus from 'icons/20/mini/plus.svelte'

  export let states = undefined
  export let selectedState = undefined
  export let onSelectState = undefined
  export let onRenameState = undefined
  export let onDeleteState = undefined
  export let onEditScript = undefined
  export let onAddState = undefined

  let items = undefined

  function updateItems() {
    items = []
    for (const [key, value] of states) {
      items.push({
        name: key,
        state: value,
      })
    }
    items.sort((a, b) => (a.name > b.name ? 1 : -1))
  }

  $: {
    updateItems(states)
  }
</script>

<div class="grow-0 shrink-0 flex flex-col overflow-x-hidden">
  {#each items as item}
    <div
      class="grow-0 shrink-0 flex flex-col overflow-x-hidden"
      on:click={() => onSelectState(item.name, item.state)}
    >
      <button
        class={`${
          item.state === selectedState
            ? 'bg-neutral-100 text-neutral-900'
            : 'bg-neutral-800'
        } flex flex-row grow-0 shrink-0 w-full overflow-x-hidden text-left`}
        on:click={() => (item.state.collapsed = !item.state.collapsed)}
      >
        <div
          class="flex flex-row w-full grow-1 shrink-1 p-2 overflow-hidden font-bold"
        >
          <div
            class={`grow-0 shrink-0 w-5 h-5 mr-2 transition-all duration-75 ${
              item.state.collapsed ? '' : 'rotate-90'
            }`}
          >
            <ChevronRight />
          </div>
          <div
            class="grow-1 shrink-1 overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {item.name}
          </div>
        </div>
        <button
          class="grow-0 shrink-0 p-2 hover:bg-neutral-500 hover:text-neutral-100 h-full"
          on:click={(e) => {
            e.stopPropagation()
            onRenameState(item.name, item.state)
          }}><div class="w-5 h-5"><Pencil /></div></button
        >
        <button
          class="grow-0 shrink-0 p-2 hover:bg-neutral-500 hover:text-neutral-100 h-full"
          on:click={(e) => {
            e.stopPropagation()
            onDeleteState(item.name, item.state)
          }}><div class="w-5 h-5"><Trash /></div></button
        >
      </button>
      {#if !item.state.collapsed}
        <ScriptPropertiesPanel
          scripts={item.state.scripts}
          onRearrangeScripts={(scripts) => (item.state.scripts = scripts)}
          {onEditScript}
          onDeleteScript={(script) => {
            const newScripts = [...item.state.scripts]
            const i = newScripts.indexOf(script)
            if (i !== -1) {
              newScripts.splice(i, 1)
            }
            item.state.scripts = newScripts
          }}
        />
      {/if}
    </div>
  {/each}
</div>

<button
  on:click={onAddState}
  class="grow-0 shrink-0 ml-4 relative rounded-full bg-sky-600 hover:bg-sky-700 transition-all font-bold w-52 h-10"
>
  <div
    class="absolute w-full"
    style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
  >
    Add State
  </div>
  <div
    class="absolute w-5 h-5"
    style="top: 50%; right: 0; transform: translate(-16px, -50%);"
  >
    <Plus />
  </div>
</button>
