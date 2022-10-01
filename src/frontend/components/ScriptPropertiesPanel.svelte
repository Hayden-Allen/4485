<script>
  import ScriptPropertiesGroup from 'components/ScriptPropertiesGroup.svelte'

  export let scripts = undefined
  export let onEditScript = undefined
  export let onDeleteScript = undefined
</script>

{#each scripts as script}
  <ScriptPropertiesGroup
    {script}
    onEditScript={() => onEditScript(script)}
    onDelete={() => onDeleteScript(script)}
  />
{/each}
