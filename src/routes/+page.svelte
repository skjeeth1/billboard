<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  import { reveal } from '$lib/utils/animations.js';
  import ElectricCard from '$lib/components/ElectricCard.svelte';
  import Section from '$lib/components/Section.svelte';

  import alumniData from '$lib/data/alumni.json';
  import eventData from '$lib/data/events.json';
  import epochData from '$lib/data/epoch.json';

  let animate = $state(false);

  // Toggle this variable to true/false in code to control the effect
  let enElectricEffect = false;

  // Triggers the {#if} block to mount elements after the page loads
  onMount(() => {
    animate = true;
  });
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
  <section class="hero-section">
    {#if animate}
      <ElectricCard active={enElectricEffect}>
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
          <!-- <div in:fly={{ y: 20, duration: 1000, delay: 800 }}>
              <a href="/epoch" class="cta-button">Explore Epoch</a>
            </div> -->
        </div>
      </ElectricCard>
    {/if}
  </section>

  <Section
    id="about"
    title="ABOUT"
    description="The Department of Electronics and Communication Engineering, established at CET Campus, Sreekariyam in 1964–65, is one of the institution’s oldest and most distinguished departments. Starting with a B.Tech. programme in Electronics and Communication Engineering and an initial intake of 33 students, the department has grown into a centre for quality education and research."
  >
    <p class="dummy-text">
      The department currently offers two B.Tech. programmes, five M.Tech. programmes, and doctoral
      programmes in various specialized areas. All programmes are approved by AICTE, and the
      department is recognized as an approved QIP Centre, contributing significantly to academic
      excellence, research, and technological innovation.
    </p>
  </Section>

  <Section
    id="epoch"
    title="EPOCH"
    description="The ultimate technical symposium hosted by the finest minds in engineering."
  >
    <p class="dummy-text">
      Epoch is our flagship annual technical festival, bringing together hundreds of students,
      innovators, and industry leaders across the country. Through high-stakes hackathons,
      thought-provoking exhibitions, and hands-on workshops, Epoch provides an unparalleled platform
      for students to demonstrate their skills, explore emerging technologies, and collaborate on
      real-world problems.
    </p>

    <div class="image-grid">
      {#each epochData.slice(0, 3) as item (item.title)}
        <div class="image-card" use:reveal>
          <div class="card-badge" class:latest={item.tag === 'latest'}>
            {item.tag === 'latest' ? 'LATEST' : 'PREVIOUS'}
          </div>
          <img src={item.image} alt={item.alt} />
          <div class="card-content">
            <h4>{item.title}</h4>
            <p>{item.speaker}, <strong>{item.company}</strong></p>
          </div>
        </div>
      {/each}
    </div>

    <div class="explore-container" use:reveal>
      <a href="/epoch" class="cta-button">Explore all events &rarr;</a>
    </div>
  </Section>

  <Section
    id="events"
    title="EVENTS"
    description="Upcoming departmental activities, seminars, and workshops."
  >
    <div class="events-list">
      {#each eventData as event (event.title)}
        <div class="event-row" use:reveal>
          <div class="event-date">
            <span class="day">{event.day}</span>
            <span class="month">{event.month}</span>
          </div>
          <div class="event-details">
            <h4>{event.title}</h4>
            <p>{event.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </Section>

  <Section
    id="alumni"
    title="ALUMNI CONNECT"
    description="Bridging the gap between our distinguished alumni and current students."
  >
    <div class="alumni-grid">
      {#each alumniData as person (person.name)}
        <div class="alumni-card" use:reveal>
          <div class="avatar"><img src={person.avatar} alt={person.alt} /></div>
          <h4>{person.name}</h4>
          <p class="role">{person.role}</p>
          <p class="company">{person.company}</p>
        </div>
      {/each}
    </div>
  </Section>

  <!-- <Section 
    id="contact" 
    title="CONTACT" 
    description="Get in touch with the Department of ECE."
  >
    <div class="contact-container">
      <div class="contact-info">
        <div class="info-block">
          <h4>Address</h4>
          <p>Department of ECE<br/>College of Engineering, Trivandrum<br/>Kerala, India - 695016</p>
        </div>
        <div class="info-block">
          <h4>Email</h4>
          <p>ece@cet.ac.in</p>
        </div>
        <div class="info-block">
          <h4>Phone</h4>
          <p>+91 471 2515502</p>
        </div>
      </div>
      
      <form class="contact-form" onsubmit={(e) => e.preventDefault()}>
        <div class="input-group">
          <input type="text" placeholder="Your Name" required />
        </div>
        <div class="input-group">
          <input type="email" placeholder="Your Email" required />
        </div>
        <div class="input-group">
          <textarea rows="4" placeholder="Your Message" required></textarea>
        </div>
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
    </div>
  </Section> -->
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
    margin: 0 0 2rem 0;
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
    transition: all 0.3s ease;
  }

  .cta-button:hover {
    background-color: #bb9af7;
    color: #1a1b26;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }

  .explore-container {
    margin-top: 3rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .dummy-text {
    font-size: 1.25rem;
    line-height: 1.7;
    color: #565f89;
    margin-bottom: 3rem;
  }

  /* --- Image Grid Cards --- */
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    width: 100%;
    margin-top: 1rem;
  }

  .image-card {
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 16px;
    overflow: hidden;
    transition:
      transform 0.3s ease,
      border-color 0.3s ease;
    position: relative;
  }

  .image-card:hover {
    transform: translateY(-5px);
    border-color: rgba(187, 154, 247, 0.6);
  }

  .card-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background-color: rgba(26, 27, 38, 0.8);
    color: #a9b1d6;
    border: 1px solid #565f89;
    z-index: 2;
  }

  .card-badge.latest {
    background-color: rgba(187, 154, 247, 0.2);
    color: #bb9af7;
    border-color: #bb9af7;
  }

  .image-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-content h4 {
    margin: 0 0 0.5rem 0;
    color: #c0caf5;
    font-size: 1.2rem;
  }

  .card-content p {
    margin: 0;
    color: #7aa2f7;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  /* --- Events List --- */
  .events-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .event-row {
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: rgba(26, 27, 38, 0.4);
    padding: 1.5rem;
    border-radius: 12px;
    border-left: 4px solid #bb9af7;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease;
  }

  .event-row:hover {
    transform: translateX(5px);
    background-color: rgba(26, 27, 38, 0.8);
  }

  .event-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 70px;
    color: #bb9af7;
  }

  .event-date .day {
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1;
  }

  .event-date .month {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    opacity: 0.8;
  }

  .event-details h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.3rem;
    color: #c0caf5;
  }

  .event-details p {
    margin: 0;
    color: #7aa2f7;
    line-height: 1.5;
    font-size: 1rem;
  }

  /* --- Alumni Grid --- */
  .alumni-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    width: 100%;
  }

  .alumni-card {
    background-color: rgba(26, 27, 38, 0.4);
    border: 1px solid rgba(187, 154, 247, 0.15);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    transition:
      border-color 0.3s ease,
      background-color 0.3s ease;
  }

  .alumni-card:hover {
    border-color: rgba(187, 154, 247, 0.5);
    background-color: rgba(26, 27, 38, 0.7);
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 0 auto 1.5rem auto;
    border: 3px solid #bb9af7;
    overflow: hidden;
    padding: 3px;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .alumni-card h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: #c0caf5;
  }

  .alumni-card .role {
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
    color: #a9b1d6;
  }

  .alumni-card .company {
    margin: 0;
    font-size: 0.85rem;
    color: #7aa2f7;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* --- Contact Section --- */
  /* .contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    width: 100%;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .info-block h4 {
    margin: 0 0 0.5rem 0;
    color: #bb9af7;
    font-size: 1.1rem;
  }

  .info-block p {
    margin: 0;
    color: #a9b1d6;
    line-height: 1.6;
    font-size: 1rem;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .input-group input,
  .input-group textarea {
    width: 100%;
    background-color: rgba(12, 12, 16, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.3);
    color: #c0caf5;
    padding: 1rem;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
    resize: vertical;
  }

  .input-group input:focus,
  .input-group textarea:focus {
    outline: none;
    border-color: #bb9af7;
    background-color: rgba(26, 27, 38, 0.8);
  }

  .submit-btn {
    background-color: #bb9af7;
    color: #1a1b26;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-btn:hover {
    background-color: #c0caf5;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.4);
  } */

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

    /* Responsive grids and lists */
    /* .contact-container {
      grid-template-columns: 1fr;
      gap: 3rem;
    } */

    .event-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      border-left: none;
      border-top: 4px solid #bb9af7;
    }

    .event-date {
      flex-direction: row;
      gap: 0.5rem;
      align-items: baseline;
    }
  }
</style>
