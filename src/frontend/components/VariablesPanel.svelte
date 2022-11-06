<script>
  import { PORT_COLOR } from '%editor/ScriptVisualizer.js'
  import IntEditor from 'components/scriptPropertyEditors/IntEditor.svelte'
  import FloatEditor from 'components/scriptPropertyEditors/FloatEditor.svelte'
  import KeyEditor from 'components/scriptPropertyEditors/KeyEditor.svelte'
  import StateEditor from 'components/scriptPropertyEditors/StateEditor.svelte'
  import BoolEditor from 'components/scriptPropertyEditors/BoolEditor.svelte'
  import StringEditor from 'components/scriptPropertyEditors/StringEditor.svelte'
  import ChevronRight from 'icons/20/mini/chevron-right.svelte'
  import Pencil from 'icons/20/mini/pencil.svelte'
  import Trash from 'icons/20/mini/trash.svelte'

  export let isSelected = false
  export let collapsed = false
  export let onSelect = undefined
  export let onSetCollapsed = undefined
  export let variables = []
  export let focusedVariable = undefined
</script>

<div class="grow-0 shrink-0 flex flex-col overflow-x-clip" on:click={onSelect}>
  <button
    class={`${
      isSelected ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-800'
    } flex flex-row grow-0 shrink-0 w-full overflow-x-hidden text-left sticky z-[99999] top-0`}
  >
    <div class="flex flex-row w-full grow shrink p-2 overflow-hidden font-bold">
      <button
        on:click={() => onSetCollapsed(!collapsed)}
        class={`hover:bg-neutral-500 hover:text-neutral-100 rounded-full grow-0 shrink-0 w-5 h-5 mr-2 transition-all duration-75 ${
          collapsed ? '' : 'rotate-90'
        }`}
      >
        <ChevronRight />
      </button>
      <div class="grow-0 shrink-0 overflow-hidden font-normal mr-1">
        Variables
      </div>
    </div>
  </button>

  {#if !collapsed}
    {#each variables as variable}
      <div
        class={`pl-16 flex flex-row grow-0 shrink-0 border-b border-solid border-neutral-700 transition-all`}
        style={variable === focusedVariable
          ? `background-color: ${
              PORT_COLOR[focusedVariable.valueType].editor.background
            }3F;`
          : ''}
      >
        <div
          class={`grow-0 shrink-0 p-2 text-ellipsis whitespace-nowrap overflow-hidden w-48 transition-all ${
            variable === focusedVariable ? 'font-bold' : ''
          }`}
          style={`color: ${PORT_COLOR[variable.valueType].name}`}
        >
          {variable.name}
        </div>
        <div class="grow shrink w-full overflow-hidden">
          {#if variable.editorType === 'int'}
            <IntEditor
              initialValue={variable.value}
              currentValue={variable.value}
              onApply={(value) => variable.setValue(value)}
              onFocus={() => (focusedVariable = variable)}
              onBlur={() => (focusedVariable = undefined)}
            />
          {:else if variable.editorType === 'float'}
            <FloatEditor
              initialValue={variable.value}
              currentValue={variable.value}
              onApply={(value) => variable.setValue(value)}
              onFocus={() => (focusedVariable = variable)}
              onBlur={() => (focusedVariable = undefined)}
            />
          {:else if variable.editorType === 'key'}
            <KeyEditor
              currentValue={variable.value}
              onApply={(value) => variable.setValue(value)}
              onFocus={() => (focusedVariable = variable)}
              onBlur={() => (focusedVariable = undefined)}
            />
          {:else if variable.editorType === 'state'}
            <StateEditor
              {states}
              currentValue={variable.value}
              onApply={(value) => variable.setValue(value)}
              onFocus={() => (focusedVariable = variable)}
              onBlur={() => (focusedVariable = undefined)}
            />
          {:else if variable.editorType === 'string'}
            <StringEditor
              currentValue={variable.value}
              onApply={(value) => variable.setValue(value)}
              onFocus={() => (focusedVariable = variable)}
              onBlur={() => (focusedVariable = undefined)}
            />
          {:else if variable.editorType === 'bool'}
            <BoolEditor
              currentValue={variable.value}
              onApply={(value) => variable.setValue(value)}
              onFocus={() => (focusedVariable = variable)}
              onBlur={() => (focusedVariable = undefined)}
            />
          {/if}
        </div>
      </div>
    {/each}
  {/if}
</div>
