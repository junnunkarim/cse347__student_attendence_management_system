<script>
  let { data } = $props();
</script>

{#if data}
  <p>{data.logged_in}</p>
  <p>{data.logged_email}</p>
{/if}
