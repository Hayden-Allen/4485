<script>
  import ScriptPropertiesGroup from 'components/ScriptPropertiesGroup.svelte'

  export let entity = undefined
  export let onEditScript = undefined
  export let onDeleteScript = undefined

  $: {
    console.log(entity)
  }
</script>

{#if entity}
  {#each entity.behavior.scripts as script}
    <ScriptPropertiesGroup
      {script}
      onEditScript={() => onEditScript(script)}
      onDelete={() => onDeleteScript(script)}
    />
  {/each}
{/if}
