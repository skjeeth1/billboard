import * as oauth from 'oauth4webapi';

export async function getGoogleConfig(platform) {
  const issuer = new URL('https://accounts.google.com');
  const as = await oauth.discoveryRequest(issuer).then((res) => oauth.processDiscoveryResponse(issuer, res));

  const client = {
    client_id: platform.env.GOOGLE_CLIENT_ID,
    // client_secret: platform.env.GOOGLE_CLIENT_SECRET,
    // token_endpoint_auth_method: 'client_secret_post'
  };

    const clientAuth = oauth.ClientSecretPost(platform.env.GOOGLE_CLIENT_SECRET);

  return { as, client, clientAuth };
}

