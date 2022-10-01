<script>
  import { PORT_COLOR } from '%editor/ScriptVisualizer.js'
  import IntEditor from 'components/scriptPropertyEditors/IntEditor.svelte'
  import FloatEditor from 'components/scriptPropertyEditors/FloatEditor.svelte'
  import KeyEditor from 'components/scriptPropertyEditors/KeyEditor.svelte'
  import ChevronRight from 'icons/20/mini/chevron-right.svelte'
  import Pencil from 'icons/20/mini/pencil.svelte'
  import Trash from 'icons/20/mini/trash.svelte'

  export let script = undefined
  export let onEditScript = undefined
  export let onDelete = undefined

  let sortedExportNodes = []
  let focusedNode = undefined
  let collapsed = false

  $: {
    if (script) {
      sortedExportNodes = [...script.exportNodes]
      sortedExportNodes.sort((a, b) => (a.name > b.name ? 1 : -1))
    } else {
      sortedExportNodes = []
    }
  }
</script>

<div class="flex flex-col grow-0 shrink-0 w-full overflow-x-hidden">
  <button
    class="bg-neutral-800 flex flex-row grow-0 shrink-0 w-full overflow-x-hidden text-left"
    on:click={() => (collapsed = !collapsed)}
  >
    <div
      class="flex flex-row w-full grow-1 shrink-1 p-2 overflow-hidden font-bold"
    >
      <div
        class={`grow-0 shrink-0 w-5 h-5 mr-2 transition-all duration-75 ${
          collapsed ? '' : 'rotate-90'
        }`}
      >
        <ChevronRight />
      </div>
      <div
        class="grow-1 shrink-1 overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {script.debugName}
      </div>
    </div>
    <button
      class="grow-0 shrink-0 p-2 hover:bg-neutral-500 hover:text-neutral-100"
      on:click={(e) => {
        e.stopPropagation()
        onEditScript()
      }}><div class="w-5 h-5"><Pencil /></div></button
    >
    <button
      class="grow-0 shrink-0 p-2 hover:bg-neutral-500 hover:text-neutral-100"
      on:click={(e) => {
        e.stopPropagation()
        onDelete()
      }}><div class="w-5 h-5"><Trash /></div></button
    >
  </button>
  <div
    class={`flex flex-col grow-0 shrink-0 w-full overflow-hidden ${
      collapsed ? 'h-0' : 'h-auto'
    }`}
  >
    {#each sortedExportNodes as exportNode}
      <div
        class="flex flex-row grow-0 shrink-0 border-b border-solid border-neutral-700 transition-all"
        style={exportNode === focusedNode
          ? `background-color: ${
              PORT_COLOR[exportNode.valueType].editor.background
            }3F;`
          : ''}
      >
        <div
          class={`grow-0 shrink-0 p-2 text-ellipsis whitespace-nowrap overflow-hidden w-48 transition-all ${
            exportNode === focusedNode ? 'font-bold' : ''
          }`}
          style={`color: ${PORT_COLOR[exportNode.valueType].name}`}
        >
          {exportNode.name}
        </div>
        <div class="grow-1 shrink-1 w-full overflow-hidden">
          {#if exportNode.editorType === 'int'}
            <IntEditor
              currentValue={exportNode.value}
              onApply={(value) => exportNode.setValue(value)}
              onFocus={() => (focusedNode = exportNode)}
              onBlur={() => (focusedNode = undefined)}
            />
          {:else if exportNode.editorType === 'float'}
            <FloatEditor
              currentValue={exportNode.value}
              onApply={(value) => exportNode.setValue(value)}
              onFocus={() => (focusedNode = exportNode)}
              onBlur={() => (focusedNode = undefined)}
            />
          {:else if exportNode.editorType === 'key'}
            <KeyEditor
              currentValue={exportNode.value}
              onApply={(value) => exportNode.setValue(value)}
              onFocus={() => (focusedNode = exportNode)}
              onBlur={() => (focusedNode = undefined)}
            />
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
