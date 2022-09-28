<script>
  import BehaviorPropertiesGroup from 'components/BehaviorPropertiesGroup.svelte'

  export let entity = undefined
  export let onEditScript = undefined
  export let onDeleteScript = undefined
</script>

{#each entity.behavior.scripts as script}
  <BehaviorPropertiesGroup
    {script}
    onEditScript={() => onEditScript(script)}
    onDelete={() => onDeleteScript(script)}
  />
{/each}
