<script>
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  let { title, description, tag = 'NEW', image } = $props();
  
  let visible = $state(true);

  // Generate a URL-friendly anchor ID from the title
  let cardId = $derived(title.replace(/\s+/g, '-').toLowerCase());

  onMount(() => {
    // Lock scrolling on the main page when the modal mounts
    document.body.style.overflow = 'hidden';

    // Cleanup function ensures scrolling is restored if the component is destroyed
    return () => {
      document.body.style.overflow = '';
    };
  });

  function dismiss() {
    visible = false;
    // Restore scrolling when the user manually clicks close or the link
    document.body.style.overflow = '';
  }
</script>

{#if visible}
  <div class="modal-backdrop" transition:fade={{ duration: 300 }}>
    
    <div class="modal-box" in:fly={{ y: 50, duration: 400, delay: 100 }} out:fly={{ y: 50, duration: 300 }}>
      
      <div class="modal-action-bar">
        <button class="close-btn" aria-label="Close notification" onclick={dismiss}>
          &times;
        </button>
      </div>

      {#if image}
        <img src={image} alt={title} class="modal-image" />
      {/if}

      <div class="modal-content">
        <span class="event-tag">{tag.toUpperCase()}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        
        <!-- Link to the specific news card -->
        <a href={`/newsroom#${cardId}`} class="read-more-link" onclick={dismiss}>
          View in Newsroom &rarr;
        </a>
      </div>
      
    </div>
    
  </div>
{/if}

<style>
  /* --- Global Overlay & Container --- */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(15, 15, 20, 0.75); 
    backdrop-filter: blur(12px); 
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999; 
    padding: 1.5rem; 
    box-sizing: border-box;
  }

  .modal-box {
    background-color: #1a1b26; 
    border: 1px solid #bb9af7;
    border-radius: 16px;
    padding: 1.5rem 2rem 2.5rem 2rem;
    max-width: 600px; 
    width: 100%;
    max-height: 90vh; 
    overflow-y: auto; 
    box-shadow: 0 10px 40px rgba(187, 154, 247, 0.25);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: 'JetBrains Mono', monospace;
  }

  .modal-action-bar {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: -0.5rem; 
  }

  .close-btn {
    background: none;
    border: none;
    color: #565f89;
    font-size: 3rem; 
    cursor: pointer;
    line-height: 0.8;
    transition: color 0.2s ease;
    padding: 0;
  }

  .close-btn:hover {
    color: #bb9af7;
  }

  .modal-image {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid rgba(187, 154, 247, 0.2);
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal-content h2 {
    margin: 0;
    color: #c0caf5;
    font-size: 2.5rem; 
    line-height: 1.2;
  }

  .modal-content p {
    margin: 0;
    color: #a9b1d6;
    font-size: 1.25rem; 
    line-height: 1.6;
  }

  .event-tag {
    display: inline-block;
    padding: 0.35rem 0.85rem; 
    border-radius: 4px;
    font-size: 0.9rem; 
    font-weight: 700;
    letter-spacing: 0.05em;
    background-color: rgba(122, 162, 247, 0.15);
    color: #7aa2f7;
    width: fit-content;
  }

  /* --- Read More Link Styling --- */
  .read-more-link {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: rgba(187, 154, 247, 0.1);
    color: #bb9af7;
    border: 1px solid #bb9af7;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    width: fit-content;
    transition: all 0.3s ease;
  }

  .read-more-link:hover {
    background-color: #bb9af7;
    color: #1a1b26;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }

  @media (max-width: 768px) {
    .modal-box {
      padding: 1.5rem;
      gap: 1.25rem;
    }
    
    .modal-content h2 {
      font-size: 1.8rem; 
    }

    .modal-content p {
      font-size: 1.1rem; 
    }
    
    .close-btn {
      font-size: 2.5rem;
    }

    .read-more-link {
      font-size: 1rem;
    }
  }
</style>