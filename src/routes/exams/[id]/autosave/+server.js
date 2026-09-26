import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals, params, platform }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });
  
  const db = platform?.env?.DB;
  const { answers, timeTaken } = await request.json();
  const now = Math.floor(Date.now() / 1000);

  // Update the existing in_progress attempt
  await db.prepare(`
    UPDATE exam_attempts 
    SET answers_json = ?, time_taken_seconds = ?, last_saved_at = ?
    WHERE user_id = ? AND exam_id = ? AND status = 'in_progress'
  `).bind(
    JSON.stringify(answers), 
    timeTaken, 
    now, 
    locals.user.id, 
    params.id
  ).run();

  return json({ success: true });
};
