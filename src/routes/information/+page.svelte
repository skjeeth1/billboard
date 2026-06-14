<script>
  import { Section, AchievementCard } from '$lib';
  import informationData from '$lib/data/information.json';
</script>

<svelte:head>
  <title>Department Data | Department of ECE</title>
  <meta name="description" content="Information regarding faculty, students, and lab facilities of the ECE Department." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="information-page">
  <section class="info-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>DEPARTMENT DATA</h1>
      <p>Consult our archives of faculty, students, and facilities.</p>
    </div>
  </section>

  <Section
    title="FACULTY LIST"
    description="Meet our esteemed faculty members who are driving innovation and education in the field."
  >
    <div class="faculty-grid">
      {#each informationData.faculties as faculty}
        <div class="faculty-card">
          <img src={faculty.photo} alt={faculty.name} />
          <h4>{faculty.name}</h4>
          <p class="designation">{faculty.designation}</p>
          <p class="speciality">{faculty.speciality}</p>
        </div>
      {/each}
    </div>
    <div class="link-container">
      <a href={informationData.links.faculty} target="_blank" rel="noopener noreferrer" class="text-link">More faculty data &rarr;</a>
    </div>
  </Section>

  <Section
    title="LAB FACILITIES"
    description="Explore our cutting-edge laboratories that are equipped for advanced research, development, and learning."
  >
    <div class="labs-grid">
      {#each informationData.labs as lab, i (lab.name)}
        <AchievementCard achievement={lab} delay={i * 50} />
      {/each}
    </div>
    <div class="link-container">
      <a href={informationData.links.labs} target="_blank" rel="noopener noreferrer" class="text-link">Complete lab facilities available &rarr;</a>
    </div>
  </Section>

  <Section
    title="STUDENT LIST"
    description="Access the comprehensive directory of our current students and department alumni."
  >
    <div class="link-container">
      <a href={informationData.links.students} target="_blank" rel="noopener noreferrer" class="text-link">Complete student list &rarr;</a>
    </div>
  </Section>

</div>

<style>
  .information-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }
  .info-hero { position: relative; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; color: white; }
  .hero-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center; filter: brightness(0.3) saturate(1.2); z-index: 1; }
  .hero-content { position: relative; z-index: 2; padding: 0 1rem; }
  .hero-content h1 { font-size: 4rem; font-weight: 700; letter-spacing: 0.1em; margin: 0; color: #bb9af7; text-shadow: 0 0 15px rgba(187, 154, 247, 0.5); overflow-wrap: break-word; }
  .hero-content p { font-size: 1.5rem; color: #a9b1d6; margin-top: 1rem; }

  .faculty-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; width: 100%; margin-bottom: 2rem; }
  .faculty-card { background-color: rgba(26, 27, 38, 0.5); border: 1px solid rgba(187, 154, 247, 0.2); border-radius: 16px; padding: 2rem 1.5rem; text-align: center; transition: transform 0.3s ease, border-color 0.3s ease; }
  .faculty-card:hover { transform: translateY(-5px); border-color: rgba(187, 154, 247, 0.6); }
  .faculty-card img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1.25rem; border: 2px solid rgba(187, 154, 247, 0.5); }
  .faculty-card h4 { margin: 0 0 0.5rem 0; font-size: 1.25rem; color: #c0caf5; }
  .faculty-card p.designation { margin: 0; font-size: 0.95rem; color: #7aa2f7; font-weight: 600; }
  .faculty-card p.speciality { margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #a9b1d6; }

  .labs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; width: 100%; margin-bottom: 2rem; }
  
  .link-container { margin-top: 1rem; width: 100%; display: flex; justify-content: flex-start; }
  .text-link {
    display: inline-block;
    color: #bb9af7;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    padding-bottom: 0.2rem;
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s ease, color 0.3s ease;
  }
  .text-link:hover {
    color: #c0caf5;
    border-color: #c0caf5;
  }

  @media (max-width: 768px) {
    .hero-content h1 { font-size: 2.5rem; }
    .hero-content p { font-size: 1.1rem; }
    .faculty-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
    .labs-grid { grid-template-columns: 1fr; }
  }
</style>