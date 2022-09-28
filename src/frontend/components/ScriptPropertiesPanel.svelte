<script>
  import ScriptPropertiesGroup from 'components/ScriptPropertiesGroup.svelte'

  export let entity = undefined
  export let onEditScript = undefined
  export let onDeleteScript = undefined
</script>

{#each entity.behavior.scripts as script}
  <ScriptPropertiesGroup
    {script}
    onEditScript={() => onEditScript(script)}
    onDelete={() => onDeleteScript(script)}
  />
{/each}
