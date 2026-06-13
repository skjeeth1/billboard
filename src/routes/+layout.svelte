<script>
  let { children } = $props();
  import { slide, fly } from 'svelte/transition';

  let isOpen = $state(false);

  const menuItems = [
    { label: 'Epoch', href: '/epoch' },
    { label: 'Oppam', href: '/oppam' },
    { label: 'Newsroom', href: '/newsroom' },
    { label: 'Alumni', href: '/#alumni' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'About Us', href: '/association' },
    // { label: 'Contact', href: '/#contact' },
  ];

  const socialLinks = {
    instagram: 'https://instagram.com/your_handle',
    github: 'https://github.com/skjeeth1',
    linkedin: 'https://in.linkedin.com/company/ec-association-cet',
    college: 'https://ece.cet.ac.in/'
  };

  function toggleMenu() {
    isOpen = !isOpen;

    if (typeof window !== 'undefined') {
      document.body.style.overflowY = isOpen ? 'hidden' : 'auto';
    }
  }

  function handleResize() {
    if (typeof window !== 'undefined' && window.innerWidth >= 768 && isOpen) {
      isOpen = false;
      document.body.style.overflowY = 'auto';
    }
  }
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<svelte:window onresize={handleResize} />

<nav class="navbar" class:bg-solid={isOpen}>
  <div class="nav-container">
    <a
      href="/"
      class="logo"
      onclick={() => {
        isOpen = false;
        if (typeof window !== 'undefined') document.body.style.overflowY = 'auto';
      }}
    >
      <span class="logo-text">[LOGO]</span>
    </a>

    <ul class="desktop-menu">
      {#each menuItems as item (item.label)}
        <li>
          <a href={item.href} class="desktop-link">
            {item.label}
          </a>
        </li>
      {/each}
    </ul>

    <div class="nav-actions">
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
  </div>
</nav>

{#if isOpen}
  <div class="mobile-menu" transition:slide={{ duration: 300 }}>
    <ul class="menu-list">
      {#each menuItems as item, i (item.label)}
        <li in:fly={{ y: 20, duration: 400, delay: 100 + i * 50 }}>
          <a href={item.href} class="menu-link" onclick={toggleMenu}>
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}

{@render children()}

<footer class="global-footer">
  <div class="footer-content">
    <p class="footer-text">Made by ECE Web Association</p>
    <div class="social-links">
      <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
      <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
      </a>
      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
      </a>
      <a href={socialLinks.college} target="_blank" rel="noopener noreferrer" aria-label="College" title="College">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"></path></svg>
      </a>
    </div>
  </div>
</footer>

<style>
  /* Global / Base */
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
    background-color: #0c0c10;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
    overflow-x: hidden;
    width: 100%;
  }

  :global(h1, h2, h3, h4, h5, h6) {
    font-family: 'Space Grotesk', sans-serif;
  }

  /* Navbar */
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

  /* Logo */
  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: #ffffff;
  }
  .logo-text {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  /* Desktop Menu */
  .desktop-menu {
    display: none;
    list-style: none;
    padding: 0;
    margin: 0;
    align-items: center;
    gap: 2rem;
  }
  .desktop-link {
    text-decoration: none;
    color: #8f93a2;
    font-size: 1rem;
    font-weight: 500;
    transition: color 0.2s ease;
  }
  .desktop-link:hover {
    color: #ffffff;
  }

  /* Nav Actions */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .menu-toggle {
    background: transparent;
    border: none;
    color: #e2e8f0;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 60;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
  .menu-toggle svg {
    width: 24px;
    height: 24px;
    transition:
      transform 0.2s ease,
      color 0.2s ease;
  }
  /* Mobile Menu */
  .mobile-menu {
    position: fixed;
    top: 70px;
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
    color: #8f93a2;
    font-size: 1.125rem;
    font-weight: 500;
    transition: color 0.2s ease;
  }
  .menu-link:hover,
  .menu-link:active {
    color: #ffffff;
  }

  @media (min-width: 768px) {
    .desktop-menu {
      display: flex;
    }
    .menu-toggle {
      display: none;
    }
    .mobile-menu {
      display: none !important;
    }
  }

  /* Footer */
  .global-footer {
    background-color: #0c0c10;
    border-top: 1px solid rgba(187, 154, 247, 0.2);
    padding: 2rem 1.5rem;
  }
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .footer-text {
    color: #8f93a2;
    font-size: 0.95rem;
    font-weight: 500;
    margin: 0;
  }
  .social-links {
    display: flex;
    gap: 1.5rem;
  }
  .social-links a {
    color: #8f93a2;
    transition: color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .social-links a:hover {
    color: #bb9af7;
    transform: translateY(-3px);
  }
  .social-links svg {
    width: 22px;
    height: 22px;
  }

  @media (min-width: 768px) {
    .footer-content {
      flex-direction: row;
      justify-content: space-between;
    }
  }
</style>
