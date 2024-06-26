<script>
  import { global } from '%engine/Global.js'
  import { PORT_COLOR } from '%editor/ScriptVisualizer.js'
  import Plus from 'icons/24/outline/plus.svelte'
  import BoltSlash from 'icons/20/mini/bolt-slash.svelte'
  import FloatEditor from 'components/scriptPropertyEditors/FloatEditor.svelte'
  import BoolEditor from 'components/scriptPropertyEditors/BoolEditor.svelte'
  import StatesPanelItem from 'components/StatesPanelItem.svelte'
  import VariablesPanel from './VariablesPanel.svelte'
  import ChevronRight from 'icons/20/mini/chevron-right.svelte'

  export let states = undefined
  export let variables = undefined
  export let selectedState = undefined
  export let selectedEntity = undefined
  export let onSelectState = undefined
  export let onRenameState = undefined
  export let onDeleteState = undefined
  export let onEditScript = undefined
  export let onAddState = undefined
  export let onVariablesChanged = undefined
  export let onSetDefaultState = undefined
  export let onMakeStaticEntity = undefined
  export let playState = undefined

  let selectedPanel = null
  let focusedGlobalProperty = null
  let items = undefined

  const entityGlobalProperties = [
    {
      displayName: 'Movable',
      get: (entity) => !entity.physicsProxy.isStatic,
      set: (entity, value) => {
        entity.setStatic(!value)
        selectedEntity = selectedEntity
      },
      type: 'bool',
    },
  ]

  function updateItems() {
    if (states) {
      items = []
      for (const [key, value] of states) {
        items.push({
          name: key,
          state: value,
          isDefault: value.isDefault,
        })
      }
      global.alphabetSort(items)
    }
  }

  $: {
    updateItems(states)
  }
</script>

<div class="grow-0 shrink-0 flex flex-col overflow-x-clip">
  <div
    class="grow-0 shrink-0 flex flex-col overflow-x-clip"
    on:click={() => {
      selectedPanel = 'physics'
      onSelectState(undefined, undefined)
    }}
  >
    <button
      class={`${
        selectedPanel === 'physics'
          ? 'bg-neutral-100 text-neutral-900'
          : 'bg-neutral-800'
      } flex flex-row grow-0 shrink-0 w-full overflow-x-hidden text-left sticky z-[99999] top-0`}
    >
      <div
        class="flex flex-row w-full grow shrink p-2 overflow-hidden font-bold"
      >
        <button
          on:click={() =>
            (selectedEntity.physicsCollapsed =
              !selectedEntity.physicsCollapsed)}
          class={`hover:bg-neutral-500 hover:text-neutral-100 rounded-full grow-0 shrink-0 w-5 h-5 mr-2 transition-all duration-75 ${
            selectedEntity.physicsCollapsed ? '' : 'rotate-90'
          }`}
        >
          <ChevronRight />
        </button>
        <div class="grow-0 shrink-0 overflow-hidden font-bold mr-1">
          Physics
        </div>
      </div>
    </button>

    {#if !selectedEntity.physicsCollapsed}
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
            {#if prop.type === 'float'}
              <FloatEditor
                currentValue={prop.get(selectedEntity)}
                onApply={(value) => prop.set(selectedEntity, value)}
                onFocus={() => (focusedGlobalProperty = prop)}
                onBlur={() => (focusedGlobalProperty = undefined)}
              />
            {/if}
            {#if prop.type === 'bool'}
              <BoolEditor
                currentValue={prop.get(selectedEntity)}
                onApply={(value) => prop.set(selectedEntity, value)}
                onFocus={() => (focusedGlobalProperty = prop)}
                onBlur={() => (focusedGlobalProperty = undefined)}
              />
            {/if}
          </div>
        </div>
      {/each}
      <div
        class="grow-0 shrink-0 flex flex-row items-center justify-center p-2 bg-neutral-900 border-b border-solid border-neutral-700 w-full"
      >
        <button
          on:click={onMakeStaticEntity}
          disabled={playState !== 'stop'}
          class="flex grow-0 shrink-0 p-2 items-center justify-center rounded-md text-rose-500 disabled:text-neutral-500 bg-neutral-800 hover:bg-neutral-700 disabled:hover:bg-neutral-800 disabled:pointer-events-none transition-all"
        >
          <div class="w-5 h-5 mr-2"><BoltSlash /></div>
          <div>Make static entity</div>
        </button>
      </div>
    {/if}
  </div>

  <VariablesPanel
    {selectedEntity}
    collapsed={selectedEntity.variablesCollapsed}
    onSetCollapsed={(value) => (selectedEntity.variablesCollapsed = value)}
    isSelected={selectedPanel === 'variables'}
    onSelect={() => {
      selectedPanel = 'variables'
      onSelectState(undefined, undefined)
    }}
    variables={selectedEntity.variables}
    {onVariablesChanged}
  />

  {#if items}
    {#each items as item}
      <StatesPanelItem
        isSelected={selectedState === item.state}
        {states}
        {variables}
        onSelect={(name, state) => {
          selectedPanel = 'states'
          onSelectState(name, state)
        }}
        onRename={onRenameState}
        onDelete={onDeleteState}
        onSetDefault={onSetDefaultState}
        isDefault={selectedEntity.defaultStateName === item.name}
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
