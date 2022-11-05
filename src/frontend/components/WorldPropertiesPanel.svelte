<script>
  import { global } from '%engine/Global.js'
  import { PORT_COLOR } from '%editor/ScriptVisualizer.js'
  import FloatEditor from 'components/scriptPropertyEditors/FloatEditor.svelte'

  let focusedProp = undefined
  let curGravity = 0

  $: {
    if (global.context) {
      curGravity = global.context.game.physicsEngine.engine.gravity.scale
    }
  }
</script>

<div
  class="grow-0 shrink-0 flex flex-col overflow-x-clip border-b border-solid border-neutral-700"
>
  <div class="flex flex-row grow-0 shrink-0 w-full overflow-hidden">
    <div
      class={`pl-16 flex flex-row grow-0 shrink-0 transition-all`}
      style={focusedProp === 'gravity'
        ? `background-color: ${PORT_COLOR['float'].editor.background}3F;`
        : ''}
    />
    <div
      class={`grow-0 shrink-0 p-2 text-ellipsis whitespace-nowrap overflow-hidden w-48 transition-all ${
        focusedProp === 'gravity' ? 'font-bold' : ''
      }`}
      style={`color: ${PORT_COLOR['float'].name}`}
    >
      World Gravity
    </div>
    <div class="grow shrink w-full overflow-hidden">
      <FloatEditor
        initialValue={curGravity}
        currentValue={curGravity}
        onApply={(value) =>
          (global.context.game.physicsEngine.engine.gravity.scale = value)}
        onFocus={() => (focusedProp = 'gravity')}
        onBlur={() => (focusedProp = undefined)}
      />
    </div>
  </div>
</div>
