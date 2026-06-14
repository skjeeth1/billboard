<script>
  import { fly } from 'svelte/transition';
  import { getImageUrl } from '$lib/utils/images.js';

  let { achievement, delay = 0 } = $props();
</script>

<div class="achievement-card" in:fly={{ y: 20, duration: 400, delay }}>
  <div class="achievement-image">
    <img src={getImageUrl(achievement.image)} alt={achievement.title || achievement.name} />
  </div>
  <div class="achievement-content">
    {#if achievement.date}
      <span class="date-badge">{achievement.date}</span>
    {/if}
    <h4>{achievement.title || achievement.name}</h4>
    {#if achievement.names}
      <p class="names">{achievement.names.join(', ')}</p>
    {:else if achievement.field}
      <p class="names">{achievement.field}</p>
    {/if}
    <p class="description">{achievement.description}</p>
    {#if achievement.tags}
      <div class="tags-container">
        {#each Object.entries(achievement.tags) as [tag, value]}
          <span class="tag"><strong>{tag}:</strong> {value}</span>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
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
  
  .date-badge { display: inline-block; font-size: 1rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.75rem; color: #bb9af7; }
  .achievement-content h4 { margin: 0 0 0.5rem 0; font-size: 1.25rem; color: #c0caf5; line-height: 1.4; }
  .achievement-content .names { margin: 0 0 1rem 0; font-size: 1rem; color: #bb9af7; font-weight: 600; }
  .achievement-content .description { margin: 0; font-size: 1rem; color: #a9b1d6; line-height: 1.6; }

  .tags-container { margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .tag { display: inline-block; font-size: 0.85rem; color: #a9b1d6; }
  .tag strong { color: #bb9af7; margin-right: 0.25rem; }
</style>