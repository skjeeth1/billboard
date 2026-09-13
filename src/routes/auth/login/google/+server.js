import { redirect } from '@sveltejs/kit';
import * as oauth from 'oauth4webapi';
import { getGoogleConfig } from '$lib/server/oauth.js';

export async function GET({ cookies, platform, url }) {
  const { as, client } = await getGoogleConfig(platform);
  const redirectUri = `${url.origin}/auth/callback/google`;

  const codeVerifier = oauth.generateRandomCodeVerifier();
  const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
  const state = oauth.generateRandomState(); // synchronous, no await needed

  cookies.set('g_state', state, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    maxAge: 60 * 10,
    sameSite: 'lax'
  });

  cookies.set('g_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    maxAge: 60 * 10,
    sameSite: 'lax'
  });

  const authorizationUrl = new URL(as.authorization_endpoint);
  authorizationUrl.searchParams.set('client_id', client.client_id);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid email profile');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('code_challenge', codeChallenge);
  authorizationUrl.searchParams.set('code_challenge_method', 'S256');
  authorizationUrl.searchParams.set('prompt', 'select_account');

  throw redirect(302, authorizationUrl.toString());
}
