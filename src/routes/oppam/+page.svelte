<script>
  import oppamData from '$lib/data/oppam.json';
  import Section from '$lib/components/Section.svelte';
</script>

<svelte:head>
  <title>Oppam | Study Resources</title>
  <meta name="description" content="Access semester-wise study materials and resources." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="oppam-page">
  <section class="oppam-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>OPPAM</h1>
      <p>Your ultimate repository for study materials.</p>
    </div>
  </section>

  <Section 
    title="ACADEMIC RESOURCES"
    description="Find subject-wise notes, previous year question papers, and study materials curated for each semester below."
  >
    <div class="semesters-container">
      {#each oppamData as sem (sem.semester)}
        <details class="semester-dropdown">
          <summary>{sem.semester}</summary>
          <ul class="subject-list">
            {#each sem.subjects as subject (subject.name)}
              <li>
                <span class="subject-name">{subject.name}</span>
                <a href={subject.link} target="_blank" rel="noopener noreferrer" class="drive-link">
                  View Materials &rarr;
                </a>
              </li>
            {/each}
          </ul>
        </details>
      {/each}
    </div>
  </Section>
</div>

<style>
  .oppam-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
    min-height: 100vh;
  }

  .oppam-hero {
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
    /* Placeholder background specific to Oppam */
    background-image: url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80');
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

  /* --- Accordion Styles --- */
  .semesters-container {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
  }

  .semester-dropdown {
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.3s ease;
  }

  .semester-dropdown:hover {
    border-color: rgba(187, 154, 247, 0.5);
  }

  .semester-dropdown summary {
    padding: 1.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #c0caf5;
    cursor: pointer;
    list-style: none; /* Hide default marker */
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }

  .semester-dropdown summary::-webkit-details-marker {
    display: none;
  }

  .semester-dropdown summary::after {
    content: '+';
    color: #bb9af7;
    font-size: 1.5rem;
    transition: transform 0.3s ease;
  }

  .semester-dropdown[open] summary::after {
    content: '−';
  }

  .subject-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid rgba(187, 154, 247, 0.1);
  }

  .subject-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(187, 154, 247, 0.1);
    transition: background-color 0.2s ease;
  }

  .subject-list li:last-child {
    border-bottom: none;
  }

  .subject-list li:hover {
    background-color: rgba(26, 27, 38, 0.8);
  }

  .subject-name {
    color: #a9b1d6;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .drive-link {
    color: #bb9af7;
    text-decoration: none;
    font-weight: 600;
    background-color: rgba(187, 154, 247, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .drive-link:hover {
    background-color: #bb9af7;
    color: #1a1b26;
    box-shadow: 0 0 10px rgba(187, 154, 247, 0.4);
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 3.5rem;
    }
  }

  @media (max-width: 600px) {
    .subject-list li {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
</style>
