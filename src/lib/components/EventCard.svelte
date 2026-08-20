<script>
  import { getImageUrl } from '$lib';

  // Individual props for the event data using Svelte 5 runes
  let { image, alt, date, title, speaker, company, details, link } = $props();
</script>

<div id="upcoming" class="latest-event-container">
  <div class="event-image">
    <img src={getImageUrl(image)} {alt} />
  </div>
  <div class="event-info">
    <span class="event-date">{date}</span>
    <h3 class="event-title">{title}</h3>
    <p class="speaker-info">
      <span class="speaker-name">{speaker}</span> |
      <span class="speaker-company">{company}</span>
    </p>
    <p class="event-description">
      {details}
    </p>

    <!-- Conditionally render the button only if a link is supplied -->
    {#if link}
      <a href={link} class="cta-button">
        {link === '#register' ? 'GMeet Link' : 'Learn More'}
      </a>
    {/if}
  </div>
</div>

<style>
  .latest-event-container {
    display: flex;
    text-align: left;
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 16px;
    overflow: hidden;
    margin-top: 2rem;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.2);
    scroll-margin-top: 100px;
    font-family: 'JetBrains Mono', monospace;
  }

  .event-image {
    flex: 0 0 40%;
    min-height: 0;
  }

  .event-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .event-info {
    flex: 1;
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
    .event-info {
      padding: 1.5rem;
    }
    .event-title {
      font-size: 1.5rem;
    }
    .event-description {
      font-size: 0.9rem;
    }
    .event-image {
      width: 100%;
      height: auto;
    }
    .latest-event-container {
      flex-direction: column;
    }
  }
</style>
