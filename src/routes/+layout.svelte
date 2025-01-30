<script>
  let { children } = $props();

  import "@picocss/pico";
  // import "../app.css";
</script>

<main class="container">
  {@render children()}
</main>
