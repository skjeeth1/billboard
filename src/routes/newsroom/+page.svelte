<script>
  import newsData from '$lib/data/newsroom.json';
  import Section from '$lib/components/Section.svelte';

  const events = newsData.filter((item) => item.tag === 'event');
  const notifications = newsData.filter((item) => item.tag === 'notification');
</script>

<svelte:head>
  <title>Newsroom | Department of ECE</title>
  <meta name="description" content="Stay updated with department events and general notifications." />
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
        <details class="news-dropdown">
          <summary>
            <div class="summary-content">
              <span class="news-date">{item.date}</span>
              <h4 class="news-title">{item.title}</h4>
              <p class="news-desc">{item.description}</p>
            </div>
          </summary>
          <div class="news-details">
            <hr class="news-divider" />
            {#if item.image}
              <img src={item.image} alt={item.title} class="news-image" />
            {/if}
            <p>{item.details}</p>
          </div>
        </details>
      {/each}
    </div>
  </Section>

  <Section 
    title="GENERAL NOTIFICATIONS"
    description="Important announcements, deadlines, and academic updates."
  >
    <div class="news-container">
      {#each notifications as item (item.title)}
        <details class="news-dropdown">
          <summary>
            <div class="summary-content">
              <span class="news-date">{item.date}</span>
              <h4 class="news-title">{item.title}</h4>
              <p class="news-desc">{item.description}</p>
            </div>
          </summary>
          <div class="news-details">
            <hr class="news-divider" />
            {#if item.image}
              <img src={item.image} alt={item.title} class="news-image" />
            {/if}
            <p>{item.details}</p>
          </div>
        </details>
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
    /* A thematic background image for a newsroom/conference */
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
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
  }

  .news-dropdown {
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.3s ease, background-color 0.3s ease;
  }

  .news-dropdown:hover {
    border-color: rgba(187, 154, 247, 0.5);
    background-color: rgba(26, 27, 38, 0.8);
  }

  .news-dropdown summary {
    padding: 1.5rem;
    cursor: pointer;
    list-style: none; /* Hide default marker */
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    user-select: none;
  }

  .news-dropdown summary::-webkit-details-marker {
    display: none;
  }

  .news-dropdown summary::after {
    content: '+';
    color: #bb9af7;
    font-size: 1.5rem;
    transition: transform 0.3s ease;
    margin-left: 1rem;
    flex-shrink: 0;
  }

  .news-dropdown[open] summary::after {
    content: '−';
  }

  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .news-date {
    color: #bb9af7;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .news-title {
    margin: 0;
    font-size: 1.25rem;
    color: #c0caf5;
  }

  .news-desc {
    margin: 0;
    color: #a9b1d6;
    font-size: 1rem;
  }

  .news-details {
    padding: 0 1.5rem 1.5rem 1.5rem;
    color: #a9b1d6;
    line-height: 1.6;
  }

  .news-divider {
    margin: 0.5rem 0 1.25rem 0;
    border: none;
    border-top: 1px solid rgba(187, 154, 247, 0.1);
  }

  .news-image {
    display: block;
    width: 100%;
    max-width: 500px;
    max-height: 350px;
    object-fit: cover;
    border-radius: 8px;
    margin: 0 auto 1.25rem auto;
  }

  .news-details p {
    margin: 0;
  }

  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.5rem;
    }
  }
</style>