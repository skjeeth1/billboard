<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  import {
    // components
    // ElectricCard,
    PcbBoard,
    Section,
    GalleryCarousel,
    AchievementCard,
    NotificationToast,

    // data
    achievementsData,
    newsData,
    epochData,
    galleryData,

    // utils
    reveal,
    getImageUrl
  } from '$lib';

  let animate = $state(false);

  // Flatten all images from gallery data to pass into a single carousel
  // and attach an href so each image links to its specific subsection.
  const allGalleryImages = galleryData.flatMap((section) =>
    section.images.map((image) => ({
      ...(typeof image === 'string' ? { src: image } : image),
      href: `/gallery#${section.id}`
    }))
  );

  const popupItem = newsData.find((item) => item.showAsPopup);

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
</svelte:head>

<div class="page-wrapper">

  <PcbBoard tracesX={10} tracesY={10} />

  <!-- Main About section -->
  <Section
    id="about"
    title="ABOUT"
    description="The Department of Electronics and Communication Engineering, established at CET Campus, Sreekariyam in 1964–65, is one of the institution’s oldest and most distinguished departments. Starting with a B.Tech. programme in Electronics and Communication Engineering and an initial intake of 33 students, the department has grown into a centre for quality education and research."
  >
    <div class="department-photo-container" use:reveal>
      <img
        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
        alt="ECE Department"
        class="department-photo"
      />
      <p class="photo-subtext">Our humble department</p>
    </div>
  </Section>

  <!-- Epoch section -->
  <Section
    id="epoch"
    title="EPOCH"
    description="The ultimate technical symposium hosted by the finest minds in engineering."
  >
    <div class="image-grid">
      {#each epochData.slice(0, 1) as item (item.alt)}
        <a
          href="/epoch#{item.tag === 'latest'
            ? 'upcoming'
            : item.alt.replace(/\s+/g, '-').toLowerCase()}"
          class="image-card"
          use:reveal
        >
          <div class="card-badge" class:latest={item.tag === 'latest'}>
            {item.tag === 'latest' ? 'LATEST' : 'PREVIOUS'}
          </div>
          <img src={getImageUrl(item.image)} alt={item.alt} />
          <div class="card-content">
            <h4>{item.title}</h4>
            <p>{item.speaker}, <strong>{item.company}</strong></p>
          </div>
        </a>
      {/each}
    </div>

    <div class="explore-container" use:reveal>
      <a href="/epoch" class="cta-button">Explore all events &rarr;</a>
    </div>
  </Section>

  <!-- Oppam section -->
  <Section
    id="oppam"
    title="OPPAM"
    description="Your ultimate repository for study materials. orem ipsum dolor sit amet, consectetur adipiscing elit. Fusce efficitur augue elit, ullamcorper imperdiet leo interdum id. Etiam et tincidunt elit. Quisque nisl mauris, dignissim at ligula non, pulvinar finibus nibh. Vestibulum convallis justo sem, eget rhoncus metus dapibus eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  >
    <div class="explore-container" use:reveal>
      <a href="/oppam" class="cta-button">Visit Oppam &rarr;</a>
    </div>
  </Section>

  <!-- Newsroom section -->
  <Section
    id="newsroom"
    title="NEWSROOM"
    description="Upcoming departmental activities, seminars, and notifications."
  >
    <div class="events-list">
      {#each newsData.slice(0, 2) as event (event.title)}
        <div class="event-row" use:reveal>
          <div class="event-date">
            <span class="day">{event.day}</span>
            <span class="month">{event.month}</span>
          </div>
          <div class="event-details">
            <span class="event-tag {event.tag}">
              {event.tag === 'notification' ? 'NOTIFICATION' : 'DEPARTMENT EVENT'}
            </span>
            <h4>{event.title}</h4>
            <p>{event.description}</p>
          </div>
        </div>
      {/each}
    </div>

    <div class="explore-container" use:reveal>
      <a href="/newsroom" class="cta-button">Explore all news &rarr;</a>
    </div>
  </Section>

  <!-- Achievements section -->
  <Section
    id="achievements"
    title="ACHIEVEMENTS"
    description="Celebrating the outstanding milestones and successes of our students and faculty."
  >
    <div class="achievements-grid">
      {#each achievementsData.slice(0, 1) as achievement, i (achievement.title)}
        <AchievementCard {achievement} delay={i * 50} />
      {/each}
    </div>

    <div class="explore-container" use:reveal>
      <a href="/achievements" class="cta-button">View all achievements &rarr;</a>
    </div>
  </Section>

  <!-- Gallery section -->
  <Section
    id="gallery"
    title="GALLERY"
    description="A visual journey through our department's events, workshops, and everyday life."
  >
    <div class="gallery-container" use:reveal>
      <GalleryCarousel images={allGalleryImages} />
    </div>

    <div class="explore-container" use:reveal>
      <a href="/gallery" class="cta-button">View Full Gallery &rarr;</a>
    </div>
  </Section>

  <!-- Association section -->
  <Section
    id="association"
    title="OUR TEAM"
    description="Meet the dedicated students who drive the EC Association forward. From office bearers and committee heads to team members, this section highlights the individuals who work together to organize initiatives, foster innovation, and strengthen our community. Their leadership, commitment, and collaborative spirit play a vital role in shaping the association's activities and impact. Through their efforts, the EC Association continues to create meaningful opportunities for learning, growth, and engagement."
  >
    <div class="explore-container" use:reveal>
      <a href="/association" class="cta-button">Meet the Members &rarr;</a>
    </div>
  </Section>

  <Section
    id="information"
    title="DEPARTMENT DATA"
    description="Access essential information and insights about the department. Explore key resources, records, and institutional data in one place."
  >
    <div class="explore-container" use:reveal>
      <a href="/information" class="cta-button">Consult the archives &rarr;</a>
    </div>
  </Section>
</div>

{#if popupItem}
  <NotificationToast 
    title={popupItem.title} 
    description={popupItem.description} 
    image={popupItem.image}
    tag={popupItem.tag} 
  />
{/if}

<style>
  .page-wrapper {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .hero-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 1rem;
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
    font-size: 4rem;
    font-weight: 700;
    line-height: 1.2;
    color: #c0caf5;
    margin: 0;
  }

  .subtitle {
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

  /* --- About Section Photo --- */
  .department-photo-container {
    margin-top: 2.5rem;
    text-align: center;
    width: 100%;
  }

  .department-photo {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: cover;
    border-radius: 16px;
    border: 1px solid rgba(187, 154, 247, 0.2);
  }

  .photo-subtext {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #7aa2f7;
  }

  /* --- Image Grid Cards --- */
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    width: 100%;
    margin-top: 1rem;
    justify-items: center;
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
    display: block;
    text-decoration: none;
    max-width: 28rem;
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
    height: auto;
    display: block;
  }

  .card-content {
    padding: 1.5rem;
    width: fit-content;
  }

  .card-content h4 {
    margin: 0 0 0.5rem 0;
    color: #c0caf5;
    font-size: 1.5rem;
    width: fit-content;
  }

  .card-content p {
    margin: 0;
    color: #7aa2f7;
    font-size: 1.15rem;
    line-height: 1.4;
    width: fit-content;
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
    position: relative;
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

  .event-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
  }

  .event-tag.event {
    background-color: rgba(187, 154, 247, 0.15);
    color: #bb9af7;
  }

  .event-tag.notification {
    background-color: rgba(122, 162, 247, 0.15);
    color: #7aa2f7;
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

  /* --- Achievements Grid --- */
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
  }

  .gallery-container {
    width: 100%;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .content-top {
      padding: 80px 1rem 24px 1rem;
    }
    .content-bottom {
      padding: 24px 1rem 80px 1rem;
    }
    .main-title {
      font-size: 2.5rem;
    }
    .subtitle {
      font-size: 1rem;
    }

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

    .event-tag {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      margin-bottom: 0;
    }

    .card-content h4 {
      margin: 0 0 0.5rem 0;
      color: #c0caf5;
      font-size: 1.1rem;
      width: fit-content;
    }

    .card-content p {
      margin: 0;
      color: #7aa2f7;
      font-size: 0.95rem;
      line-height: 1.4;
      width: fit-content;
    }
  }

  @media (min-width: 768px) {
    .hero-section {
      padding: 2rem;
    }
  }
</style>
