import { httpRequestsTotal, httpRequestDuration } from '@/lib/metrics';

/**
 * Normalise un chemin pour limiter la cardinalité des labels Prometheus.
 * Remplace les UUIDs et IDs numériques par `:id`.
 */
function normalizeRoute(pathname: string): string {
  return pathname
    .replaceAll(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
    .replaceAll(/\/\d+/g, '/:id');
}

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;

/**
 * Wrapper qui instrumente automatiquement un handler de route API Next.js :
 *  - Incrémente `http_requests_total`   (method, route, status_code)
 *  - Observe  `http_request_duration_seconds` (method, route, status_code)
 */
export function withMetrics(handler: Handler): Handler {
  return async (req, ctx) => {
    const start = performance.now();

    let response: Response;
    try {
      response = await handler(req, ctx);
    } catch (error) {
      // En cas d'exception non gérée, on enregistre une 500
      const route = normalizeRoute(new URL(req.url).pathname);
      const durationSeconds = (performance.now() - start) / 1000;

      httpRequestsTotal.inc({
        method: req.method,
        route,
        status_code: '500',
      });
      httpRequestDuration.observe(
        { method: req.method, route, status_code: '500' },
        durationSeconds,
      );
      throw error;
    }

    const route = normalizeRoute(new URL(req.url).pathname);
    const durationSeconds = (performance.now() - start) / 1000;
    const statusCode = response.status.toString();

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: statusCode,
    });
    httpRequestDuration.observe(
      { method: req.method, route, status_code: statusCode },
      durationSeconds,
    );

    return response;
  };
}
