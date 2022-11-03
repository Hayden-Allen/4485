<script>
  import { PORT_COLOR } from '%editor/ScriptVisualizer.js'
  import { global } from '%engine/Global.js'
  import IntEditor from 'components/scriptPropertyEditors/IntEditor.svelte'
  import FloatEditor from 'components/scriptPropertyEditors/FloatEditor.svelte'
  import KeyEditor from 'components/scriptPropertyEditors/KeyEditor.svelte'
  import StateEditor from 'components/scriptPropertyEditors/StateEditor.svelte'
  import BoolEditor from 'components/scriptPropertyEditors/BoolEditor.svelte'
  import StringEditor from 'components/scriptPropertyEditors/StringEditor.svelte'
  import ChevronRight from 'icons/20/mini/chevron-right.svelte'
  import Pencil from 'icons/20/mini/pencil.svelte'
  import Trash from 'icons/20/mini/trash.svelte'

  export let states = undefined
  export let script = undefined
  export let onEditScript = undefined
  export let onDelete = undefined
  export let isLast = false
  export let collapsed = false
  export let onToggleCollapsed = undefined

  let sortedExportNodes = []
  let focusedNode = undefined

  $: {
    if (script) {
      sortedExportNodes = [...script.exportNodes]
      global.alphabetSort(sortedExportNodes)
    } else {
      sortedExportNodes = []
    }
  }
</script>

<div class="flex flex-col grow-0 shrink-0 w-full overflow-x-hidden">
  <div
    class="pl-8 bg-neutral-800 flex flex-row grow-0 shrink-0 w-full overflow-x-hidden text-left"
  >
    <div class="flex flex-row w-full grow shrink p-2 overflow-hidden font-bold">
      {#if sortedExportNodes.length > 0}
        <button
          on:click={onToggleCollapsed}
          class={`grow-0 shrink-0 w-5 h-5 mr-2 hover:bg-neutral-500 hover:text-neutral-100 rounded-full transition-all duration-75 ${
            collapsed ? '' : 'rotate-90'
          }`}
        >
          <ChevronRight />
        </button>
      {:else}
        <div class="grow-0 shrink-0 w-5 h-5 mr-2" />
      {/if}
      <div class="grow-0 shrink-0 overflow-hidden font-normal mr-1">
        Script:
      </div>
      <div class="grow shrink overflow-hidden text-ellipsis whitespace-nowrap">
        {script.debugName}
      </div>
    </div>
    <button
      class="grow-0 shrink-0 p-2 hover:bg-neutral-500 hover:text-neutral-100 h-full"
      on:click={(e) => {
        e.stopPropagation()
        onEditScript()
      }}><div class="w-5 h-5"><Pencil /></div></button
    >
    <button
      class="grow-0 shrink-0 p-2 hover:bg-neutral-500 hover:text-neutral-100 h-full"
      on:click={(e) => {
        e.stopPropagation()
        onDelete()
      }}><div class="w-5 h-5"><Trash /></div></button
    >
  </div>
  {#if !collapsed}
    <div class="flex flex-col grow-0 shrink-0 w-full overflow-hidden">
      {#each sortedExportNodes as exportNode}
        <div
          class={`pl-16 flex flex-row grow-0 shrink-0 ${
            isLast ? 'border-b' : 'not-last:border-b'
          } border-solid border-neutral-700 transition-all`}
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
          <div class="grow shrink w-full overflow-hidden">
            {#if exportNode.editorType === 'int'}
              <IntEditor
                initialValue={exportNode.value}
                currentValue={exportNode.value}
                onApply={(value) => exportNode.setValue(value)}
                onFocus={() => (focusedNode = exportNode)}
                onBlur={() => (focusedNode = undefined)}
              />
            {:else if exportNode.editorType === 'float'}
              <FloatEditor
                initialValue={exportNode.value}
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
            {:else if exportNode.editorType === 'state'}
              <StateEditor
                {states}
                currentValue={exportNode.value}
                onApply={(value) => exportNode.setValue(value)}
                onFocus={() => (focusedNode = exportNode)}
                onBlur={() => (focusedNode = undefined)}
              />
            {:else if exportNode.editorType === 'string'}
              <StringEditor
                currentValue={exportNode.value}
                onApply={(value) => exportNode.setValue(value)}
                onFocus={() => (focusedNode = exportNode)}
                onBlur={() => (focusedNode = undefined)}
              />
            {:else if exportNode.editorType === 'bool'}
              <BoolEditor
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
  {/if}
</div>
