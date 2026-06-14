<script>
  import { getImageUrl } from '$lib/utils/images.js';
  
  let { item } = $props();
</script>

<details class="news-dropdown">
  <summary>
    <div class="summary-content">
      <span class="news-date">{item.date}</span>
      <h4 class="news-title">{item.title}</h4>
      {#if item.speaker || item.company}
        <p class="news-speaker">
          {#if item.speaker}<span class="speaker-name">{item.speaker}</span>{/if}
          {#if item.speaker && item.company} | {/if}
          {#if item.company}<span class="speaker-company">{item.company}</span>{/if}
        </p>
      {/if}
      <p class="news-desc">{item.description}</p>
    </div>
  </summary>
  <div class="news-details">
    <hr class="news-divider" />
    {#if item.image}
      <img src={getImageUrl(item.image)} alt={item.title} class="news-image" />
    {/if}
    <p>{item.details}</p>
    {#if item.link && item['link-name']}
      <div class="news-action">
        <a 
          href={item.link} 
          target={item.link.startsWith('http') ? '_blank' : null} 
          rel={item.link.startsWith('http') ? 'noopener noreferrer' : null} 
          class="news-link"
        >{item['link-name']} &rarr;</a>
      </div>
    {/if}
  </div>
</details>

<style>
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

  .news-speaker {
    margin: 0;
    font-size: 1.05rem;
    color: #7aa2f7;
  }

  .speaker-name {
    font-weight: 700;
    color: #a9b1d6;
  }

  .speaker-company {
    font-weight: 600;
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
    max-height: 350px;
    object-fit: cover;
    border-radius: 8px;
    margin: 0 auto 1.25rem auto;
  }

  .news-details p {
    margin: 0;
  }

  .news-action {
    margin-top: 1.5rem;
  }

  .news-link {
    display: inline-block;
    color: #bb9af7;
    text-decoration: underline;
    text-underline-offset: 4px;
    font-weight: 600;
    font-size: 0.95rem;
    transition: color 0.3s ease;
  }
  .news-link:hover {
    color: #c0caf5;
  }
</style>