<script>
  import { Section, AchievementCard, achievementsData } from '$lib';
</script>

<svelte:head>
  <title>Achievements | Department of ECE</title>
  <meta
    name="description"
    content="Celebrating the milestones and successes of our students and faculty."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="achievements-page">
  <section class="achievements-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>ACHIEVEMENTS</h1>
      <p>Celebrating excellence and innovation in our department.</p>
    </div>
  </section>

  <Section
    title="OUR MILESTONES"
    description="A glimpse into the awards, recognitions, and extraordinary accomplishments of our students and faculty over the years. We take pride in pushing boundaries and setting new benchmarks in technology and research."
  >
    <div class="achievements-grid">
      {#each achievementsData as achievement, i (achievement.title)}
        <AchievementCard {achievement} delay={i * 50} />
      {/each}
    </div>
  </Section>
</div>

<style>
  .achievements-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  .achievements-hero {
    position: relative;
    width: 100%;
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
    /* A thematic background image for achievements/success */
    background-image: url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80');
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
    font-size: 4rem;
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
  }

  /* Reuse the grid classes from the home page! */
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.25rem;
    }
  }

  @media (min-width: 768px) {
    .hero-content {
      padding: 0 1.5rem;
    }
  }
</style>
