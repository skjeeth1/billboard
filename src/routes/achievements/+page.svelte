<script>
  import { fly } from 'svelte/transition';
  import achievementsData from '$lib/data/achievements.json';
  import Section from '$lib/components/Section.svelte';
  import { getImageUrl } from '$lib/utils/images.js';
</script>

<svelte:head>
  <title>Achievements | Department of ECE</title>
  <meta name="description" content="Celebrating the milestones and successes of our students and faculty." />
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
        <div class="achievement-card" in:fly={{ y: 20, duration: 400, delay: i * 50 }}>
          <div class="achievement-image">
            <img src={getImageUrl(achievement.image)} alt={achievement.title} />
          </div>
          <div class="achievement-content">
            <span class="date-badge">{achievement.date}</span>
            <h4>{achievement.title}</h4>
            <p class="names">{achievement.names.join(', ')}</p>
            <p class="description">{achievement.description}</p>
          </div>
        </div>
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
  .achievement-card {
    background-color: rgba(26, 27, 38, 0.4);
    border: 1px solid rgba(187, 154, 247, 0.15);
    border-radius: 16px;
    overflow: hidden;
    text-align: left;
    transition: border-color 0.3s ease, transform 0.3s ease, background-color 0.3s ease;
  }
  .achievement-card:hover {
    border-color: rgba(187, 154, 247, 0.5);
    background-color: rgba(26, 27, 38, 0.7);
    transform: translateY(-5px);
  }
  .achievement-image { width: 100%; height: 200px; overflow: hidden; }
  .achievement-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .achievement-content { padding: 1.5rem; }
  
  .date-badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.75rem; background-color: rgba(187, 154, 247, 0.15); color: #bb9af7; }
  .achievement-content h4 { margin: 0 0 0.5rem 0; font-size: 1.25rem; color: #c0caf5; line-height: 1.4; }
  .achievement-content .names { margin: 0 0 1rem 0; font-size: 0.95rem; color: #bb9af7; font-weight: 600; }
  .achievement-content .description { margin: 0; font-size: 0.95rem; color: #a9b1d6; line-height: 1.6; }

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