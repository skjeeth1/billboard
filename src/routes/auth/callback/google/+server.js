import { redirect } from '@sveltejs/kit';
import * as oauth from 'oauth4webapi';
import { getGoogleConfig } from '$lib/server/oauth.js';

export async function GET({ url, cookies, platform }) {
  const storedState = cookies.get('g_state');
  const codeVerifier = cookies.get('g_verifier');

  cookies.delete('g_state', { path: '/' });
  cookies.delete('g_verifier', { path: '/' });

  if (!storedState || !codeVerifier) {
    return new Response('Missing state or code verifier', { status: 400 });
  }

  const { as, client, clientAuth } = await getGoogleConfig(platform);
  const redirectUri = `${url.origin}/auth/callback/google`;

  try {
    const params = oauth.validateAuthResponse(as, client, url, storedState);

    const response = await oauth.authorizationCodeGrantRequest(
      as,
      client,
      clientAuth,       // <-- was missing before
      params,
      redirectUri,
      codeVerifier
    );

    const result = await oauth.processAuthorizationCodeResponse(as, client, response);

    const claims = oauth.getValidatedIdTokenClaims(result);
    const googleId = claims.sub;
    const email = claims.email;
    const name = claims.name || 'User';
    const avatar = claims.picture || null;

    if (!platform?.env?.DB) {
      throw new Error('Database binding (DB) is missing in the Cloudflare environment.');
    }

    const db = platform.env.DB;

    let user = await db
      .prepare('SELECT id, email, name FROM users WHERE google_id = ?')
      .bind(googleId)
      .first();

    if (!user) {
      const userId = crypto.randomUUID();
      await db
        .prepare('INSERT INTO users (id, google_id, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)')
        .bind(userId, googleId, email, name, avatar)
        .run();
      user = { id: userId, email, name };
    }

    const sessionId = crypto.randomUUID();
    const maxAge = 60 * 60 * 24 * 30;
    const expiresAt = Math.floor(Date.now() / 1000) + maxAge;

    await db
      .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
      .bind(sessionId, user.id, expiresAt)
      .run();

    cookies.set('session', sessionId, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      maxAge,
      sameSite: 'lax'
    });
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return new Response(`OAuth Error: ${err?.message || err}`, { status: 400 });
  }

  throw redirect(302, '/');
}
