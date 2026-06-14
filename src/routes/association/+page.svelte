<script>
  import { fly, fade, slide } from 'svelte/transition';

  import { Section, getImageUrl, associationData } from '$lib';

  let expandedTeams = $state({});
  let expandedMemes = $state({});

  let activeTab = $state(associationData.length > 0 ? associationData[0].tab : '');
  let isDropdownOpen = $state(false);
  let displayedTeams = $derived(associationData.find((t) => t.tab === activeTab)?.teams || []);

  function toggleTeam(teamName) {
    expandedTeams[teamName] = !expandedTeams[teamName];
    if (!expandedTeams[teamName]) {
      expandedMemes[teamName] = false;
    }
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
    {#if associationData.length > 0}
      <div class="dropdown-wrapper">
        <div class="dropdown-container">
          <button class="dropdown-toggle" onclick={() => (isDropdownOpen = !isDropdownOpen)}>
            <div class="dropdown-toggle-content">
              <span class="dropdown-value">{activeTab}</span>
            </div>
            <svg
              class="chevron"
              class:open={isDropdownOpen}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg
            >
          </button>

          {#if isDropdownOpen}
            <div class="dropdown-menu" transition:fly={{ y: -10, duration: 200 }}>
              {#each associationData as tabData}
                <button
                  class="dropdown-item"
                  class:active={activeTab === tabData.tab}
                  onclick={() => {
                    activeTab = tabData.tab;
                    isDropdownOpen = false;
                  }}
                >
                  {tabData.tab}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <div class="teams-container">
      {#each displayedTeams as team (team.team)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="team-block"
          class:clickable={!expandedMemes[team.team] &&
            team.memeImage &&
            (team.members.length <= (team.tag || 1) || expandedTeams[team.team])}
          onclick={() => {
            if (
              !expandedMemes[team.team] &&
              team.memeImage &&
              (team.members.length <= (team.tag || 1) || expandedTeams[team.team])
            ) {
              expandedMemes[team.team] = true;
            }
          }}
          in:fade={{ duration: 300 }}
        >
          <div class="team-header">
            <div class="team-info">
              <h3>{team.team}</h3>
              {#if team.description}
                <p>{team.description}</p>
              {/if}
            </div>
          </div>

          <div class="members-grid">
            {#each team.members.slice(0, team.tag || 1) as member, i (member.name)}
              <div class="member-card lead-member" in:fly={{ y: 20, duration: 400, delay: i * 50 }}>
                <div class="avatar"><img src={getImageUrl(member.image)} alt={member.name} /></div>
                <div class="member-details">
                  <h4>{member.name}</h4>
                  <p class="role">{member.role}</p>
                  {#if member.year}<p class="year">{member.year}</p>{/if}
                </div>
              </div>
            {/each}
          </div>

          {#if expandedTeams[team.team] && team.members.length > (team.tag || 1)}
            <div transition:slide={{ duration: 400 }}>
              <div class="members-grid" style="padding-top: 2rem;">
                {#each team.members.slice(team.tag || 1) as member, i (member.name)}
                  <div
                    class="member-card"
                    in:fly={{ y: 20, duration: 400, delay: i * 50 }}
                    out:fade={{ duration: 200 }}
                  >
                    <div class="avatar">
                      <img src={getImageUrl(member.image)} alt={member.name} />
                    </div>
                    <div class="member-details">
                      <h4>{member.name}</h4>
                      <p class="role">{member.role}</p>
                      {#if member.year}<p class="year">{member.year}</p>{/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          {#if team.members.length > (team.tag || 1)}
            <div class="team-footer">
              <button
                class="toggle-btn"
                aria-label="Toggle team members"
                onclick={(e) => {
                  e.stopPropagation();
                  toggleTeam(team.team);
                }}
              >
                {expandedTeams[team.team] ? 'Hide Team -' : 'View All +'}
              </button>
            </div>
          {/if}

          {#if team.members.length <= (team.tag || 1) || expandedTeams[team.team]}
            {#if expandedMemes[team.team] && team.memeImage}
              <div transition:slide={{ duration: 400 }}>
                <div
                  class="easter-egg"
                  in:fly={{ y: 20, duration: 400, delay: 100 }}
                  out:fade={{ duration: 200 }}
                >
                  <img src={getImageUrl(team.memeImage)} alt="Team Meme" class="secret-image" />
                  <p class="secret-line">{team.memeLine}</p>
                  <button
                    class="hide-meme-text"
                    aria-label="Hide meme"
                    onclick={(e) => {
                      e.stopPropagation();
                      expandedMemes[team.team] = false;
                    }}
                  >
                    Hide Meme -
                  </button>
                </div>
              </div>
            {:else if team.memeImage}
              <p class="meme-hint" in:fade={{ duration: 300 }}>click to show meme</p>
            {/if}
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
    padding: 0 1rem;
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

  /* --- Dropdown Menu --- */
  .dropdown-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
    width: 100%;
  }

  .dropdown-container {
    position: relative;
    width: 100%;
  }

  .dropdown-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 2rem;
    background-color: rgba(26, 27, 38, 0.4);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 16px;
    color: #c0caf5;
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .dropdown-toggle-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }

  .dropdown-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #bb9af7;
  }

  .dropdown-toggle:hover {
    background: rgba(26, 27, 38, 0.9);
    border-color: rgba(187, 154, 247, 0.5);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .chevron {
    color: #bb9af7;
    transition: transform 0.3s ease;
  }

  .chevron.open {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    width: 100%;
    background: #16161e;
    border: 1px solid rgba(187, 154, 247, 0.3);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 20;
    display: flex;
    flex-direction: column;
  }

  .dropdown-item {
    padding: 1.25rem 2rem;
    background: transparent;
    border: none;
    color: #a9b1d6;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem;
    text-align: left;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
    border-bottom: 1px solid rgba(187, 154, 247, 0.1);
  }

  .dropdown-item:last-child {
    border-bottom: none;
  }

  .dropdown-item:hover {
    background-color: rgba(187, 154, 247, 0.1);
    color: #c0caf5;
  }

  .dropdown-item.active {
    color: #bb9af7;
    font-weight: 700;
    background-color: rgba(187, 154, 247, 0.05);
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
    transition:
      border-color 0.3s ease,
      background-color 0.3s ease;
  }

  .team-block.clickable {
    cursor: pointer;
  }

  .team-block.clickable:hover {
    border-color: rgba(187, 154, 247, 0.5);
    background-color: rgba(26, 27, 38, 0.5);
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

  .hide-meme-text {
    background: none;
    border: none;
    color: #bb9af7;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 4px;
    padding: 0;
    margin-top: 1.25rem;
    transition: color 0.3s ease;
  }

  .hide-meme-text:hover {
    color: #c0caf5;
  }

  .meme-hint {
    text-align: center;
    font-size: 0.8rem;
    color: #565f89;
    margin: 1.5rem 0 0 0;
    font-style: italic;
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

  @media (min-width: 768px) {
    .hero-content {
      padding: 0 1.5rem;
    }
  }
</style>
