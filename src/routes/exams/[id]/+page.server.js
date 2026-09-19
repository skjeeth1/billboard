import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params, request, platform }) => {
  if (!locals.user) throw redirect(302, '/auth/login/google');

  const referer = request.headers.get('referer');
  if (!referer || !referer.includes('/dashboard')) throw redirect(302, '/dashboard');

  const db = platform?.env?.DB;
  const kv = platform?.env?.EXAM_CACHE;

  // 1. BLOCK ACCESS FIRST: Check if they have already submitted this exam
  const completedAttempt = await db
    .prepare(
      `SELECT id FROM exam_attempts 
     WHERE user_id = ? AND exam_id = ? AND status IN ('submitted', 'graded')`
    )
    .bind(locals.user.id, params.id)
    .first();

  if (completedAttempt) {
    throw redirect(302, `/exams/${params.id}/results`);
  }

  // 2. FETCH PAYLOAD ONLY IF NEEDED: Attempt KV Read for Exam Questions
  let examData = null;
  try {
    if (kv) {
      const cachedExam = await kv.get('exam:active:questions', 'json');
      if (cachedExam && cachedExam.id === params.id) {
        examData = cachedExam;
        console.info(`✅ [KV HIT] Loaded questions for exam: ${params.id}`);
      } else {
        console.info(`⚠️ [KV MISS] Cache empty or mismatched for exam: ${params.id}`);
      }
    }
  } catch (err) {
    console.error('KV Read Error (questions):', err);
  }

  // Fallback to D1
  if (!examData) {
    console.warn(`🗄️ [D1 FALLBACK] Querying database for exam: ${params.id}`);
    const exam = await db
      .prepare(
        `SELECT id, title, duration_seconds, content_json, marks_per_correct, negative_marks_per_wrong FROM exams WHERE id = ? AND status = 'published'`
      )
      .bind(params.id)
      .first();

    if (!exam) throw redirect(302, '/dashboard');

    examData = {
      id: exam.id,
      title: exam.title,
      duration_seconds: exam.duration_seconds,
      marks_per_correct: exam.marks_per_correct,
      negative_marks_per_wrong: exam.negative_marks_per_wrong,
      questions: JSON.parse(exam.content_json)
    };
  }

  // 3. HANDLE SESSION STATE: Check for an existing in_progress attempt
  let attempt = await db
    .prepare(
      `SELECT id, answers_json, time_taken_seconds 
     FROM exam_attempts 
     WHERE user_id = ? AND exam_id = ? AND status = 'in_progress'`
    )
    .bind(locals.user.id, params.id)
    .first();

  if (!attempt) {
    const prevAttempt = await db
      .prepare(
        `SELECT MAX(attempt_number) as max_attempt FROM exam_attempts WHERE user_id = ? AND exam_id = ?`
      )
      .bind(locals.user.id, params.id)
      .first();

    const attemptNum = (prevAttempt?.max_attempt || 0) + 1;
    const now = Math.floor(Date.now() / 1000);
    const attemptId = crypto.randomUUID();

    await db
      .prepare(
        `
      INSERT INTO exam_attempts (id, exam_id, user_id, attempt_number, status, started_at, time_taken_seconds, answers_json) 
      VALUES (?, ?, ?, ?, 'in_progress', ?, 0, '{}')
    `
      )
      .bind(attemptId, params.id, locals.user.id, attemptNum, now)
      .run();

    attempt = { answers_json: '{}', time_taken_seconds: 0 };
  }

  return {
    exam: examData,
    savedState: {
      answers: JSON.parse(attempt.answers_json || '{}'),
      timeTaken: attempt.time_taken_seconds || 0
    }
  };
};

export const actions = {
  submit: async ({ request, locals, params, platform }) => {
    if (!locals.user) throw redirect(302, '/auth/login/google');

    const db = platform?.env?.DB;
    const kv = platform?.env?.EXAM_CACHE; // <-- Bring in KV
    const formData = await request.formData();

    const submittedAnswers = JSON.parse(formData.get('answers') || '{}');
    const timeTaken = parseInt(formData.get('timeTaken') || '0', 10);

    // --- 1. Attempt KV Read for Answer Key ---
    let answerKey = null;
    let marksPerCorrect = 0;
    let negativePerWrong = 0;

    try {
      if (kv) {
        const cachedKeys = await kv.get('exam:active:keys', 'json');
        // Ensure the cached keys match the current exam ID
        if (cachedKeys && cachedKeys.id === params.id) {
          answerKey = cachedKeys.answer_key;
          marksPerCorrect = cachedKeys.marks_per_correct;
          negativePerWrong = cachedKeys.negative_marks_per_wrong;
          console.info(`✅ [KV HIT] Loaded answers for exam: ${params.id}`);
        } else {
          console.info(`⚠️ [KV MISS] Answer cache empty or mismatched for exam: ${params.id}`);
        }
      }
    } catch (err) {
      console.error('KV Read Error (keys):', err);
    }

    // --- 2. Fallback to D1 if KV fails or misses ---
    if (!answerKey) {
      console.warn(`🗄️ [D1 FALLBACK] Querying database for exam answers: ${params.id}`);
      const exam = await db
        .prepare(
          `SELECT answer_key_json, marks_per_correct, negative_marks_per_wrong FROM exams WHERE id = ?`
        )
        .bind(params.id)
        .first();

      if (!exam) throw redirect(302, '/dashboard');

      answerKey = JSON.parse(exam.answer_key_json);
      marksPerCorrect = exam.marks_per_correct;
      negativePerWrong = exam.negative_marks_per_wrong;
    }

    // --- 3. Grade the submission in memory ---
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let resultBreakdown = {};

    for (const qId of Object.keys(answerKey)) {
      const correctOpt = answerKey[qId];
      const userOpt = submittedAnswers[qId];

      if (userOpt === undefined || userOpt === null) {
        unattemptedCount++;
        resultBreakdown[qId] = { attempted: false, correct: false, correctOpt, userOpt: null };
      } else if (userOpt === correctOpt) {
        correctCount++;
        score += marksPerCorrect;
        resultBreakdown[qId] = { attempted: true, correct: true, correctOpt, userOpt };
      } else {
        wrongCount++;
        score -= negativePerWrong;
        resultBreakdown[qId] = { attempted: true, correct: false, correctOpt, userOpt };
      }
    }

    const now = Math.floor(Date.now() / 1000);

    // --- 4. Single D1 write to finalize the attempt ---
    await db
      .prepare(
        `
      UPDATE exam_attempts SET 
        status = 'graded',
        submitted_at = ?,
        graded_at = ?,
        time_taken_seconds = ?,
        answers_json = ?,
        score = ?,
        correct_count = ?,
        wrong_count = ?,
        unattempted_count = ?,
        result_breakdown_json = ?
      WHERE user_id = ? AND exam_id = ? AND status = 'in_progress'
    `
      )
      .bind(
        now,
        now,
        timeTaken,
        JSON.stringify(submittedAnswers),
        score,
        correctCount,
        wrongCount,
        unattemptedCount,
        JSON.stringify(resultBreakdown),
        locals.user.id,
        params.id
      )
      .run();

    throw redirect(303, `/exams/${params.id}/results`);
  }
};
