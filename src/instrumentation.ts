// src/instrumentation.ts
// Initialise les métriques Prometheus au démarrage du serveur Node.js.
// Ce fichier est détecté automatiquement par Next.js (>= 13.2).

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Charge le module métriques pour enregistrer les compteurs / histogrammes
    await import('./lib/metrics');
  }
}
