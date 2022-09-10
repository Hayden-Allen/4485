<script>
  import { onMount } from 'svelte'
  import MagnifyingGlass from 'icons/20/mini/magnifying-glass.svelte'

  export let x = null,
    y = null
  export let nodeTypeNames = null
  export let checkCanReposition = null
  export let onAddNode = null
  export let onDestroy = null
</script>

<svelte:window on:resize={onDestroy} />

<div
  class="fixed left-0 top-0 w-full h-full overflow-hidden"
  on:pointerdown={(e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.button === 2 && checkCanReposition(e.clientX, e.clientY)) {
      x = e.clientX
      y = e.clientY
    } else {
      onDestroy()
    }
  }}
>
  <div
    class="flex flex-col w-[200px] h-[200px] bg-slate-900 text-slate-100 drop-shadow-xl absolute"
    style={`left: ${x}px; top: ${y}px;`}
    on:pointerdown={(e) => {
      e.stopPropagation()
    }}
  >
    <div
      class="grow-0 shrink-0 flex flex-row border-b border-solid border-slate-700 h-10"
    >
      <input
        placeholder="Search..."
        class="grow-1 shrink-1 p-2 pl-8 w-full min-w-0 border-0 outline-0 bg-slate-900 text-slate-100"
      />
      <div
        class="absolute w-8 h-10 flex items-center justify-center text-slate-500 pointer-events-none"
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
            onDestroy()
          }}
          class="p-2 cursor-pointer hover:bg-slate-800 outline-0 text-left"
        >
          {name}
        </button>
      {/each}
    </div>
  </div>
</div>
