import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params, platform }) => {
  if (!locals.user) throw redirect(302, '/auth/login/google');

  const db = platform?.env?.DB;

  // 1. Fetch the original exam layout
  const exam = await db.prepare(
    `SELECT title, max_score, content_json FROM exams WHERE id = ?`
  ).bind(params.id).first();

  if (!exam) throw redirect(302, '/dashboard');

  // 2. Fetch the user's latest graded attempt
  const attempt = await db.prepare(
    `SELECT score, correct_count, wrong_count, unattempted_count, result_breakdown_json 
     FROM exam_attempts 
     WHERE user_id = ? AND exam_id = ? AND status = 'graded'
     ORDER BY submitted_at DESC LIMIT 1`
  ).bind(locals.user.id, params.id).first();

  if (!attempt) throw redirect(302, '/dashboard');

  return {
    title: exam.title,
    maxScore: exam.max_score,
    questions: JSON.parse(exam.content_json),
    attempt: {
      score: attempt.score,
      correctCount: attempt.correct_count,
      wrongCount: attempt.wrong_count,
      unattemptedCount: attempt.unattempted_count,
      breakdown: JSON.parse(attempt.result_breakdown_json)
    }
  };
};
