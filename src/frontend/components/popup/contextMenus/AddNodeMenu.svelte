<script>
  import ContextMenuLayout from 'components/popup/layouts/ContextMenuLayout.svelte'
  import MagnifyingGlass from 'icons/20/mini/magnifying-glass.svelte'

  export let x = null,
    y = null
  export let checkCanReposition = null
  export let onDestroyPopup = null

  export let nodeTypeNames = null
  export let onAddNode = null
</script>

<ContextMenuLayout
  {x}
  {y}
  {checkCanReposition}
  {onDestroyPopup}
  width="200px"
  height="200px"
>
  <div class="flex flex-col w-full h-full overflow-x-hidden overflow-y-auto">
    <div
      class="grow-0 shrink-0 flex flex-row border-b border-solid border-neutral-700 h-10"
    >
      <input
        placeholder="Search..."
        class="grow-1 shrink-1 p-2 pl-8 w-full min-w-0 border-0 outline-0 bg-neutral-800 text-neutral-100"
      />
      <div
        class="absolute w-8 h-10 flex items-center justify-center text-neutral-500 pointer-events-none"
      >
        <MagnifyingGlass />
      </div>
    </div>
    <div
      class="grow-1 shrink-1 flex flex-col overflow-x-hidden overflow-y-auto"
    >
      {#each nodeTypeNames as name}
        <button
          on:click={() => {
            onAddNode(name)
            onDestroyPopup()
          }}
          class="p-2 cursor-pointer hover:bg-neutral-700 outline-0 text-left"
        >
          {name}
        </button>
      {/each}
    </div>
  </div>
</ContextMenuLayout>
