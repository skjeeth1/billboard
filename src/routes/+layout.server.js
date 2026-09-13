/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals }) => {
  // Assuming your hooks.server.js intercepts the auth session 
  // and assigns the authenticated user to event.locals.user
  return {
    user: locals.user || null
  };
};
