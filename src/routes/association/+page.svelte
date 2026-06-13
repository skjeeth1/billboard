<script>
  import { fly } from 'svelte/transition';
  import associationData from '$lib/data/association.json';
  import Section from '$lib/components/Section.svelte';

  // Keep track of which teams are expanded
  let expandedTeams = $state({});

  function toggleTeam(teamName) {
    expandedTeams[teamName] = !expandedTeams[teamName];
  }
</script>

<svelte:head>
  <title>Our Association | Department of ECE</title>
  <meta name="description" content="Meet the members of the ECE Web Association." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="association-page">
  <section class="association-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>ECE ASSOCIATION</h1>
      <p>Building the backbone of our department.</p>
    </div>
  </section>

  <Section 
    title="OUR MISSION"
    description="The ECE Association is the official student body responsible for designing, developing, and maintaining the infrastructure of the Department of Electronics and Communication Engineering. We foster a community of tech enthusiasts, providing them with opportunities to work on real-world projects, hone their skills, and bridge the gap between academic learning and industry standards."
  />

  <Section title="MEET THE TEAM">
    <div class="teams-container">
      {#each associationData as team (team.team)}
        <div class="team-block">
          <div class="team-header">
            <div class="team-info">
              <h3>{team.team}</h3>
              <p>{team.description}</p>
            </div>
          </div>

          <div class="members-grid">
            {#each team.members as member, i (member.name)}
              <!-- Show only the lead (index 0) if collapsed, show all if expanded -->
              {#if expandedTeams[team.team] || i === 0}
                <div 
                  class="member-card" 
                  class:lead-member={i === 0}
                  in:fly={{ y: 20, duration: 400, delay: i * 50 }}
                >
                  <div class="avatar"><img src={member.image} alt={member.name} /></div>
                  <div class="member-details">
                    <h4>{member.name}</h4>
                    <p class="role">{member.role}</p>
                    <p class="year">{member.year}</p>
                  </div>
                </div>
              {/if}
            {/each}
          </div>

          <div class="team-footer">
            <button class="toggle-btn" aria-label="Toggle team members" onclick={() => toggleTeam(team.team)}>
              {expandedTeams[team.team] ? 'Hide Team −' : 'View All +'}
            </button>
          </div>

          {#if expandedTeams[team.team] && team.memeImage}
            <div class="easter-egg" in:fly={{ y: 20, duration: 400 }}>
              <img src={team.memeImage} alt="Team Meme" class="secret-image" />
              <p class="secret-line">{team.memeLine}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </Section>
</div>

<style>
  .association-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  .association-hero {
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
    /* A thematic background image for association/team */
    background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.3) saturate(1.2);
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    padding: 0 1.5rem;
  }

  .hero-content h1 {
    font-size: 4rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    margin: 0;
    color: #bb9af7;
    text-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }

  .hero-content p {
    font-size: 1.5rem;
    color: #a9b1d6;
  }

  /* --- Teams Section --- */
  .teams-container {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    width: 100%;
  }

  .team-block {
    background-color: rgba(26, 27, 38, 0.4);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 16px;
    padding: 2rem;
  }

  .team-header {
    display: flex;
    align-items: flex-start;
    border-bottom: 1px solid rgba(187, 154, 247, 0.2);
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
  }

  .team-info h3 {
    font-size: 1.8rem;
    color: #bb9af7;
    margin: 0 0 0.5rem 0;
  }

  .team-info p {
    margin: 0;
    color: #a9b1d6;
    font-size: 1.1rem;
  }

  .toggle-btn {
    background-color: rgba(187, 154, 247, 0.1);
    color: #bb9af7;
    border: 1px solid #bb9af7;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .toggle-btn:hover {
    background-color: #bb9af7;
    color: #1a1b26;
    box-shadow: 0 0 10px rgba(187, 154, 247, 0.4);
  }

  .team-footer {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    border-top: 1px solid rgba(187, 154, 247, 0.2);
    padding-top: 1.5rem;
  }

  .members-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 2rem;
  }

  .member-card {
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 1.25rem auto;
    border: 3px solid #565f89;
    overflow: hidden;
    padding: 3px;
    transition: border-color 0.3s ease;
  }

  .lead-member .avatar {
    border-color: #bb9af7;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.3);
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .member-details h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1.2rem;
    color: #c0caf5;
  }

  .member-details .role {
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
    color: #7aa2f7;
    font-weight: 600;
  }

  .member-details .year {
    margin: 0;
    font-size: 0.85rem;
    color: #a9b1d6;
  }

  /* --- Easter Egg --- */
  .easter-egg {
    margin: 2rem auto 0 auto;
    text-align: center;
    width: 100%;
  }

  .secret-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .secret-line {
    font-size: 0.55rem;
    color: #565f89;
    margin: 0;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.5rem;
    }
    .toggle-btn {
      width: 100%;
    }
  }
</style>