/* Worker Freebuff Sites : sert simplement les fichiers statiques (assets).
   Toute la logique de l'app est côté client (PWA), pas besoin de plus. */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
