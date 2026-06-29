<script>
  import { Section, NewsCard, newsData } from '$lib';
  import { onMount } from 'svelte'; // Import onMount

  const events = newsData.filter((item) => item.tag === 'event');
  const notifications = newsData.filter((item) => item.tag === 'notification');

  // Intercept the native <details> toggle to inject a smooth layout animation
  onMount(() => {
    const handleGridReflow = (e) => {
      const summary = e.target.closest('summary');
      
      // Check if a summary was clicked and if the browser supports View Transitions
      if (!summary || !document.startViewTransition) return;

      const details = summary.parentElement;

      // Prevent the default instant HTML snap
      e.preventDefault();

      // Let the browser automatically calculate and animate the grid layout changes
      document.startViewTransition(() => {
        details.open = !details.open;
      });
    };

    // Attach listener to capture clicks on the summary elements
    document.addEventListener('click', handleGridReflow);
    
    // Cleanup listener on destroy
    return () => document.removeEventListener('click', handleGridReflow);
  });
</script>

<svelte:head>
  <title>Newsroom | Department of ECE</title>
  <meta
    name="description"
    content="Stay updated with department events and general notifications."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="newsroom-page">
  <section class="newsroom-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>NEWSROOM</h1>
      <p>Stay updated with department events and announcements.</p>
    </div>
  </section>

  <Section
    title="DEPARTMENT EVENTS"
    description="Upcoming and recent departmental activities, seminars, and workshops."
  >
    <div class="news-container">
      {#each events as item (item.title)}
        <NewsCard {item} group="newsroom-events" />
      {/each}
    </div>
  </Section>

  <Section
    title="GENERAL NOTIFICATIONS"
    description="Important announcements, deadlines, and academic updates."
  >
    <div class="news-container">
      {#each notifications as item (item.title)}
        <NewsCard {item}
        id={item.title.replace(/\s+/g, '-').toLowerCase()} 
        group="newsroom-notifications" />
      {/each}
    </div>
  </Section>
</div>

<style>
  .newsroom-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
    min-height: 100vh;
  }

  .newsroom-hero {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.3) saturate(1.2);
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
  }

  .hero-content h1 {
    font-size: 5rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    margin: 0;
    color: #bb9af7;
    text-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }

  .hero-content p {
    font-size: 1.5rem;
    color: #a9b1d6;
  }

  /* --- News Card Styles --- */
  .news-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.5rem;
    }
  }
</style>