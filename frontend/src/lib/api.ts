// Adresse de l'API, en chemin relatif. En développement, Vite redirige /api
// vers http://localhost:3000 (voir vite.config.ts). En production, nginx
// redirige /api vers le conteneur backend. Dans les deux cas : même origine.
const BASE = '/api';

// Récupère le token JWT stocké après connexion.
function getToken(): string | null {
  return localStorage.getItem('noru_token');
}

// Petit wrapper autour de fetch :
//  - ajoute automatiquement le token JWT dans le header Authorization
//  - transforme le corps en JSON
//  - lève une erreur lisible si la réponse n'est pas OK
export async function api<T = any>(
  chemin: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(BASE + chemin, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // L'API renvoie parfois un tableau de messages (validation).
    const message = Array.isArray(data.message)
      ? data.message.join(' ')
      : data.message;
    throw new Error(message || 'Une erreur est survenue');
  }

  return data as T;
}
