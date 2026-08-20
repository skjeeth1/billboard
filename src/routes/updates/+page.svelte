<script>
  import { Section, NewsCard, AchievementCard, newsData, achievementsData } from '$lib';
  import { onMount } from 'svelte';

  // Filter news data by tags
  const events = newsData.filter((item) => item.tag === 'event');
  const notifications = newsData.filter((item) => item.tag === 'notification');

  // Intercept the native <details> toggle to inject a smooth layout animation for NewsCards
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
  <title>Updates & Achievements | Department of ECE</title>
  <meta
    name="description"
    content="Stay updated with department events, notifications, and celebrate our milestones."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="combined-page">
  <section class="hero-section">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>UPDATES & ACHIEVEMENTS</h1>
      <p>Latest events, announcements, and milestones from our department.</p>
    </div>
  </section>

  <!-- Newsroom: Events -->
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

  <!-- Newsroom: Notifications -->
  <Section
    title="GENERAL NOTIFICATIONS"
    description="Important announcements, deadlines, and academic updates."
  >
    <div class="news-container">
      {#each notifications as item (item.title)}
        <NewsCard
          {item}
          id={item.title.replace(/\s+/g, '-').toLowerCase()}
          group="newsroom-notifications"
        />
      {/each}
    </div>
  </Section>

  <!-- Achievements: Milestones -->
  <Section
    id="achievements"
    title="ACHIEVEMENTS"
    description="A glimpse into the awards, recognitions, and job accomplishments of our students."
  >
    <div class="achievements-grid">
      {#each achievementsData as achievement, i (achievement.title)}
        <AchievementCard {achievement} delay={i * 50} />
      {/each}
    </div>
  </Section>
</div>

<style>
  .combined-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  .hero-section {
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
    /* You can swap this with the achievements background if you prefer */
    background-image: url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.3) saturate(1.2);
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    padding: 0 1rem;
  }

  .hero-content h1 {
    font-size: 4rem; /* Scaled down slightly from 5rem to fit longer title */
    font-weight: 700;
    letter-spacing: 0.1em;
    margin: 0;
    color: #bb9af7;
    text-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
    overflow-wrap: break-word;
  }

  .hero-content p {
    font-size: 1.5rem;
    color: #a9b1d6;
    margin-top: 1rem;
  }

  /* --- Grid Layouts --- */
  .news-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.25rem;
    }
    .hero-content p {
      font-size: 1.1rem;
    }
  }

  @media (min-width: 768px) {
    .hero-content {
      padding: 0 1.5rem;
    }
  }
</style>
