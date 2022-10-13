<script>
  import StatesPanelItemAnimation from 'components/StatesPanelItemAnimation.svelte'
  import ScriptPropertiesPanel from 'components/ScriptPropertiesPanel.svelte'
  import ChevronRight from 'icons/20/mini/chevron-right.svelte'
  import Pencil from 'icons/20/mini/pencil.svelte'
  import Trash from 'icons/20/mini/trash.svelte'
  import ViewColumns from 'icons/24/outline/view-columns.svelte'
  import TableCells from 'icons/24/outline/table-cells.svelte'

  export let isSelected = false
  export let states = undefined
  export let onSelect = undefined
  export let onRename = undefined
  export let onDelete = undefined
  export let onEditScript = undefined

  export let item = undefined
</script>

<div
  class="grow-0 shrink-0 flex flex-col overflow-x-clip"
  on:click={() => onSelect(item.name, item.state)}
>
  <button
    class={`${
      isSelected ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-800'
    } flex flex-row grow-0 shrink-0 w-full overflow-x-hidden text-left sticky z-[99999] top-0`}
  >
    <div
      class="flex flex-row w-full grow-1 shrink-1 p-2 overflow-hidden font-bold"
    >
      <button
        on:click={() => (item.state.collapsed = !item.state.collapsed)}
        class={`hover:bg-neutral-500 hover:text-neutral-100 rounded-full grow-0 shrink-0 w-5 h-5 mr-2 transition-all duration-75 ${
          item.state.collapsed ? '' : 'rotate-90'
        }`}
      >
        <ChevronRight />
      </button>
      <div class="grow-0 shrink-0 overflow-hidden font-normal mr-1">State:</div>
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
        onRename(item.name, item.state)
      }}><div class="w-5 h-5"><Pencil /></div></button
    >
    <button
      class="grow-0 shrink-0 p-2 hover:bg-neutral-500 hover:text-neutral-100 h-full"
      on:click={(e) => {
        e.stopPropagation()
        onDelete(item.name, item.state)
      }}><div class="w-5 h-5"><Trash /></div></button
    >
  </button>

  <!-- Animations -->

  <button
    class={`pl-8 flex flex-row grow-0 shrink-0 w-full overflow-x-hidden text-left bg-neutral-800`}
  >
    <div
      class="flex flex-row w-full grow-1 shrink-1 p-2 overflow-hidden font-bold"
    >
      <button
        on:click={() =>
          (item.state.animationsCollapsed = !item.state.animationsCollapsed)}
        class={`hover:bg-neutral-500 hover:text-neutral-100 rounded-full grow-0 shrink-0 w-5 h-5 mr-2 transition-all duration-75 ${
          item.state.animationsCollapsed ? '' : 'rotate-90'
        }`}
      >
        <ChevronRight />
      </button>
      <div
        class="w-full grow-1 shrink-1 overflow-hidden text-ellipsis whitespace-nowrap"
      >
        Animations
      </div>
    </div>
    {#if !item.state.animationsCollapsed}
      <button
        class="grow-0 shrink-0 p-2 h-full hover:bg-neutral-500 hover:text-neutral-100"
        on:click={(e) => {
          e.stopPropagation()
          if (item.state.animationsView === 'grid') {
            item.state.animationsView = 'list'
          } else {
            item.state.animationsView = 'grid'
          }
        }}
        ><div class="w-5 h-5">
          {#if item.state.animationsView === 'grid'}
            <ViewColumns />
          {:else}
            <TableCells />
          {/if}
        </div></button
      >
    {/if}
  </button>

  {#if !item.state.animationsCollapsed}
    <div
      class={`grow-0 shrink-0 items-center justify-center content-center justify-items-center grid gap-2 ${
        item.state.animationsView === 'grid'
          ? 'grid-rows-3 grid-cols-[repeat(3,_64px)] p-4'
          : 'grid-rows-1 grid-cols-[repeat(9,_64px)] p-2'
      } bg-neutral-900 border-b border-solid border-neutral-700`}
    >
      {#each item.state.textures as texture, i}
        <StatesPanelItemAnimation
          {texture}
          textureIdx={i}
          onSetTextureProps={(newTextureProps) => {
            item.state.setTexture(i, newTextureProps)
            item.state.textures = item.state.textures
          }}
        />
      {/each}
    </div>
  {/if}

  <!-- Scripts -->

  {#if !item.state.collapsed}
    <ScriptPropertiesPanel
      parentStateSelected={isSelected}
      {states}
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
