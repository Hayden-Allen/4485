<script>
  export let errors = undefined
</script>

<div
  class="absolute bottom-0 right-0 w-[39%] max-h-full overflow-x-hidden overflow-y-auto"
>
  <div class="flex flex-col w-full overflow-x-hidden p-4 space-y-2">
    {#each errors as error}
      <div
        class="w-full flex flex-row items-center bg-rose-700 text-rose-100 p-2 rounded-md drop-shadow-md"
      >
        <div class="inline-block w-6 h-6 mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <span class="overflow-hidden text-ellipsis">{error}</span>
      </div>
    {/each}
  </div>
</div>
