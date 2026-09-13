export async function handle({ event, resolve }) {
  const sessionId = event.cookies.get('session');

  if (!sessionId || !event.platform?.env?.DB) {
    event.locals.user = null;
    return resolve(event);
  }

  const now = Math.floor(Date.now() / 1000);

  const row = await event.platform.env.DB
    .prepare(
      `SELECT users.id, users.email, users.name, users.avatar_url 
       FROM sessions 
       JOIN users ON sessions.user_id = users.id 
       WHERE sessions.id = ? AND sessions.expires_at > ?`
    )
    .bind(sessionId, now)
    .first();

  if (!row) {
    event.cookies.delete('session', { path: '/' });
    event.locals.user = null;
  } else {
    event.locals.user = row;
  }

  return resolve(event);
}
