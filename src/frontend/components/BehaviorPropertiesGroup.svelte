<script>
  import IntEditor from 'components/behaviorPropertyEditors/IntEditor.svelte'
  import KeyEditor from 'components/behaviorPropertyEditors/KeyEditor.svelte'
  import Pencil from 'icons/20/mini/pencil.svelte'
  import Trash from 'icons/20/mini/trash.svelte'

  export let script = undefined
  export let onEditScript = undefined
  export let onDelete = undefined

  let sortedExportNodes = []

  $: {
    if (script) {
      sortedExportNodes = [...script.exportNodes]
      sortedExportNodes.sort((a, b) =>
        a.internalValues[0] > b.internalValues[0] ? 1 : -1
      )
    } else {
      sortedExportNodes = []
    }
  }
</script>

<div class="flex flex-col grow-0 shrink-0 w-full overflow-x-hidden">
  <div
    class="bg-neutral-800 flex flex-row grow-0 shrink-0 w-full overflow-x-hidden"
  >
    <div
      class="w-full grow-1 shrink-1 p-2 overflow-hidden text-ellipsis whitespace-nowrap font-bold"
    >
      {script.debugName}
    </div>
    <button
      class="grow-0 shrink-0 p-2 hover:bg-neutral-500 hover:text-neutral-100"
      on:click={onEditScript}><div class="w-5 h-5"><Pencil /></div></button
    >
    <button
      class="grow-0 shrink-0 p-2 hover:bg-neutral-500 hover:text-neutral-100"
      on:click={onDelete}><div class="w-5 h-5"><Trash /></div></button
    >
  </div>
  <div class="flex flex-col grow-0 shrink-0 w-full overflow-x-hidden">
    {#each sortedExportNodes as exportNode}
      <div
        class="flex flex-row grow-0 shrink-0 border-b border-solid border-neutral-700"
      >
        <div
          class="grow-0 shrink-0 p-2 text-ellipsis whitespace-nowrap overflow-hidden w-48 border-solid border-neutral-700 border-r"
        >
          {exportNode.internalValues[0]}
        </div>
        <div class="grow-1 shrink-1 w-full overflow-hidden">
          {#if exportNode.data.internalPorts[1].editorTypename === 'int'}
            <IntEditor
              currentValue={exportNode.internalValues[1]}
              onApply={(value) => (exportNode.internalValues[1] = value)}
            />
          {:else if exportNode.data.internalPorts[1].editorTypename === 'key'}
            <KeyEditor
              currentValue={exportNode.internalValues[1]}
              onApply={(value) => (exportNode.internalValues[1] = value)}
            />
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
