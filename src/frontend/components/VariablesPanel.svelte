<script>
  import { PORT_COLOR } from '%editor/ScriptVisualizer.js'
  import { EntityVariable } from '%component/SceneEntity.js'
  import IntEditor from 'components/scriptPropertyEditors/IntEditor.svelte'
  import ChevronRight from 'icons/20/mini/chevron-right.svelte'
  import Pencil from 'icons/20/mini/pencil.svelte'
  import Trash from 'icons/20/mini/trash.svelte'
  import Plus from 'icons/24/outline/plus.svelte'

  export let isSelected = false
  export let collapsed = false
  export let onSelect = undefined
  export let onSetCollapsed = undefined
  export let variables = undefined
  export let focusedVariable = undefined

  let variablesArray = []

  function onAddVariable() {
    let variableNum = 1
    while (variables.has(`Variable ${variableNum}`)) {
      ++variableNum
    }
    const name = `Variable ${variableNum}`
    variables.set(name, new EntityVariable(name, 0))
    variables = variables
  }

  function onRenameVariable(variable) {
    let newName = window.prompt('Enter new state name:')
    newName = newName.trim()
    if (!newName) {
      return
    }

    variables.delete(variable.name)
    variable.name = newName
    variables.set(newName, variable)
    variables = variables
  }

  function onDeleteVariable(variable) {
    variables.delete(variable.name)
    variables = variables
  }

  $: {
    variablesArray = []
    for (const [name, variable] of variables) {
      variablesArray.push(variable)
    }
  }
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
      <div class="grow-0 shrink-0 overflow-hidden font-bold mr-1">
        Variables
      </div>
    </div>
  </button>

  {#if !collapsed}
    {#each variablesArray as item}
      <div
        class={`pl-16 flex flex-row grow-0 shrink-0 border-b border-solid border-neutral-700 transition-all`}
        style={item === focusedVariable
          ? `background-color: ${PORT_COLOR['int'].editor.background}3F;`
          : ''}
      >
        <div
          class={`flex flex-row items-center grow-0 shrink-0 overflow-hidden w-48 transition-all`}
          style={`color: ${PORT_COLOR['int'].name}`}
        >
          <div
            class={`grow shrink text-ellipsis whitespace-nowrap overflow-hidden transition-all ${
              item === focusedVariable ? 'font-bold' : ''
            }`}
          >
            {item.name}
          </div>
          <button
            class="grow-0 shrink-0 p-2 text-neutral-200 hover:bg-neutral-500 hover:text-neutral-100 h-full"
            on:click={(e) => {
              e.stopPropagation()
              onRenameVariable(item)
            }}><div class="w-5 h-5"><Pencil /></div></button
          >
          <button
            class="grow-0 shrink-0 p-2 text-neutral-200 hover:bg-neutral-500 hover:text-neutral-100 h-full"
            on:click={(e) => {
              e.stopPropagation()
              onDeleteVariable(item)
            }}><div class="w-5 h-5"><Trash /></div></button
          >
        </div>
        <div class="grow shrink w-full overflow-hidden">
          <IntEditor
            initialValue={item.defaultValue}
            currentValue={item.defaultValue}
            onApply={(value) => (item.defaultValue = value)}
            onFocus={() => (focusedVariable = item)}
            onBlur={() => (focusedVariable = undefined)}
          />
        </div>
      </div>
    {/each}

    <button
      on:click={onAddVariable}
      class="grow-0 shrink-0 flex flex-row items-center justify-center p-2 bg-neutral-900 hover:bg-neutral-800 border-b border-solid border-neutral-700 transition-all font-bold w-full"
    >
      <div class="grow-0 shrink-0 w-6 h-6 mr-2">
        <Plus />
      </div>
      <div class="grow-0 shrink-0">New Variable</div>
    </button>
  {/if}
</div>
