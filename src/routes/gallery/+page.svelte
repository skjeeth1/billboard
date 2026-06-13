<script>
  import galleryData from '$lib/data/gallery.json';
  import Section from '$lib/components/Section.svelte';
  import GalleryCarousel from '$lib/components/GalleryCarousel.svelte';
</script>

<svelte:head>
  <title>Gallery | Department of ECE</title>
  <meta name="description" content="A visual journey through our department's events and milestones." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="gallery-page">
  <section class="gallery-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>GALLERY</h1>
      <p>Moments captured from our events, workshops, and everyday life.</p>
    </div>
  </section>

  <div class="gallery-sections">
    {#each galleryData as section (section.id)}
      <Section title={section.title} description={section.description}>
        <GalleryCarousel images={section.images} />
      </Section>
    {/each}
  </div>
</div>

<style>
  .gallery-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
    min-height: 100vh;
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    overflow-x: hidden;
    padding-bottom: 4rem;
  }

  .gallery-hero {
    position: relative;
    width: 100%;
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
    background-image: url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.3) saturate(1.2);
    z-index: 1;
  }

  .hero-content { position: relative; z-index: 2; padding: 0 1rem; }
  .hero-content h1 { font-size: 4rem; font-weight: 700; letter-spacing: 0.1em; margin: 0; color: #bb9af7; text-shadow: 0 0 15px rgba(187, 154, 247, 0.5); }
  .hero-content p { font-size: 1.5rem; color: #a9b1d6; }

  .gallery-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .hero-content h1 { font-size: 2.25rem; }
    .hero-content p { font-size: 1.125rem; }
  }
</style>