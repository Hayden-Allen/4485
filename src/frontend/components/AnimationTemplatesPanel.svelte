<script>
  import { onMount, onDestroy } from 'svelte'
  import { v4 as uuidv4 } from 'uuid'
  import {
    dndzone,
    TRIGGERS,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
  } from 'svelte-dnd-action'
  import {
    animationTemplateBank,
    animationTemplateIndex,
  } from '%graphics/AnimationTemplateBank.js'
  import MagnifyingGlass from 'icons/20/mini/magnifying-glass.svelte'

  let searchQuery = ''
  let candidates = [],
    dragItems = []
  let selectedTemplate = undefined
  let shouldIgnoreDndEvents = false

  function handleDndConsider(e) {
    const { trigger, id } = e.detail.info
    if (trigger === TRIGGERS.DRAG_STARTED) {
      const idx = dragItems.findIndex((item) => item.id === id)
      const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`
      e.detail.items = e.detail.items.filter(
        (item) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]
      )
      e.detail.items.splice(idx, 0, { ...dragItems[idx], id: newId })
      dragItems = e.detail.items
      shouldIgnoreDndEvents = true
    } else if (!shouldIgnoreDndEvents) {
      dragItems = e.detail.items
    } else {
      dragItems = [...dragItems]
    }
  }

  function handleDndFinalize(e) {
    if (!shouldIgnoreDndEvents) {
      dragItems = e.detail.items
    } else {
      dragItems = [...dragItems]
      shouldIgnoreDndEvents = false
    }
  }

  function updateDragItems(candidates) {
    dragItems = candidates.map((candidate) => {
      return {
        id: uuidv4(),
        candidate,
        _timer: Date.now(),
        _frame: 0,
      }
    })
  }

  $: {
    const q = searchQuery.trim()
    if (q.length >= 3) {
      candidates = []
      for (const result of animationTemplateIndex.search(q)) {
        candidates.push(animationTemplateBank[parseInt(result.ref)])
      }
      if (candidates.indexOf(selectedTemplate) === -1) {
        if (candidates.length > 0) {
          selectedTemplate = candidates[0]
        } else {
          selectedTemplate = null
        }
      }
    } else {
      candidates = [...animationTemplateBank]
      if (selectedTemplate === null) {
        selectedTemplate = candidates[0]
      }
    }
    updateDragItems(candidates)
  }

  let animationFrame = undefined
  function animate() {
    if (animationFrame) {
      animationFrame = window.requestAnimationFrame(animate)
    }
    const now = Date.now()
    let updated = false
    for (const item of dragItems) {
      if (
        item.candidate.frameTime > 0 &&
        now - item._timer > item.candidate.frameTime
      ) {
        item._frame = (item._frame + 1) % item.candidate.urls.length
        item._timer = now
        updated = true
      }
    }
    if (updated) {
      dragItems = dragItems
    }
  }
  onMount(() => {
    if (typeof window !== 'undefined') {
      animationFrame = window.requestAnimationFrame(animate)
    }
  })
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = undefined
    }
  })
</script>

<div class="grow-1 shrink-1 w-full h-full overflow-hidden flex flex-col">
  <div
    class="grow-0 shrink-0 flex flex-row border-b border-solid border-neutral-700 h-10"
  >
    <input
      bind:value={searchQuery}
      placeholder="Search..."
      class="grow-1 shrink-1 p-2 pl-8 w-full min-w-0 border-0 outline-none bg-neutral-900"
    />
    <div
      class="absolute w-8 h-10 flex items-center justify-center text-neutral-500 pointer-events-none"
    >
      <div class="w-5 h-5"><MagnifyingGlass /></div>
    </div>
  </div>

  <div
    class="grow-1 shrink-1 grid grid-flow-col auto-cols-max auto-rows-max p-4 gap-4 w-full h-full overflow-x-hidden overflow-y-auto"
    use:dndzone={{
      type: 'Animation',
      dropFromOthersDisabled: true,
      morphDisabled: true,
      dropTargetStyle: '',
      items: dragItems,
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each dragItems as item (item.id)}
      <div
        class="flex flex-col items-center justify-center grow-0 shrink-0 px-4 py-2 hover:bg-neutral-800 focus:bg-neutral-700 transition-all rounded-md"
      >
        <div
          class="w-16 h-16 grow-0 shrink-0 overflow-hidden flex flex-row items-center justify-center bg-neutral-800 border border-solid border-neutral-700"
        >
          <img
            class="max-w-full max-h-full"
            src={item.candidate.urls[item._frame]}
            alt=""
          />
        </div>
        <div
          class="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center mt-2"
        >
          {item.candidate.name}
        </div>
      </div>
    {/each}
  </div>
</div>
