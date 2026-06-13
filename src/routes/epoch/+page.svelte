<script>
  import epochData from '$lib/data/epoch.json';
  import Section from '$lib/components/Section.svelte';
  import { getImageUrl } from '$lib/utils/images.js';

  const latestEvent = epochData.find((event) => event.tag === 'latest');
  const previousEvents = epochData.filter((event) => event.tag !== 'latest');
</script>

<svelte:head>
  <title>Epoch</title>
  <meta name="description" content="Dive deep into Epoch, the annual technical symposium of CET." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="epoch-page">
  <section class="epoch-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>EPOCH</h1>
      <p>
        <span class="sentence">Building Competence.</span>
        <span class="sentence">Shaping Careers.</span>
        <span class="sentence">Creating Opportunities.</span>
      </p>
    </div>
  </section>

  <Section 
    title="VISION" 
    description="EPOCH (Electronics Placement & Outcome Competency Hub) is a flagship initiative of the Department of Electronics and Communication Engineering dedicated to enhancing student employability, professional competencies, and career outcomes. It serves as a structured platform that brings together faculty mentors, industry insights, alumni support, and student coordinators to prepare learners for successful careers in both core and non-core domains." 
  />

  <Section title="WHAT WE PROVIDE">
    <div class="provide-content">
      <p>
        EPOCH equips students with the skills and confidence required to excel in recruitment processes through:
      </p>
      <ul class="feature-list">
        <li>
          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          Regular aptitude and technical assessments
        </li>
        <li>
          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          Placement-oriented training
        </li>
        <li>
          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          Mock interviews and group discussions
        </li>
        <li>
          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          Industry interactions and technical workshops
        </li>
        <li>
          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          Career guidance sessions
        </li>
      </ul>
      <p>
        The initiative also fosters continuous learning, industry exposure, and performance tracking, creating a holistic ecosystem for professional growth and placement readiness.
      </p>
    </div>
  </Section>

  <Section title="UPCOMING EVENT">
    <div id="upcoming" class="latest-event-container">
      <div class="event-image">
        <img src={getImageUrl(latestEvent.image)} alt={latestEvent.alt} />
      </div>
      <div class="event-info">
        <span class="event-date">{latestEvent.date}</span>
        <h3 class="event-title">{latestEvent.title}</h3>
        <p class="speaker-info">
          <span class="speaker-name">{latestEvent.speaker}</span> |
          <span class="speaker-company">{latestEvent.company}</span>
        </p>
        <p class="event-description">
          {latestEvent.description}
        </p>
        <a href={latestEvent.link} class="cta-button"
          >{latestEvent.link === '#register' ? 'GMeet Link' : 'Learn More'}</a
        >
      </div>
    </div>
  </Section>

  <Section title="PREVIOUS EVENTS">
    <div class="previous-events-grid">
      {#each previousEvents as event (event.alt)}
        <div class="prev-event-card" id={event.alt.replace(/\s+/g, '-').toLowerCase()}>
          <img src={getImageUrl(event.image)} alt={event.alt} />
          <div class="prev-event-details">
            <h4>{event.title}</h4>
            <p>{event.speaker}, <strong>{event.company}</strong></p>
            <a href={event.link} class="event-link">Event Drive &rarr;</a>
          </div>
        </div>
      {/each}
    </div>
  </Section>
</div>

<style>
  .epoch-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
  }

  .epoch-hero {
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
    background-image: url('https://images.unsplash.com/photo-1534665482403-a909d0d97c67?auto=format&fit=crop&w=1200&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.4);
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

  .sentence {
    display: inline-block;
  }

  .provide-content {
    font-size: 1.7rem;
    line-height: 1.6;
    color: #a9b1d6;
    margin-bottom: 2.5rem;
  }

  .provide-content p {
    margin: 0 0 1rem 0;
  }

  .feature-list {
    list-style: none;
    padding-left: 0.5rem;
    margin: 1.5rem 0;
  }

  .feature-list li {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .arrow-icon {
    color: #bb9af7;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-top: 0.2rem;
  }

  .latest-event-container {
    display: flex;
    flex-direction: column;
    text-align: left;
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 16px;
    overflow: hidden;
    margin-top: 2rem;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.2);
    scroll-margin-top: 100px;
  }

  .event-image {
    width: 100%;
  }

  .event-image img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  .event-info {
    padding: 2.5rem;
  }

  .event-date {
    display: inline-block;
    font-weight: 600;
    color: #bb9af7;
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
  }

  .event-title {
    font-size: 2rem;
    color: #c0caf5;
    margin: 0 0 1rem 0;
  }

  .speaker-info {
    font-size: 1.1rem;
    color: #7aa2f7;
    margin: 0 0 1.5rem 0;
  }

  .speaker-name {
    font-weight: 700;
    color: #a9b1d6;
  }

  .event-description {
    color: #a9b1d6;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .previous-events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .prev-event-card {
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 12px;
    overflow: hidden;
    text-align: left;
    transition: transform 0.3s ease;
    scroll-margin-top: 100px;
  }

  .prev-event-card:hover {
    transform: translateY(-5px);
    border-color: rgba(187, 154, 247, 0.5);
  }

  .prev-event-card img {
    width: 100%;
    height: auto;
    display: block;
  }

  .prev-event-details {
    padding: 1.5rem;
  }

  .prev-event-details h4 {
    font-size: 1.25rem;
    color: #c0caf5;
    margin: 0 0 0.5rem 0;
  }

  .prev-event-details p {
    color: #a9b1d6;
    margin: 0 0 1.5rem 0;
    font-size: 0.95rem;
  }

  .event-link {
    color: #bb9af7;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
  }

  .event-link:hover {
    color: #c0caf5;
  }

  .cta-button {
    display: inline-block;
    padding: 0.75rem 2rem;
    background-color: rgba(187, 154, 247, 0.1);
    color: #bb9af7;
    border: 1px solid #bb9af7;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 1.1rem;
  }

  .cta-button:hover {
    background-color: #bb9af7;
    color: #1a1b26;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }

  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 3rem;
    }
    .provide-content {
      font-size: 1.175rem;
      line-height: 1.4;
    }
    .event-info {
      padding: 1.5rem;
    }
  }
</style>
