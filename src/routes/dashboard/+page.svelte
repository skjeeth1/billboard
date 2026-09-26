<script>
  import { Section } from '$lib';

  let { data } = $props();
  const { user, availableTests, previousAttempts } = data;

  // Create a Set of exam IDs the user has already completed
  let completedExamIds = $derived(new Set(previousAttempts.map((a) => a.exam_id)));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };
</script>

<svelte:head>
  <title>Dashboard | Department of ECE</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="dashboard-page">
  <section class="dashboard-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <h1>STUDENT DASHBOARD</h1>
      <p>Welcome back, {user.name.split(' ')[0]}</p>
    </div>
  </section>

  <!-- User Profile Section -->
  <Section title="PROFILE" description="Your account details and active status.">
    <div class="profile-card">
      <div class="profile-info">
        <div class="info-group">
          <span class="label">Name</span>
          <span class="value">{user.name}</span>
        </div>
        <div class="info-group">
          <span class="label">Email</span>
          <span class="value">{user.email}</span>
        </div>
        <div class="info-group">
          <span class="label">Member Since</span>
          <span class="value">{formatDate(user.created_at)}</span>
        </div>
      </div>
      <div class="profile-actions">
        <form action="/auth/logout" method="POST">
          <button type="submit" class="logout-btn">Sign Out</button>
        </form>
      </div>
    </div>
  </Section>

  <!-- Available Tests Section -->
  <Section title="AVAILABLE TESTS" description="Exams currently open for you to attempt.">
    {#if availableTests.length > 0}
      <div class="test-grid">
        {#each availableTests as test (test.id)}
          <div class="test-card">
            <h4>{test.title}</h4>
            <div class="test-meta">
              <span><strong>Duration:</strong> {formatTime(test.duration_seconds)}</span>
              <span><strong>Questions:</strong> {test.total_questions}</span>
              <span><strong>Max Score:</strong> {test.max_score}</span>
            </div>

            {#if completedExamIds.has(test.id)}
              <button class="cta-button disabled" disabled>Already Submitted</button>
            {:else}
              <a href={`/exams/${test.id}`} class="cta-button">Start Test &rarr;</a>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <p class="empty-state">No tests are currently available.</p>
    {/if}
  </Section>

  <!-- Previous Attempts Section -->
  <Section title="PREVIOUS ATTEMPTS" description="Your past performance and graded results.">
    {#if previousAttempts.length > 0}
      <div class="attempts-container">
        {#each previousAttempts as attempt (attempt.id)}
          <div class="attempt-row">
            <div class="attempt-details">
              <h4>{attempt.exam_title}</h4>
              <p class="attempt-date">Submitted on {formatDate(attempt.submitted_at)}</p>
            </div>
            <div class="attempt-stats">
              <div class="stat">
                <span class="stat-label">Score</span>
                <span class="stat-value highlight">{attempt.score} / {attempt.max_score}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Time Taken</span>
                <span class="stat-value">{formatTime(attempt.time_taken_seconds)}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="empty-state">You haven't attempted any tests yet.</p>
    {/if}
  </Section>
</div>

<style>
  .dashboard-page {
    font-family: 'JetBrains Mono', monospace;
    background-color: #1a1b26;
    color: #c0caf5;
    line-height: 1.7;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  /* Hero Section */
  .dashboard-hero {
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
    background-image: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80');
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
    margin-top: 1rem;
  }

  /* Profile Card */
  .profile-card {
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .info-group {
    display: flex;
    flex-direction: column;
  }

  .info-group .label {
    font-size: 0.85rem;
    color: #7aa2f7;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .info-group .value {
    font-size: 1.2rem;
    color: #c0caf5;
  }

  .logout-btn {
    padding: 0.75rem 2rem;
    background-color: rgba(247, 118, 142, 0.1);
    color: #f7768e;
    border: 1px solid #f7768e;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .logout-btn:hover {
    background-color: #f7768e;
    color: #1a1b26;
    box-shadow: 0 0 15px rgba(247, 118, 142, 0.4);
  }

  /* Test Grid */
  .test-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  .test-card {
    background: linear-gradient(145deg, rgba(26, 27, 38, 0.6), rgba(22, 22, 30, 0.8));
    border: 1px solid rgba(187, 154, 247, 0.15);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition:
      transform 0.3s ease,
      border-color 0.3s ease;
  }

  .test-card:hover {
    transform: translateY(-5px);
    border-color: rgba(187, 154, 247, 0.5);
  }

  .test-card h4 {
    margin: 0;
    font-size: 1.35rem;
    color: #ffffff;
    line-height: 1.3;
  }

  .test-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: #a9b1d6;
    font-size: 0.95rem;
  }

  .test-meta strong {
    color: #7aa2f7;
  }

  .cta-button {
    margin-top: auto;
    display: inline-block;
    text-align: center;
    padding: 0.75rem 2rem;
    background-color: rgba(187, 154, 247, 0.1);
    color: #bb9af7;
    border: 1px solid #bb9af7;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .cta-button:hover {
    background-color: #bb9af7;
    color: #1a1b26;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }

  .cta-button.disabled {
    background-color: rgba(86, 95, 137, 0.1);
    color: #565f89;
    border-color: #565f89;
    cursor: not-allowed;
    opacity: 0.7;
    pointer-events: none;
  }

  /* Attempts Row */
  .attempts-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .attempt-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(26, 27, 38, 0.4);
    border: 1px solid rgba(187, 154, 247, 0.15);
    border-left: 4px solid #bb9af7;
    border-radius: 12px;
    padding: 1.5rem 2rem;
    flex-wrap: wrap;
    gap: 1.5rem;
    transition: background-color 0.3s ease;
  }

  .attempt-row:hover {
    background-color: rgba(26, 27, 38, 0.7);
  }

  .attempt-details h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: #c0caf5;
  }

  .attempt-date {
    margin: 0;
    color: #a9b1d6;
    font-size: 0.9rem;
  }

  .attempt-stats {
    display: flex;
    gap: 2rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #7aa2f7;
    text-transform: uppercase;
    font-weight: 600;
  }

  .stat-value {
    font-size: 1.2rem;
    color: #c0caf5;
    font-weight: 700;
  }

  .stat-value.highlight {
    color: #bb9af7;
  }

  .empty-state {
    color: #565f89;
    font-style: italic;
    font-size: 1.1rem;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.5rem;
    }

    .profile-card {
      flex-direction: column;
      align-items: stretch;
    }

    .logout-btn {
      width: 100%;
    }

    .attempt-row {
      flex-direction: column;
      align-items: flex-start;
      border-left: none;
      border-top: 4px solid #bb9af7;
    }

    .stat {
      align-items: flex-start;
    }
  }
</style>
