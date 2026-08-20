<script>
  import { Section } from '$lib';
</script>

<svelte:head>
  <title>SPECTRA'26 | Department of ECE</title>
  <meta
    name="description"
    content="Turn your innovative ideas into reality and compete for exciting prizes at SPECTRA'26."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="spectra-page">
  <section class="spectra-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>SPECTRA'26</h1>
      <p>Innovate. Compete. Conquer.</p>
    </div>
  </section>

  <!-- About Section -->
  <Section
    id="about"
    title="ABOUT SPECTRA"
    description="SPECTRA is the flagship event of the ECE Association, College of Engineering Trivandrum, bringing together technology, creativity, innovation, and entertainment on a single platform.

The event goes beyond the classroom, creating an environment where students can explore new ideas, showcase their skills, take on challenges, and connect with others. With a mix of technical and non-technical experiences, SPECTRA encourages participation, collaboration, and creative thinking.

More than just an event, SPECTRA is a celebration of the spirit, talent, and enthusiasm of the ECE community."
  ></Section>

  <!-- Registration Section -->
  <Section
    id="registration"
    title="PROJECT EXPO'26"
    description="Innovation deserves a stage. Present your project at SPECTRA: Project Expo '26 and showcase your ideas to a wider audience."
  >
    <div class="registration-content">
      <ul class="guidelines-list">
        <li>Open to projects from all domains</li>
        <li>Maximum 4 members per team</li>
        <li>Free registration – no participation fee</li>
        <li>
          Only one team member needs to fill out the Google Form provided. Once registered, bring
          your project on the day of SPECTRA and showcase your innovation.
        </li>
      </ul>
      <div class="action-container">
        <!-- Replace # with your actual Google Form or registration link -->
        <a
          href="https://www.google.com"
          class="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Register Now &rarr;
        </a>
      </div>
    </div>
  </Section>
</div>

<style>
  .spectra-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  .spectra-hero {
    position: relative;
    width: 100%;
    height: 100vh;
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
    /* You can replace this Unsplash URL with a local image like getImageUrl('spectra.webp') */
    background-image: url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.3) saturate(1.2);
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    padding: 0 1rem;
  }

  .hero-content h1 {
    font-size: 5rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    margin: 0;
    color: #bb9af7;
    text-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }

  .hero-content p {
    font-size: 1.5rem;
    color: #a9b1d6;
    margin-top: 1rem;
  }

  .about-details {
    font-size: 1.25rem;
    color: #a9b1d6;
    margin-top: 1rem;
  }

  .registration-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .guidelines-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    color: #a9b1d6;
    font-size: 1.15rem;
  }

  .guidelines-list li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .guidelines-list li::before {
    content: '>';
    position: absolute;
    left: 0;
    color: #bb9af7;
    font-weight: bold;
  }

  .action-container {
    margin-top: 1rem;
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
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }

  .cta-button:hover {
    background-color: #bb9af7;
    color: #1a1b26;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }

  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 3rem;
      letter-spacing: 0.1em;
    }

    .hero-content p {
      font-size: 1.2rem;
    }
  }
</style>
