import { json, error } from '@sveltejs/kit';

export async function POST({ request, platform }) {
  const authHeader = request.headers.get('Authorization');
  const expectedKey = platform?.env?.ADMIN_API_KEY;

  if (!expectedKey) {
    throw error(500, 'Server configuration error: Admin API key not set.');
  }

  // Expecting format: "Bearer my-super-secret-upload-key-123"
  if (authHeader !== `Bearer ${expectedKey}`) {
    throw error(401, 'Unauthorized: Invalid or missing API key.');
  }

  const payload = await request.json();
  const db = platform?.env?.DB;
  const kv = platform?.env?.EXAM_CACHE;

  if (!db || !kv) {
    throw error(500, 'Database or Cache configuration is missing.');
  }

  const {
    slug,
    title,
    duration_seconds,
    marks_per_correct,
    negative_marks_per_wrong,
    questions,
    answer_key
  } = payload;

  // Validate minimum required fields
  if (!slug || !title || !questions || !answer_key) {
    throw error(400, 'Missing required exam fields.');
  }

  // Generate metadata
  const examId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const totalQuestions = questions.length;
  const maxScore = totalQuestions * marks_per_correct;

  const contentJson = JSON.stringify(questions);
  const answerKeyJson = JSON.stringify(answer_key);

  // 2. Insert into D1 Database
  try {
    await db
      .prepare(
        `
      INSERT INTO exams (
        id, slug, title, duration_seconds, total_questions, max_score, 
        marks_per_correct, negative_marks_per_wrong, status, 
        content_json, answer_key_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?)
    `
      )
      .bind(
        examId,
        slug,
        title,
        duration_seconds,
        totalQuestions,
        maxScore,
        marks_per_correct,
        negative_marks_per_wrong,
        contentJson,
        answerKeyJson,
        now,
        now
      )
      .run();
  } catch (err) {
    console.error('D1 Insert Error:', err);
    throw error(500, 'Failed to save exam to database.');
  }

  // 3. Construct KV Payloads
  const clientQuestionsPayload = {
    id: examId,
    title,
    duration_seconds,
    marks_per_correct,
    negative_marks_per_wrong,
    questions
  };

  const answerKeyPayload = {
    id: examId,
    marks_per_correct,
    negative_marks_per_wrong,
    answer_key
  };

  // 4. Write to KV concurrently
  try {
    await Promise.all([
      kv.put('exam:active:questions', JSON.stringify(clientQuestionsPayload)),
      kv.put('exam:active:keys', JSON.stringify(answerKeyPayload))
    ]);
  } catch (err) {
    console.error('KV Cache Error:', err);
    // You can choose to fail silently here since the DB write succeeded,
    // and the fallback logic in your load() function will handle it.
  }

  return json({
    success: true,
    examId,
    message: `Exam '${title}' successfully created and published to edge.`
  });
}
