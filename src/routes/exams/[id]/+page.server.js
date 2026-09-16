import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params, request, platform }) => {
  if (!locals.user) throw redirect(302, '/auth/login/google');
  
  const referer = request.headers.get('referer');
  if (!referer || !referer.includes('/dashboard')) throw redirect(302, '/dashboard');

  const db = platform?.env?.DB;

  const exam = await db.prepare(
    `SELECT id, title, duration_seconds, content_json 
     FROM exams WHERE id = ? AND status = 'published'`
  ).bind(params.id).first();

  if (!exam) throw redirect(302, '/dashboard');

  // --- NEW: Block access if they have already submitted this exam ---
  const completedAttempt = await db.prepare(
    `SELECT id FROM exam_attempts 
     WHERE user_id = ? AND exam_id = ? AND status IN ('submitted', 'graded')`
  ).bind(locals.user.id, params.id).first();

  if (completedAttempt) {
    // Kick them to the results page instead of letting them take it again
    throw redirect(302, `/exams/${params.id}/results`);
  }

  // --- Check for an existing in_progress attempt ---
  let attempt = await db.prepare(
    `SELECT id, answers_json, time_taken_seconds 
     FROM exam_attempts 
     WHERE user_id = ? AND exam_id = ? AND status = 'in_progress'`
  ).bind(locals.user.id, params.id).first();

  if (!attempt) {
    const prevAttempt = await db.prepare(
      `SELECT MAX(attempt_number) as max_attempt FROM exam_attempts WHERE user_id = ? AND exam_id = ?`
    ).bind(locals.user.id, params.id).first();
    
    const attemptNum = (prevAttempt?.max_attempt || 0) + 1;
    const now = Math.floor(Date.now() / 1000);
    const attemptId = crypto.randomUUID();

    await db.prepare(`
      INSERT INTO exam_attempts (id, exam_id, user_id, attempt_number, status, started_at, time_taken_seconds, answers_json) 
      VALUES (?, ?, ?, ?, 'in_progress', ?, 0, '{}')
    `).bind(attemptId, params.id, locals.user.id, attemptNum, now).run();

    attempt = { answers_json: '{}', time_taken_seconds: 0 };
  }

  return {
    exam: {
      id: exam.id,
      title: exam.title,
      duration_seconds: exam.duration_seconds,
      questions: JSON.parse(exam.content_json)
    },
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
    const formData = await request.formData();
    
    const submittedAnswers = JSON.parse(formData.get('answers') || '{}');
    const timeTaken = parseInt(formData.get('timeTaken') || '0', 10);

    const exam = await db.prepare(
      `SELECT answer_key_json, marks_per_correct, negative_marks_per_wrong FROM exams WHERE id = ?`
    ).bind(params.id).first();

    const answerKey = JSON.parse(exam.answer_key_json);
    
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
        score += exam.marks_per_correct;
        resultBreakdown[qId] = { attempted: true, correct: true, correctOpt, userOpt };
      } else {
        wrongCount++;
        score -= exam.negative_marks_per_wrong;
        resultBreakdown[qId] = { attempted: true, correct: false, correctOpt, userOpt };
      }
    }

    const now = Math.floor(Date.now() / 1000);

    // --- NEW: Update the in_progress attempt to 'graded' instead of inserting ---
    await db.prepare(`
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
    `).bind(
      now, now, timeTaken, JSON.stringify(submittedAnswers), 
      score, correctCount, wrongCount, unattemptedCount, JSON.stringify(resultBreakdown),
      locals.user.id, params.id
    ).run();

    throw redirect(303, `/exams/${params.id}/results`);
  }
};
