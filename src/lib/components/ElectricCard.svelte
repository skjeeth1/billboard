<script>
  let { children, active = true } = $props();
</script>

{#if active}
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
          numOctaves="2"
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
          numOctaves="2"
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
          numOctaves="2"
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
          numOctaves="2"
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
{/if}

<div class="card-container">
  <div class="inner-container">
    <div class="border-outer">
      <div class="main-card" class:electric-active={active}></div>
    </div>
    <div class="glow-layer-1"></div>
    <div class="glow-layer-2"></div>
  </div>

  <div class="overlay-1"></div>
  <div class="overlay-2"></div>
  <div class="background-glow"></div>

  <div class="content-container">
    {@render children?.()}
  </div>
</div>

<style>
  .svg-container {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
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

  .content-container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    z-index: 10;
  }

  @media (min-width: 768px) {
    /* The electricity filter is only applied on mobile devices AND if the dynamic class is present */
    .main-card.electric-active {
      filter: url(#turbulent-displace);
    }
  }
</style>
