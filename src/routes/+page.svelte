<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  let animate = $state(false);

  // Triggers the {#if} block to mount elements after the page loads
  onMount(() => {
    animate = true;
  });

  function reveal(node, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(24px)';

    node.offsetHeight;

    node.style.transition = `
      opacity 0.6s ease ${delay}ms,
      transform 0.6s ease ${delay}ms
    `;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
        observer.disconnect();
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="page-wrapper">
  <svg class="svg-container">
    <defs>
      <filter
        id="turbulent-displace"
        colorInterpolationFilters="sRGB"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
      >
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="10"
          result="noise1"
          seed="1"
        />
        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
          <animate
            attributeName="dy"
            values="700; 0"
            dur="6s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </feOffset>

        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="10"
          result="noise2"
          seed="1"
        />
        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
          <animate
            attributeName="dy"
            values="0; -700"
            dur="6s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </feOffset>

        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="10"
          result="noise1"
          seed="2"
        />
        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
          <animate
            attributeName="dx"
            values="490; 0"
            dur="6s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </feOffset>

        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="10"
          result="noise2"
          seed="2"
        />
        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
          <animate
            attributeName="dx"
            values="0; -490"
            dur="6s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </feOffset>

        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
        <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
        <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

        <feDisplacementMap
          in="SourceGraphic"
          in2="combinedNoise"
          scale="30"
          xChannelSelector="R"
          yChannelSelector="B"
        />
      </filter>
    </defs>
  </svg>

  <section class="hero-section">
    {#if animate}
      <div class="card-container">
        <div class="inner-container">
          <div class="border-outer">
            <div class="main-card"></div>
          </div>
          <div class="glow-layer-1"></div>
          <div class="glow-layer-2"></div>
        </div>

        <div class="overlay-1"></div>
        <div class="overlay-2"></div>
        <div class="background-glow"></div>

        <div class="content-container">
          <div class="content-top">
            <h1 class="main-title" in:fly={{ y: 40, duration: 1000, delay: 200 }}>
              ELECTRONICS AND COMMUNICATION ENGINEERING
            </h1>
          </div>

          <hr class="divider" />

          <div class="content-bottom">
            <h2 class="subtitle" in:fly={{ y: 20, duration: 1000, delay: 600 }}>
              College of Engineering, Trivandrum
            </h2>
          </div>
        </div>
      </div>
    {/if}
  </section>

  <section class="about-section" use:reveal>
    <h3 class="section-title">ABOUT</h3>

    <p class="description">
      Driven by a mission of academic excellence, research innovation, and strong industry-alumni
      networking.
    </p>

    <p class="dummy-text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin elementum tincidunt massa, vel
      facilisis ex eleifend vitae. Sed non lectus id libero dapibus scelerisque. Nulla facilisi.
      Cras congue, sapien eu eleifend sollicitudin, felis quam cursus mauris, id semper arcu nunc
      eget est. Phasellus id venenatis ex.
    </p>
  </section>
</div>

<style>
  .page-wrapper {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  .svg-container {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .hero-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    box-sizing: border-box;
  }

  /* --- Electric Card Styles Adapted for Tokyonight --- */
  .card-container {
    --electric-border-color: #bb9af7;
    --electric-light-color: #9d7cd8;
    --gradient-color: rgba(187, 154, 247, 0.2);
    --color-neutral-900: #1a1b26;

    padding: 2px;
    border-radius: 24px;
    position: relative;
    max-width: 100%;
    height: 70vh;
    margin: 0 auto;

    background:
      linear-gradient(-30deg, var(--gradient-color), transparent, var(--gradient-color)),
      linear-gradient(to bottom, var(--color-neutral-900), var(--color-neutral-900));
  }

  .inner-container,
  .overlay-1,
  .overlay-2,
  .background-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 24px;
    pointer-events: none;
  }

  .border-outer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(187, 154, 247, 0.4);
    border-radius: 24px;
    padding-right: 4px;
    padding-bottom: 4px;
  }

  .main-card {
    position: absolute;
    top: -2px;
    left: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border-radius: 24px;
    border: 2px solid var(--electric-border-color);
    filter: url(#turbulent-displace);
  }

  .glow-layer-1 {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(187, 154, 247, 0.6);
    border-radius: 24px;
    filter: blur(1px);
  }

  .glow-layer-2 {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid var(--electric-light-color);
    border-radius: 24px;
    filter: blur(4px);
  }

  .overlay-1 {
    opacity: 1;
    mix-blend-mode: overlay;
    transform: scale(1.05);
    filter: blur(16px);
    background: linear-gradient(-30deg, white, transparent 30%, transparent 70%, white);
  }

  .overlay-2 {
    opacity: 0.5;
    mix-blend-mode: overlay;
    transform: scale(1.05);
    filter: blur(16px);
    background: linear-gradient(-30deg, white, transparent 30%, transparent 70%, white);
  }

  .background-glow {
    filter: blur(32px);
    transform: scale(1.05);
    opacity: 0.3;
    z-index: -1;
    background: linear-gradient(
      -30deg,
      var(--electric-light-color),
      transparent,
      var(--electric-border-color)
    );
  }

  /* --- Content Container (Dictates Card Size) --- */
  .content-container {
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 10;
  }

  .content-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 64px 32px 64px;
  }

  .content-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 64px 64px 64px;
  }

  .divider {
    border: none;
    height: 1px;
    background-color: var(--electric-border-color);
    opacity: 0.3;
    mask-image: linear-gradient(to right, transparent, black, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black, transparent);
    margin: 0;
  }

  /* --- Typography --- */
  .main-title {
    /* font-family: 'Lato', sans-serif; */
    font-size: 4rem;
    font-weight: 700;
    line-height: 1.2;
    color: #c0caf5;
    margin: 0;
  }

  .subtitle {
    /* font-family: 'Atkinson Hyperlegible', sans-serif; */
    font-size: 1.2rem;
    font-weight: 700;
    color: #c0caf5;
    margin: 0;
  }

  /* --- About Section --- */
  .about-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 6rem 2rem;
    box-sizing: border-box;
    max-width: 800px;
    margin: 0 auto;
  }
  .section-title {
    /* font-family: 'Atkinson Hyperlegible', sans-serif; */
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #bb9af7;
    margin-bottom: 2rem;
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #a9b1d6;
    margin-bottom: 2.5rem;
  }

  .dummy-text {
    font-size: 0.95rem;
    line-height: 1.7;
    color: #565f89;
    max-width: 600px;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .content-top {
      padding: 80px 32px 24px 32px;
    }
    .content-bottom {
      padding: 24px 32px 80px 32px;
    }
    .main-title {
      font-size: 2.5rem;
    }
    .subtitle {
      font-size: 1rem;
    }
    .about-section {
      padding: 4rem 3rem;
    }
  }
</style>
