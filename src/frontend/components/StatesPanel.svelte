<script>
  import { global } from '%engine/Global.js'
  import { PORT_COLOR } from '%editor/ScriptVisualizer.js'
  import ScriptPropertiesPanel from 'components/ScriptPropertiesPanel.svelte'
  import ChevronRight from 'icons/20/mini/chevron-right.svelte'
  import Pencil from 'icons/20/mini/pencil.svelte'
  import Trash from 'icons/20/mini/trash.svelte'
  import Plus from 'icons/24/outline/plus.svelte'
  import FloatEditor from 'components/scriptPropertyEditors/FloatEditor.svelte'

  export let states = undefined
  export let selectedState = undefined
  export let selectedEntity = undefined
  export let onSelectState = undefined
  export let onRenameState = undefined
  export let onDeleteState = undefined
  export let onEditScript = undefined
  export let onAddState = undefined

  const entityGlobalProperties = [
    {
      displayName: 'Default Mass',
      get: (entity) => entity.physicsProxy.mass,
      set: (entity, value) => entity.setMass(value),
      type: 'float',
    },
    {
      displayName: 'Default Friction',
      get: (entity) => entity.physicsProxy.friction,
      set: (entity, value) => (entity.physicsProxy.friction = value),
      type: 'float',
    },
  ]

  let focusedGlobalProperty = null

  let items = undefined

  function updateItems() {
    items = []
    for (const [key, value] of states) {
      items.push({
        name: key,
        state: value,
      })
    }
    global.alphabetSort(items)
  }

  $: {
    updateItems(states)
  }
</script>

<!--
<div
  class={`grow-0 shrink-0 p-2 text-ellipsis whitespace-nowrap overflow-hidden w-48 transition-all`}
>
  Mass:
</div>
<div class="grow-1 shrink-1 w-full overflow-hidden">
  <FloatEditor
    currentValue={selectedEntity.physicsProxy.mass}
    onApply={(value) => selectedEntity.setMass(value)}
  />
</div>
-->

<div class="grow-0 shrink-0 flex flex-col overflow-x-clip">
  {#each entityGlobalProperties as prop, propIdx}
    <div
      class={`pl-16 flex flex-row grow-0 shrink-0 ${
        propIdx !== entityGlobalProperties.length - 1
          ? 'border-b'
          : 'not-last:border-b'
      } border-solid border-neutral-700 transition-all`}
      style={prop === focusedGlobalProperty
        ? `background-color: ${PORT_COLOR[prop.type].editor.background}3F;`
        : ''}
    >
      <div
        class={`grow-0 shrink-0 p-2 text-ellipsis whitespace-nowrap overflow-hidden w-48 transition-all ${
          prop === focusedGlobalProperty ? 'font-bold' : ''
        }`}
        style={`color: ${PORT_COLOR[prop.type].name}`}
      >
        {prop.displayName}
      </div>
      <div class="grow-1 shrink-1 w-full overflow-hidden">
        {#if prop.type === 'int'}
          <!-- TODO -->
        {:else if prop.type === 'float'}
          <FloatEditor
            currentValue={prop.get(selectedEntity)}
            onApply={(value) => prop.set(selectedEntity, value)}
            onFocus={() => (focusedGlobalProperty = prop)}
            onBlur={() => (focusedGlobalProperty = undefined)}
          />
        {:else if prop.type === 'key'}
          <!-- TODO -->
        {:else if prop.type === 'state'}
          <!-- TODO -->
        {/if}
      </div>
    </div>
  {/each}

  {#each items as item}
    <div
      class="grow-0 shrink-0 flex flex-col overflow-x-clip"
      on:click={() => onSelectState(item.name, item.state)}
    >
      <button
        class={`${
          item.state === selectedState
            ? 'bg-neutral-100 text-neutral-900'
            : 'bg-neutral-800'
        } flex flex-row grow-0 shrink-0 w-full overflow-x-hidden text-left sticky top-0`}
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
          <div class="grow-0 shrink-0 overflow-hidden font-normal mr-1">
            State:
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
          parentStateSelected={item.state === selectedState}
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
  {/each}
  <button
    on:click={onAddState}
    class="grow-0 shrink-0 flex flex-row items-center justify-center p-2 sticky bottom-0 bg-neutral-900 hover:bg-neutral-800 border-t border-solid border-neutral-700 transition-all font-bold w-full"
  >
    <div class="grow-0 shrink-0 w-6 h-6 mr-2">
      <Plus />
    </div>
    <div class="grow-0 shrink-0">New State</div>
  </button>
</div>
