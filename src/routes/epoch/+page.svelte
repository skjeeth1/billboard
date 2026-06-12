<script>
  import data from './data.json';
</script>

<svelte:head>
  <title>Epoch | The Annual Tech Fest</title>
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
      <p>Innovate. Integrate. Inspire.</p>
    </div>
  </section>

  <section class="epoch-section">
    <h2>Our Vision</h2>
    <p class="section-description">
      Epoch is more than just a tech fest; it's a celebration of innovation, a platform for collaboration, and a beacon for future engineers. We aim to create an environment where creativity meets technology, and ideas transform into reality.
    </p>
  </section>

  <section class="epoch-section latest-event">
    <h2>Latest Event</h2>
    <div class="latest-event-container">
      <div class="event-image">
        <img src={data.latestEvent.image} alt={data.latestEvent.alt} />
      </div>
      <div class="event-info">
        <span class="event-date">{data.latestEvent.date}</span>
        <h3 class="event-title">{data.latestEvent.title}</h3>
        <p class="speaker-info">
          <span class="speaker-name">{data.latestEvent.speaker}</span> | <span class="speaker-company">{data.latestEvent.company}</span>
        </p>
        <p class="event-description">
          {data.latestEvent.description}
        </p>
        <a href={data.latestEvent.link} class="cta-button">{data.latestEvent.link === "#register" ? "Register Now" : "Learn More"}</a>
      </div>
    </div>
  </section>

  <section class="epoch-section previous-events">
    <h2>Previous Events</h2>
    <div class="previous-events-grid">
      {#each data.previousEvents as event}
        <div class="prev-event-card">
          <img src={event.image} alt={event.alt} />
          <div class="prev-event-details">
            <h4>{event.title}</h4>
            <p>{event.speaker}, <strong>{event.company}</strong></p>
            <a href={event.link} class="event-link">Watch Recording &rarr;</a>
          </div>
        </div>
      {/each}
    </div>
  </section>
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
    height: 60vh;
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

  .epoch-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
    text-align: center;
  }

  .epoch-section h2 {
    font-size: 3rem;
    color: #bb9af7;
    margin-bottom: 1rem;
  }

  .section-description {
    font-size: 1.25rem;
    color: #a9b1d6;
    max-width: 800px;
    margin: 0 auto 3rem auto;
  }

  .latest-event-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 3rem;
    text-align: left;
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 16px;
    padding: 2rem;
    margin-top: 2rem;
  }

  .event-image {
    flex: 1;
  }

  .event-image img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    object-fit: cover;
  }

  .event-info {
    flex: 1;
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
  }

  .prev-event-card:hover {
    transform: translateY(-5px);
    border-color: rgba(187, 154, 247, 0.5);
  }

  .prev-event-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
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
    .epoch-section h2 {
      font-size: 2.5rem;
    }
    .latest-event-container {
      flex-direction: column;
      gap: 2rem;
    }
  }
</style>