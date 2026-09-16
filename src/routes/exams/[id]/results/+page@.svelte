<script>
  let { data } = $props();
  const { title, maxScore, questions, attempt } = data;
</script>

<svelte:head>
  <title>Results | {title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="results-layout">
  <nav class="exam-navbar">
    <div class="nav-left">
      <h1 class="exam-title">{title} - Results</h1>
    </div>
    <div class="nav-right">
      <a href="/dashboard" class="return-btn">Dashboard</a>
    </div>
  </nav>

  <main class="results-content">
    <!-- Score Card -->
    <div class="score-card">
      <div class="score-circle">
        <span class="score-value">{attempt.score}</span>
        <span class="score-max">/ {maxScore}</span>
      </div>
      <div class="score-stats">
        <div class="stat">
          <span class="label">Correct</span> <span class="val success">{attempt.correctCount}</span>
        </div>
        <div class="stat">
          <span class="label">Wrong</span> <span class="val danger">{attempt.wrongCount}</span>
        </div>
        <div class="stat">
          <span class="label">Skipped</span>
          <span class="val neutral">{attempt.unattemptedCount}</span>
        </div>
      </div>
    </div>

    <!-- Questions Review -->
    <div class="questions-container">
      {#each questions as question, index}
        {@const breakdown = attempt.breakdown[question.id]}

        <div
          class="question-card"
          class:correct-card={breakdown.correct}
          class:wrong-card={!breakdown.correct && breakdown.attempted}
        >
          <div class="question-header">
            <span class="question-number">Question {index + 1}</span>
            <span
              class="status-badge {breakdown.correct
                ? 'success'
                : breakdown.attempted
                  ? 'danger'
                  : 'neutral'}"
            >
              {breakdown.correct ? 'Correct' : breakdown.attempted ? 'Incorrect' : 'Skipped'}
            </span>
          </div>
          <p class="question-text">{question.text}</p>

          <div class="options-list">
            {#each question.options as option, optIndex}
              {@const isCorrectOpt = breakdown.correctOpt === optIndex}
              {@const isUserOpt = breakdown.userOpt === optIndex}

              <div
                class="option-row"
                class:is-correct={isCorrectOpt}
                class:is-wrong={isUserOpt && !isCorrectOpt}
              >
                <span class="indicator">
                  {#if isCorrectOpt}
                    ✓
                  {:else if isUserOpt}
                    ✗
                  {:else}
                    •
                  {/if}
                </span>
                <span class="option-text">{option}</span>

                {#if isUserOpt && isCorrectOpt}
                  <span class="tag">Your Answer (Correct)</span>
                {:else if isUserOpt}
                  <span class="tag">Your Answer</span>
                {:else if isCorrectOpt}
                  <span class="tag">Correct Answer</span>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </main>
</div>

<style>
  :global(body) {
    background-color: #0c0c10;
    margin: 0;
  }

  .results-layout {
    font-family: 'JetBrains Mono', monospace;
    background-color: #0c0c10;
    color: #c0caf5;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .exam-navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: #16161e;
    border-bottom: 1px solid rgba(187, 154, 247, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    box-sizing: border-box;
    z-index: 100;
    gap: 1rem;
  }

  .nav-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .nav-right {
    flex-shrink: 0;
  }

  .exam-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    /* Truncation properties */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .return-btn {
    padding: 0.6rem 1.5rem;
    background-color: rgba(187, 154, 247, 0.1);
    color: #bb9af7;
    border: 1px solid #bb9af7;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
    white-space: nowrap; /* Prevents three-line wrapping */
  }
  /* Add this hover state */
  .return-btn:hover {
    background-color: #bb9af7;
    color: #1a1b26;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }
  .results-content {
    margin-top: 70px;
    padding: 3rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }

  /* Score Card */
  .score-card {
    background: #1a1b26;
    border: 1px solid rgba(187, 154, 247, 0.3);
    border-radius: 16px;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 600px;
  }
  .score-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 4px solid #bb9af7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(187, 154, 247, 0.1);
  }
  .score-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
    font-family: 'Space Grotesk', sans-serif;
  }
  .score-max {
    font-size: 1.2rem;
    color: #a9b1d6;
  }

  .score-stats {
    display: flex;
    gap: 3rem;
  }
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .stat .label {
    font-size: 0.9rem;
    color: #7aa2f7;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  .stat .val {
    font-size: 1.5rem;
    font-weight: 700;
  }
  .val.success {
    color: #9ece6a;
  }
  .val.danger {
    color: #f7768e;
  }
  .val.neutral {
    color: #a9b1d6;
  }

  /* Questions Review */
  .questions-container {
    max-width: 800px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .question-card {
    background: #1a1b26;
    border: 1px solid rgba(187, 154, 247, 0.15);
    border-radius: 12px;
    padding: 2rem;
  }
  .question-card.correct-card {
    border-left: 4px solid #9ece6a;
  }
  .question-card.wrong-card {
    border-left: 4px solid #f7768e;
  }

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(187, 154, 247, 0.1);
    padding-bottom: 0.5rem;
  }
  .question-number {
    font-size: 0.9rem;
    color: #7aa2f7;
    font-weight: 700;
    text-transform: uppercase;
  }
  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 700;
  }
  .status-badge.success {
    background: rgba(158, 206, 106, 0.15);
    color: #9ece6a;
  }
  .status-badge.danger {
    background: rgba(247, 118, 142, 0.15);
    color: #f7768e;
  }
  .status-badge.neutral {
    background: rgba(169, 177, 214, 0.15);
    color: #a9b1d6;
  }

  .question-text {
    font-size: 1.2rem;
    color: #c0caf5;
    margin: 0 0 1.5rem 0;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .option-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.1);
    border-radius: 8px;
  }
  .option-row.is-correct {
    background-color: rgba(158, 206, 106, 0.1);
    border-color: #9ece6a;
  }
  .option-row.is-wrong {
    background-color: rgba(247, 118, 142, 0.1);
    border-color: #f7768e;
  }

  .indicator {
    font-size: 1.2rem;
    font-weight: bold;
    width: 24px;
    text-align: center;
  }
  .is-correct .indicator {
    color: #9ece6a;
  }
  .is-wrong .indicator {
    color: #f7768e;
  }

  .option-text {
    flex-grow: 1;
    font-size: 1.05rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
  }
  .is-correct .tag {
    background: rgba(158, 206, 106, 0.2);
    color: #9ece6a;
  }
  .is-wrong .tag {
    background: rgba(247, 118, 142, 0.2);
    color: #f7768e;
  }

  @media (max-width: 768px) {
    .exam-navbar {
      padding: 0 1rem;
    }
    .exam-title {
      font-size: 1.05rem;
    }
    .return-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
    }
  }
</style>
