<script>
  import { getImageUrl } from '$lib/utils/images.js';
  
  let { item, id = undefined, group = undefined } = $props();
</script>

<details class="news-card {item.image ? 'has-image' : ''}" {id} name={group}>
  <summary>
    <div class="summary-content">
      <div class="summary-header">
        <span class="news-date">{item.date}</span>
        <div class="toggle-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
      <h4 class="news-title">{item.title}</h4>
      {#if item.speaker || item.company}
        <p class="news-speaker">
          {#if item.speaker}<span class="speaker-name">{item.speaker}</span>{/if}
          {#if item.speaker && item.company} | {/if}
          {#if item.company}<span class="speaker-company">{item.company}</span>{/if}
        </p>
      {/if}
      {#if item.description}
        <p class="news-desc">{item.description}</p>
      {/if}
      {#if item.link && item['link-name']}
        <div class="news-action">
          <a 
            href={item.link} 
            target={item.link.startsWith('http') ? '_blank' : null} 
            rel={item.link.startsWith('http') ? 'noopener noreferrer' : null} 
            class="news-link"
            onclick={(e) => e.stopPropagation()}
          >
            {item['link-name']} &rarr;
          </a>
        </div>
      {/if}
    </div>
  </summary>
  <div class="news-details">
    <hr class="news-divider" />
    <div class="news-details-layout">
      {#if item.image}
        <div class="news-image-wrapper">
          <img src={getImageUrl(item.image)} alt={item.title} class="news-image" />
        </div>
      {/if}
      <div class="news-content-wrapper">
        {#if item.details}
          <p class="news-details-text">{item.details}</p>
        {/if}
      </div>
    </div>
  </div>
</details>

<style>
  .news-card {
    background: linear-gradient(145deg, rgba(26, 27, 38, 0.6), rgba(22, 22, 30, 0.8));
    border: 1px solid rgba(187, 154, 247, 0.15);
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    scroll-margin-top: 100px;
    height: 100%;
    box-sizing: border-box;
  }

  .news-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #bb9af7;
    opacity: 0.3;
    transition: opacity 0.3s ease;
  }

  .news-card[open] {
    transform: translateY(-3px);
    border-color: rgba(187, 154, 247, 0.4);
    box-shadow: 0 8px 30px rgba(187, 154, 247, 0.15);
  }

  .news-card[open]::before {
    opacity: 1;
  }

  @media (hover: hover) {
    .news-card:hover {
      transform: translateY(-3px);
      border-color: rgba(187, 154, 247, 0.4);
      box-shadow: 0 8px 30px rgba(187, 154, 247, 0.15);
    }

    .news-card:hover::before {
      opacity: 1;
    }
  }

  .news-card summary {
    padding: 1.5rem 2rem;
    cursor: pointer;
    list-style: none; /* Hide default marker */
    user-select: none;
  }

  .news-card summary::-webkit-details-marker {
    display: none;
  }

  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .summary-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .news-date {
    color: #bb9af7;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .toggle-icon {
    color: #7aa2f7;
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: rgba(122, 162, 247, 0.1);
    flex-shrink: 0;
  }

  .news-card[open] .toggle-icon {
    transform: rotate(180deg);
    background: rgba(187, 154, 247, 0.2);
    color: #bb9af7;
  }

  .news-title {
    margin: 0;
    font-size: 1.35rem;
    color: #ffffff;
    line-height: 1.3;
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
    padding: 0 2rem 2rem 2rem;
    color: #a9b1d6;
    line-height: 1.6;
    animation: slideDown 0.3s ease-out forwards;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .news-details-layout {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .news-divider {
    margin: 0.5rem 0 1.25rem 0;
    border: none;
    height: 1px;
    background: linear-gradient(90deg, rgba(187, 154, 247, 0.2), transparent);
  }

  .news-image {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 0 auto 1.25rem auto;
    border: 1px solid rgba(187, 154, 247, 0.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .news-details-text {
    margin: 0;
    font-size: 1.05rem;
  }

  .news-action {
    margin-top: 0.25rem;
  }

  .news-link {
    display: inline-block;
    color: #bb9af7;
    text-decoration: underline;
    text-underline-offset: 4px;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .news-link:hover {
    color: #ffffff;
  }

  @media (max-width: 768px) {
    .news-card summary {
      padding: 1.25rem;
    }
    .news-details {
      padding: 0 1.25rem 1.5rem 1.25rem;
    }
  }

  @media (min-width: 768px) {
    .news-card[open] {
      grid-column: 1 / -1;
    }
    
    /* 1. Add this rule to flatten the browser's hidden details wrapper */
    .news-card.has-image[open]::details-content {
      display: contents;
    }

    .news-card.has-image[open] {
      display: grid;
      grid-template-columns: 40% 1fr;
      grid-template-rows: max-content max-content 1fr; 
      grid-template-areas:
        "image summary"
        "image divider"
        "image details";
      gap: 0 2rem;
    }
    
    .news-card.has-image[open] summary {
      grid-area: summary;
      padding: 1.5rem 2rem 0.5rem 0;
    }
    
    /* 2. Your existing display: contents rules stay exactly the same */
    .news-card.has-image[open] .news-details,
    .news-card.has-image[open] .news-details-layout {
      display: contents;
    }
    
    .news-card.has-image[open] .news-image-wrapper {
      grid-area: image;
      padding: 1.5rem 0 1.5rem 1.5rem;
      box-sizing: border-box;
    }
    
    .news-card.has-image[open] .news-image {
      margin: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .news-card.has-image[open] .news-content-wrapper {
      grid-area: details;
      padding: 0 2rem 1.5rem 0;
    }
    
    .news-card.has-image[open] .news-divider {
      grid-area: divider;
      display: block;
      margin: 0.75rem 2rem 1.25rem 0; 
    }
  }
</style>