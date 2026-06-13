<script>
  import { fly } from 'svelte/transition';
  import { getImageUrl } from '$lib/utils/images.js';
  import { onMount, onDestroy } from 'svelte';

  let { images } = $props();

  let currentIndex = $state(0);
  let navDirection = $state(1);

  let autoplayTimer;
  let interactionTimeout;

  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      navigate('right', false);
    }, 4000);
  }

  onMount(() => {
    if (images && images.length > 1) {
      startAutoplay();
    }
  });

  onDestroy(() => {
    clearInterval(autoplayTimer);
    clearTimeout(interactionTimeout);
  });

  function navigate(direction, isManual = true) {
    if (!images || images.length <= 1) return;

    if (isManual) {
      clearInterval(autoplayTimer);
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        startAutoplay();
      }, 7000);
    }

    if (direction === 'left') {
      navDirection = -1;
      currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    } else {
      navDirection = 1;
      currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    }
  }
</script>

<div class="carousel-wrapper">
  <button 
    class="scroll-btn left" 
    onclick={() => navigate('left')} 
    aria-label="Previous image"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </button>

  <div class="carousel-container">
    <div class="image-card">
      {#key currentIndex}
        <div 
          class="image-wrapper"
          in:fly={{ x: `${navDirection * 100}%`, duration: 400 }}
          out:fly={{ x: `${-navDirection * 100}%`, duration: 400 }}
        >
          <img 
            src={getImageUrl(images[currentIndex].src)} 
            alt={images[currentIndex].alt} 
          />
        </div>
      {/key}
    </div>
  </div>

  <button 
    class="scroll-btn right" 
    onclick={() => navigate('right')} 
    aria-label="Next image"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </button>
</div>

<style>
  .carousel-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 1rem;
  }
  .carousel-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;
    flex: 1;
    min-width: 0;
    height: 65vh;
    min-height: 400px;
    max-height: 800px;
  }
  .image-card { width: 100%; height: 100%; overflow: hidden; display: grid; place-items: center; }
  .image-wrapper {
    grid-area: 1 / 1; width: 100%; height: 100%;
    max-width: min(1000px, 90vw); min-width: 0; min-height: 0;
    display: flex; justify-content: center; align-items: center;
  }
  .image-wrapper img {
    max-width: 100%; max-height: 100%; width: auto; height: auto;
    border-radius: 12px; border: 1px solid rgba(187, 154, 247, 0.15);
    transition: transform 0.3s ease, border-color 0.3s ease;
    background-color: #1a1b26;
  }
  .image-card:hover .image-wrapper img { transform: scale(1.03); border-color: rgba(187, 154, 247, 0.5); }
  
  .scroll-btn {
    background: rgba(26, 27, 38, 0.8); color: #bb9af7;
    border: 1px solid rgba(187, 154, 247, 0.3); border-radius: 50%;
    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: absolute; z-index: 10; transition: all 0.2s ease;
  }
  .scroll-btn:hover { background: #bb9af7; color: #1a1b26; transform: scale(1.1); }
  .scroll-btn.left { left: -24px; }
  .scroll-btn.right { right: -24px; }

  @media (max-width: 768px) {
    .carousel-container { height: 45vh; min-height: 300px; }
    .scroll-btn.left { left: 0; }
    .scroll-btn.right { right: 0; }
  }
</style>