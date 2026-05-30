<script>
  let { children } = $props();
  import { slide, fly } from 'svelte/transition';

  let isOpen = $state(false);

  const menuItems = [
    { label: 'Route1', href: '#r1' },
    { label: 'Route2', href: '#r2' },
    { label: 'Route3', href: '#r3' },
    { label: 'Route4', href: '#r4' },
    { label: 'Route5', href: '#r5' }
  ];

  function toggleMenu() {
    isOpen = !isOpen;

    // Prevent scrolling on the body when the menu is open
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }
  }
</script>

<nav class="navbar" class:bg-solid={isOpen}>
  <div class="nav-container">
    <a
      href="/"
      class="logo"
      onclick={() => {
        isOpen = false;
        document.body.style.overflow = 'auto';
      }}
    >
      <span class="logo-text">[LOGO]</span>
    </a>

    <button class="menu-toggle" aria-label="Toggle menu" onclick={toggleMenu}>
      {#if !isOpen}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      {:else}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      {/if}
    </button>
  </div>
</nav>

{#if isOpen}
  <div class="mobile-menu" transition:slide={{ duration: 200 }}>
    <ul class="menu-list">
      {#each menuItems as item, i (item.label)}
        <li in:fly={{ y: 20, duration: 400, delay: 100 + i * 50 }}>
          <a href={item.href} class="menu-link" onclick={toggleMenu}>
            {item.label}
            {#if item.external}
              <svg
                class="external-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}

{@render children()}

<style>
  /* --- Global / Base --- */
  :global(body) {
    margin: 0;
    background-color: #0c0c10;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
  }

  /* --- Navbar --- */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: rgba(12, 12, 16, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 50;
    border-bottom: 1px solid rgba(187, 154, 247, 0.5);

    box-shadow:
      0 4px 20px rgba(187, 154, 247, 0.4),
      0 0 10px rgba(187, 154, 247, 0.3);
    transition: background-color 0.3s ease;
  }

  .navbar.bg-solid {
    background-color: #0c0c10;
    backdrop-filter: none;
    border-bottom-color: transparent;
    box-shadow: none;
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 100%;
  }

  /* --- Logo --- */
  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: #ffffff;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  /* --- Hamburger Toggle --- */
  .menu-toggle {
    background: transparent;
    border: none;
    color: #e2e8f0;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 60;
  }

  .menu-toggle svg {
    width: 24px;
    height: 24px;
    transition: transform 0.2s ease;
  }

  /* --- Full Screen Menu --- */
  .mobile-menu {
    position: fixed;
    top: 70px; /* Sits exactly below the navbar */
    left: 0;
    width: 100%;
    height: calc(100vh - 70px);
    background-color: #0c0c10;
    z-index: 40;
    padding: 2rem 1.5rem;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .menu-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #8f93a2; /* Muted gray for default state */
    font-size: 1.125rem;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .menu-link:hover,
  .menu-link:active {
    color: #ffffff;
  }

  .external-icon {
    width: 14px;
    height: 14px;
    opacity: 0.7;
  }
</style>
