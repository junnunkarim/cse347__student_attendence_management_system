<script>
  let { children, data } = $props();

  import "@picocss/pico/css/pico.css";
  // import "../app.css";
</script>

{#if data}
  {#if data.nav_info.show_nav}
    <nav class="container">
      <ul>
        {#each data.nav_info.render_items as item}
          <li>
            <a
              href={item.link}
              class="primary"
              data-sveltekit-reload={item.name === "logout" ? "true" : "false"}
            >{item.name.toUpperCase()}</a>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
{/if}

<main class="container">
  {@render children()}
</main>
