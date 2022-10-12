<script>
  import { dndzone } from 'svelte-dnd-action'
  import ArrowLeft from 'icons/24/outline/bold-arrows/arrow-left.svelte'
  import ArrowRight from 'icons/24/outline/bold-arrows/arrow-right.svelte'
  import ArrowUp from 'icons/24/outline/bold-arrows/arrow-up.svelte'
  import ArrowDown from 'icons/24/outline/bold-arrows/arrow-down.svelte'
  import ArrowUpLeft from 'icons/24/outline/bold-arrows/arrow-up-left.svelte'
  import ArrowUpRight from 'icons/24/outline/bold-arrows/arrow-up-right.svelte'
  import ArrowDownLeft from 'icons/24/outline/bold-arrows/arrow-down-left.svelte'
  import ArrowDownRight from 'icons/24/outline/bold-arrows/arrow-down-right.svelte'

  export let texture = undefined
  export let textureIdx = undefined
  export let onSetTextureProps = undefined

  let dragItems = []
  let hovered = false

  function handleDndConsider(e) {
    dragItems = e.detail.items
  }

  function handleDndFinalize(e) {
    if (e.detail.items.length > 0 && e.detail.items[0].candidate) {
      onSetTextureProps(e.detail.items[0].candidate)
    }
    dragItems = []
  }

  let animationFrame = undefined
  let curFrame = 0
  let timer = Date.now()
  function animate() {
    if (animationFrame) {
      animationFrame = window.requestAnimationFrame(animate)
    }
    const now = Date.now()
    console.log(now)
    if (texture.frameTime > 0 && now - timer > texture.frameTime) {
      curFrame = (curFrame + 1) % texture.frameCount
      timer = now
      dragItems = dragItems
    }
  }

  function resetAnim(texture) {
    /*
    if (typeof window !== 'undefined') {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
      animationFrame = undefined
    }

    curFrame = 0
    timer = Date.now()

    if (typeof window !== 'undefined' && texture.frameCount > 0) {
      animationFrame = window.requestAnimationFrame(animate)
    }
    */
  }

  $: {
    resetAnim(texture)
  }
</script>

<div
  class="w-16 h-16 bg-neutral-800 border border-solid border-neutral-700 overflow-hidden flex flex-row items-center justify-center relative"
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
>
  <img class="max-w-full max-h-full" src={texture.urls[curFrame]} alt="" />
  <div
    class={`absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center ${
      hovered ? 'opacity-100' : 'opacity-0'
    } transition-all bg-black/50`}
  >
    <div class="w-6 h-6 text-neutral-100">
      {#if textureIdx === 0}
        <ArrowUpLeft />
      {:else if textureIdx === 1}
        <ArrowUp />
      {:else if textureIdx === 2}
        <ArrowUpRight />
      {:else if textureIdx === 3}
        <ArrowLeft />
      {:else if textureIdx === 4}
        <!---->
      {:else if textureIdx === 5}
        <ArrowRight />
      {:else if textureIdx === 6}
        <ArrowDownLeft />
      {:else if textureIdx === 7}
        <ArrowDown />
      {:else if textureIdx === 8}
        <ArrowDownRight />
      {/if}
    </div>
  </div>
  <div
    class="absolute top-0 left-0 w-full h-full"
    use:dndzone={{
      type: 'Animation',
      dragDisabled: true,
      morphDisabled: true,
      dropTargetStyle: '',
      items: dragItems,
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each dragItems as item (item.id)}
      <div class="hidden" />
    {/each}
  </div>
</div>
