<script>
  import { Section, getImageUrl } from '$lib';
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
    <div
      class="hero-background"
      style="background-image: url('{getImageUrl('spectrapromo.webp')}');"
    ></div>
    <div class="hero-content">
      <h1>SPECTRA'26</h1>
      <p>Innovate. Compete. Conquer.</p>
    </div>
  </section>

  <Section
    id="about"
    title="ABOUT SPECTRA"
    description="SPECTRA is the flagship event of the ECE Association, College of Engineering Trivandrum, bringing together technology, creativity, innovation, and entertainment on a single platform.

The event goes beyond the classroom, creating an environment where students can explore new ideas, showcase their skills, take on challenges, and connect with others. With a mix of technical and non-technical experiences, SPECTRA encourages participation, collaboration, and creative thinking.

More than just an event, SPECTRA is a celebration of the spirit, talent, and enthusiasm of the ECE community."
  ></Section>

  <Section
    id="expo-registration"
    title="PROJECT EXPO'26"
    description="Innovation deserves a stage. Present your project at SPECTRA: Project Expo '26 and showcase your ideas to a wider audience."
  >
    <div class="registration-content">
      <div class="expo-image-wrapper">
        <img src={getImageUrl('spectra.webp')} alt="Spectra Project Expo" class="expo-image" />
      </div>

      <div class="expo-text-wrapper">
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
          <a
            href="https://forms.gle/YiuPjD6iTyH5E9vK9"
            class="cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register Now &rarr;
          </a>
        </div>
      </div>
    </div>
  </Section>

  <Section
    id="line-follower-registration"
    title="LINE FOLLOWER CHALLENGE"
    description="Put your robot to the test! Compete in the Line Follower Robot Competition by SPECTRA ’26 × Build Club CET."
  >
    <div class="registration-content">
      <div class="expo-image-wrapper">
        <img
          src={getImageUrl('line_follower.webp')}
          alt="Line Follower Challenge"
          class="expo-image"
        />
      </div>

      <div class="expo-text-wrapper">
        <ul class="guidelines-list">
          <li>Prize Pool: ₹8,000</li>
          <li>Registration: ₹399/team</li>
          <li>Team Size: Max. 4 members</li>
          <li>September 8, 2026</li>
        </ul>

        <div class="additional-info">
          <p>
            Detailed rules & guidelines are available in the
            <a
              href="https://drive.google.com/drive/folders/1pk1p0rORKFq2TgzmVtvX94STBVfdQ-a8?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              class="text-link">attached link</a
            >.
          </p>
          <p class="tagline">Build. Follow. Conquer. 🚀</p>
        </div>

        <div class="action-container">
          <a
            href="https://forms.gle/ERemG5n2P4Gt4HUe9"
            class="cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register Now &rarr;
          </a>
        </div>
      </div>
    </div>
  </Section>

  <Section
    id="voice-controlled-bot-workshop"
    title="VOICE CONTROLLED BOT WORKSHOP"
    description="SPECTRA ’26 in collaboration with RoboCET brings you... What if your voice could bring a robot to life? Step into the world of robotics and learn to build, command, & control your very own bot!"
  >
    <div class="registration-content">
      <div class="expo-image-wrapper">
        <img
          src={getImageUrl('voice_controlled_bot_workshop.webp')}
          alt="Voice Controlled Bot Workshop"
          class="expo-image"
        />
      </div>

      <div class="expo-text-wrapper">
        <ul class="guidelines-list">
          <li>Date: September 8, 2026</li>
          <li>Registration Fee: ₹129/-</li>
        </ul>

        <div class="additional-info">
          <p style="margin-bottom: 0.5rem; color: #c0caf5; font-weight: 600;">
            TAKEAWAY KIT OPTIONS:
          </p>
          <ul class="guidelines-list" style="margin-bottom: 1.5rem;">
            <li>Arduino Only – ₹300</li>
            <li>Full Kit – ₹1,000</li>
            <li>Full Kit without Arduino – ₹700</li>
          </ul>

          <p class="tagline">Speak. Command. Control. 🚀</p>
          <p style="font-size: 0.95rem; margin-top: 1rem; color: #7aa2f7;">
            <strong>For Queries Contact:</strong><br />
            Sisira: +91 95447 58104<br />
            Joe: +91 97460 78926
          </p>
        </div>

        <div class="action-container">
          <a
            href="https://forms.gle/89upHKsMSzzgSzDA6"
            class="cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register Now &rarr;
          </a>
          <p style="margin-top: 0.75rem; font-size: 0.85rem; color: #565f89; font-style: italic;">
            Limited slots. Let your voice take control!
          </p>
        </div>
      </div>
    </div>
  </Section>

  <Section
    id="tee-drop"
    title="THE OFFICIAL TEE DROP"
    description="Wear the legacy. Own the signal. 📺 Designed for the ones who live beyond the frequency."
  >
    <div class="registration-content">
      <div class="expo-image-wrapper">
        <img src={getImageUrl('tee_drop.webp')} alt="Spectra Official Tee" class="expo-image" />
      </div>

      <div class="expo-text-wrapper">
        <ul class="guidelines-list">
          <li>Normal Fit — ₹319/-</li>
          <li>Oversized Fit — ₹349/-</li>
        </ul>

        <div class="additional-info">
          <p class="tagline" style="margin-bottom: 0.25rem;">SPECTRA ’26 × ZEVRA</p>
          <p style="font-size: 1.05rem; color: #a9b1d6; font-style: italic;">Woven with Legacy.</p>
        </div>

        <div class="action-container">
          <a
            href="https://forms.gle/13QEqV6EdawCAbVJA"
            class="cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Grab Yours Now &rarr;
          </a>
        </div>
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

  /* --- Registration Layout --- */
  .registration-content {
    display: flex;
    flex-direction: column; /* Mobile: Stacks vertically */
    gap: 2rem;
    width: 100%;
  }

  .expo-image-wrapper {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(187, 154, 247, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .expo-image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  .expo-text-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    margin-top: 1.5rem;
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

  /* --- Additional Text Styles --- */
  .additional-info {
    margin-top: 1.5rem;
    color: #a9b1d6;
    font-size: 1.05rem;
  }

  .text-link {
    color: #bb9af7;
    text-decoration: underline;
    text-underline-offset: 4px;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  .text-link:hover {
    color: #c0caf5;
  }

  .tagline {
    font-weight: 700;
    color: #c0caf5;
    margin-top: 1rem;
    font-size: 1.15rem;
  }

  /* --- Responsive Breakpoints --- */
  @media (min-width: 768px) {
    .registration-content {
      flex-direction: row-reverse; /* Desktop: Places image on the right, text on the left */
      align-items: center;
      gap: 3.5rem;
    }

    .expo-image-wrapper {
      flex: 1; /* Takes up 50% of the space */
    }

    .expo-text-wrapper {
      flex: 1.2; /* Gives slightly more room to the text */
    }
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
