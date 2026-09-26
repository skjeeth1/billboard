<script>
  import { onMount, onDestroy } from 'svelte';
  import { enhance } from '$app/forms';

  let { data } = $props();
  const { exam, savedState } = data;

  // Initialize from the saved database state
  let timeLeft = $state(exam.duration_seconds - savedState.timeTaken);
  let answers = $state(savedState.answers);

  let timer;
  let autoSaveTimer;
  let formEl = $state();

  onMount(() => {
    document.body.style.overflow = 'auto';

    // 1. The Countdown Timer
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
      } else {
        clearInterval(timer);
        if (formEl) formEl.requestSubmit();
      }
    }, 1000);

    // 2. The Auto-Save Pinger (runs every 10 seconds)
    autoSaveTimer = setInterval(() => {
      const timeTaken = exam.duration_seconds - timeLeft;

      // Fire and forget fetch request
      fetch(`/exams/${exam.id}/autosave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, timeTaken })
      }).catch((err) => console.error('Autosave failed:', err));
    }, 120000);

    return () => {
      clearInterval(timer);
      clearInterval(autoSaveTimer);
    };
  });

  let formattedTime = $derived(() => {
    const m = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  });
</script>

<svelte:head>
  <title>{exam.title} | Examination</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="exam-layout">
  <form method="POST" action="?/submit" use:enhance bind:this={formEl} class="exam-form">
    <!-- Hidden fields to pass Svelte state to the server action -->
    <input type="hidden" name="answers" value={JSON.stringify(answers)} />
    <input type="hidden" name="timeTaken" value={exam.duration_seconds - timeLeft} />

    <nav class="exam-navbar">
      <div class="nav-left">
        <h1 class="exam-title">{exam.title}</h1>
        <div class="timer" class:danger={timeLeft <= 60}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"
            ></polyline></svg
          >
          <span>{formattedTime()}</span>
        </div>
      </div>
      <div class="nav-right">
        <div class="marking-scheme">
          <span class="positive">+{exam.marks_per_correct}</span>
          <span class="separator">|</span>
          <span class="negative">-{exam.negative_marks_per_wrong}</span>
        </div>
        <button class="submit-btn" type="submit">Submit Test</button>
      </div>
    </nav>

    <main class="exam-content">
      <div class="questions-container">
        <!-- INSTRUCTIONS CARD -->
        <div class="question-card instructions-card">
          <div class="question-header">
            <span class="question-number">Instructions</span>
          </div>
          <div class="instructions-content">
            <p class="question-text">
              Please read the following guidelines carefully before proceeding:
            </p>
            <ul class="instructions-list">
              <li>
                <strong>Duration:</strong> You have {Math.floor(exam.duration_seconds / 60)} minutes to
                complete this exam.
              </li>
              <li>
                <strong>Marking Scheme:</strong> You will be awarded
                <span class="highlight-pos">+{exam.marks_per_correct}</span>
                marks for every correct answer, and penalized
                <span class="highlight-neg">-{exam.negative_marks_per_wrong}</span> marks for every incorrect
                answer. Unattempted questions carry no penalty.
              </li>
              <li>
                <strong>Auto-Submit:</strong> The test will automatically submit and conclude when the
                timer reaches zero.
              </li>
              <li>
                <strong>Auto-Save:</strong> Your answers are saved periodically. If your browser crashes
                or you accidentally close the tab, you can resume the test from the dashboard.
              </li>
              <li>
                <strong>Warning:</strong> Do not refresh the page or use the browser's back button.
              </li>
            </ul>
          </div>
        </div>

        <!-- EXISTING QUESTIONS LOOP -->
        {#each exam.questions as question, index (question.id)}
          <div class="question-card" id={`q-${question.id}`}>
            <div class="question-header">
              <span class="question-number">Question {index + 1}</span>
            </div>
            <p class="question-text">{question.text}</p>

            <div class="options-list">
              {#each question.options as option, optIndex}
                <label class="option-label" class:selected={answers[question.id] === optIndex}>
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={optIndex}
                    bind:group={answers[question.id]}
                    class="hidden-radio"
                  />
                  <span class="custom-radio"></span>
                  <span class="option-text">{option}</span>
                </label>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </main>
  </form>
</div>

<style>
  /* Base Layout - Fixes the scroll issue */
  :global(body) {
    background-color: #0c0c10;
    margin: 0;
  }

  .exam-layout {
    font-family: 'JetBrains Mono', monospace;
    background-color: #0c0c10;
    color: #c0caf5;
    height: 100vh;
    overflow-y: auto; /* Scroll allowed here */
    display: flex;
    flex-direction: column;
  }

  .exam-form {
    display: contents; /* Allows children to participate in the layout naturally */
  }

  /* (Keep the rest of your previous Navbar and Card styling here verbatim) */
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
    gap: 1rem; /* Added gap to prevent overlap */
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex: 1; /* Allow it to take up available space */
    min-width: 0; /* Crucial for ellipsis to work in flexbox */
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

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-shrink: 0; /* Prevents the right side from getting squished */
  }

  .timer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: #bb9af7;
    background-color: rgba(187, 154, 247, 0.1);
    padding: 0.4rem 1rem;
    border-radius: 8px;
    border: 1px solid rgba(187, 154, 247, 0.2);
    white-space: nowrap;
    flex-shrink: 0; /* Protects the timer */
  }
  .timer.danger {
    color: #f7768e;
    background-color: rgba(247, 118, 142, 0.1);
    border-color: #f7768e;
  }

  .submit-btn {
    padding: 0.6rem 1.5rem;
    background-color: #bb9af7;
    color: #1a1b26;
    border: none;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap; /* Prevents two-line wrapping */
  }

  .submit-btn:hover {
    background-color: #bb9af7;
    color: #1a1b26;
    box-shadow: 0 0 15px rgba(187, 154, 247, 0.5);
  }

  .exam-content {
    margin-top: 70px;
    padding: 3rem 1rem;
    display: flex;
    justify-content: center;
  }

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
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .question-header {
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(187, 154, 247, 0.1);
    padding-bottom: 0.5rem;
  }
  .question-number {
    font-size: 0.9rem;
    color: #7aa2f7;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .question-text {
    font-size: 1.2rem;
    color: #c0caf5;
    margin: 0 0 1.5rem 0;
  }

  /* Instructions Specific Styling */
  .instructions-card {
    border-color: #7aa2f7; /* Gives the instruction card a distinct blue tint */
  }

  .instructions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: #a9b1d6;
    font-size: 1.05rem;
    line-height: 1.6;
    margin: 0;
    padding-left: 1.5rem;
  }

  .instructions-list li::marker {
    color: #7aa2f7;
  }

  .instructions-list strong {
    color: #c0caf5;
    margin-right: 0.25rem;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .option-label {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background-color: rgba(26, 27, 38, 0.5);
    border: 1px solid rgba(187, 154, 247, 0.2);
    border-radius: 8px;
    cursor: pointer;
  }
  .option-label.selected {
    background-color: rgba(187, 154, 247, 0.15);
    border-color: #bb9af7;
  }

  .hidden-radio {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  .custom-radio {
    height: 20px;
    width: 20px;
    background-color: #1a1b26;
    border: 2px solid #565f89;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .option-label.selected .custom-radio {
    border-color: #bb9af7;
  }
  .option-label.selected .custom-radio::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: #bb9af7;
    border-radius: 50%;
  }
  .option-text {
    font-size: 1.05rem;
    color: #a9b1d6;
  }
  .option-label.selected .option-text {
    color: #ffffff;
    font-weight: 600;
  }

  .marking-scheme {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    font-weight: 700;
    background-color: rgba(26, 27, 38, 0.5);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    border: 1px solid rgba(187, 154, 247, 0.2);
  }

  .marking-scheme .positive,
  .highlight-pos {
    color: #9ece6a; /* Green for positive */
  }

  .marking-scheme .negative,
  .highlight-neg {
    color: #f7768e; /* Red for negative */
  }

  .marking-scheme .separator {
    color: #565f89;
    font-weight: 400;
  }

  /* Mobile Adjustment */
  @media (max-width: 768px) {
    .exam-navbar {
      padding: 0 1rem;
      gap: 0.5rem;
    }
    .nav-left {
      gap: 0.5rem;
    }
    .exam-title {
      display: block; /* Make sure this isn't hidden anymore */
      font-size: 1.05rem;
    }
    .timer {
      padding: 0.3rem 0.6rem;
      font-size: 0.95rem;
    }
    .submit-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
    }
    .marking-scheme {
      display: none;
    }
    .question-card {
      padding: 1.5rem;
    }
    .nav-right {
      gap: 1rem;
    }
    .marking-scheme {
      display: none; /* Hide on very small screens to save navbar space */
    }
  }
</style>
