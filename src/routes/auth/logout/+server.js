import { redirect } from '@sveltejs/kit';

export async function POST({ cookies, platform }) {
  const sessionId = cookies.get('session');
  if (sessionId && platform?.env?.DB) {
    await platform.env.DB
      .prepare('DELETE FROM sessions WHERE id = ?')
      .bind(sessionId)
      .run();
  }

  cookies.delete('session', { path: '/' });
  throw redirect(302, '/');
}
