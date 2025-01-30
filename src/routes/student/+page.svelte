<script>
  let { data } = $props();
</script>

{#if data}
  <p>Logged in: {data.logged_in}</p>
  <p>Logged role: {data.logged_role}</p>
  <p>Logged email: {data.logged_email}</p>
{/if}
