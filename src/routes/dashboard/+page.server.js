import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, platform }) => {
  // 1. Ensure the user is authenticated
  // Assumes your hooks.server.js populates locals.user
  if (!locals.user) {
    throw redirect(302, '/auth/login/google');
  }

  const userId = locals.user.id;
  
  // Access the D1 binding (ensure your binding name matches 'DB' in wrangler.toml)
  const db = platform?.env?.DB;

  if (!db) {
    console.error("D1 Database binding not found on platform.env");
    return {
      user: locals.user,
      availableTests: [],
      previousAttempts: []
    };
  }

  try {
    // 2. Fetch User Data (Using the users table you mentioned having)
    const dbUser = await db.prepare(
      `SELECT name, email, created_at FROM users WHERE id = ?`
    ).bind(userId).first();

    const user = {
      name: dbUser?.name || locals.user.name,
      email: dbUser?.email || locals.user.email,
      // Convert Unix seconds to ISO string for the frontend formatter
      created_at: dbUser?.created_at ? new Date(dbUser.created_at * 1000).toISOString() : new Date().toISOString()
    };

    // 3. Fetch Available Tests (Only published exams)
    const { results: availableTestsRaw } = await db.prepare(
      `SELECT id, title, duration_seconds, total_questions, max_score
       FROM exams
       WHERE status = 'published'`
    ).all();

    // 4. Fetch Previous Attempts
    // Joining exam_attempts with exams to get the exam title and max possible score
    const { results: previousAttemptsRaw } = await db.prepare(
      `SELECT
         ea.id,
	 ea.exam_id,
         e.title AS exam_title,
         ea.score,
         e.max_score,
         ea.submitted_at,
         ea.time_taken_seconds
       FROM exam_attempts ea
       JOIN exams e ON ea.exam_id = e.id
       WHERE ea.user_id = ? AND ea.status IN ('submitted', 'graded')
       ORDER BY ea.submitted_at DESC`
    ).bind(userId).all();

    // Format the timestamps for the previous attempts
    const previousAttempts = previousAttemptsRaw.map(attempt => ({
      ...attempt,
      submitted_at: attempt.submitted_at ? new Date(attempt.submitted_at * 1000).toISOString() : null
    }));

    return {
      user,
      availableTests: availableTestsRaw || [],
      previousAttempts: previousAttempts || []
    };

  } catch (error) {
    console.error("Dashboard DB Query Error:", error);
    
    // Graceful fallback if the DB query fails
    return {
      user: locals.user,
      availableTests: [],
      previousAttempts: []
    };
  }
};
