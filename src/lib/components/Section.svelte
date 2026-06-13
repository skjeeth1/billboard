<script>
  import { reveal } from '$lib/utils/animations.js';

  let { id, title, description, children } = $props();
</script>

<section {id} class="about-section" use:reveal>
  {#if title}
    <h3 class="section-title">{title}</h3>
  {/if}
  {#if description}
    <p class="description">{description}</p>
  {/if}
  
  {@render children?.()}
</section>

<style>
  .about-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 6rem 2rem;
    box-sizing: border-box;
    max-width: 1000px;
    margin: 0 auto;
  }

  .section-title {
    font-size: 5rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #bb9af7;
    margin-bottom: 2rem;
  }

  .description {
    font-size: 1.7rem;
    line-height: 1.6;
    color: #a9b1d6;
    margin-bottom: 2.5rem;
  }

  @media (max-width: 768px) {
    .about-section {
      padding: 4rem 3rem;
    }
    .section-title {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }
    .description{
      font-size: 1.175rem;
      line-height: 1.4;
    }
  }
</style>
