<script>
  import { global } from '%engine/Global.js'
  import { PORT_COLOR } from '%editor/ScriptVisualizer.js'
  import Plus from 'icons/24/outline/plus.svelte'
  import FloatEditor from 'components/scriptPropertyEditors/FloatEditor.svelte'
  import StatesPanelItem from 'components/StatesPanelItem.svelte'

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
    if (states) {
      items = []
      for (const [key, value] of states) {
        items.push({
          name: key,
          state: value,
        })
      }
      global.alphabetSort(items)
    }
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
<div class="grow shrink w-full overflow-hidden">
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
      <div class="grow shrink w-full overflow-hidden">
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

  {#if items}
    {#each items as item}
      <StatesPanelItem
        isSelected={selectedState === item.state}
        {states}
        onSelect={onSelectState}
        onRename={onRenameState}
        onDelete={onDeleteState}
        {onEditScript}
        {item}
      />
    {/each}
  {/if}

  <button
    on:click={onAddState}
    class="grow-0 shrink-0 flex flex-row items-center justify-center p-2 sticky z-[99999] bottom-0 bg-neutral-900 hover:bg-neutral-800 border-t border-solid border-neutral-700 transition-all font-bold w-full"
  >
    <div class="grow-0 shrink-0 w-6 h-6 mr-2">
      <Plus />
    </div>
    <div class="grow-0 shrink-0">New State</div>
  </button>
</div>