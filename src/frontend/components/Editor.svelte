<script>
  import Viewport from './Viewport.svelte'
</script>

<div class="w-full h-full p-1 flex flex-col space-y-1 bg-gray-900 overflow-hidden">
  <div class="grow shrink basis-0 overflow-hidden flex flex-row space-x-1">
    <div class="grow shrink basis-0 p-2 overflow-hidden bg-gray-800 border-solid border border-gray-700">
      <Viewport />
    </div>
    <div class="grow shrink basis-0 overflow-auto bg-gray-800 border-solid border border-gray-700" />
  </div>
  <div class="grow shrink basis-0 overflow-hidden flex flex-row space-x-1">
    <div class="grow shrink basis-0 overflow-auto bg-gray-800 border-solid border border-gray-700" />
    <div class="grow shrink basis-0 overflow-auto bg-gray-800 border-solid border border-gray-700" />
    <div class="grow shrink basis-0 overflow-auto bg-gray-800 border-solid border border-gray-700" />
  </div>
</div>
