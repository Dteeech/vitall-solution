import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// ---------------------------------------------------------------------------
// Singleton : évite les duplications lors du hot-reload Next.js en dev
// ---------------------------------------------------------------------------
const globalForMetrics = globalThis as unknown as { metricsRegistry?: Registry };

export const register = globalForMetrics.metricsRegistry ?? new Registry();

if (!globalForMetrics.metricsRegistry) {
  globalForMetrics.metricsRegistry = register;
  collectDefaultMetrics({ register });
}

// --- Gauge : app_uptime_seconds ---
export const appUptimeGauge =
  (register.getSingleMetric('app_uptime_seconds') as Gauge<string>) ??
  new Gauge({
    name: 'app_uptime_seconds',
    help: 'Time in seconds since the application started',
    registers: [register],
  });

// --- Gauge : process_cpu_usage_percent ---
export const processCpuUsage =
  (register.getSingleMetric('process_cpu_usage_percent') as Gauge<string>) ??
  new Gauge({
    name: 'process_cpu_usage_percent',
    help: 'CPU usage percentage of the Node.js process',
    registers: [register],
  });

// --- Gauge : process_memory_usage_bytes ---
export const processMemoryUsage =
  (register.getSingleMetric('process_memory_usage_bytes') as Gauge<string>) ??
  new Gauge({
    name: 'process_memory_usage_bytes',
    help: 'Memory usage in bytes of the Node.js process',
    labelNames: ['type'], // 'rss', 'heapUsed', 'heapTotal', 'external'
    registers: [register],
  });

// --- Counter : http_requests_total ---
export const httpRequestsTotal =
  (register.getSingleMetric('http_requests_total') as Counter<string>) ??
  new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
  });

// --- Histogram : http_request_duration_seconds ---
export const httpRequestDuration =
  (register.getSingleMetric('http_request_duration_seconds') as Histogram<string>) ??
  new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [register],
  });

// ---------------------------------------------------------------------------
// Track application start time (singleton-safe)
// ---------------------------------------------------------------------------
const globalForUptime = globalThis as unknown as { metricsStartTime?: number };
const appStartTime = globalForUptime.metricsStartTime ?? Date.now();
if (!globalForUptime.metricsStartTime) {
  globalForUptime.metricsStartTime = appStartTime;
}

/**
 * Update uptime metric
 */
export function updateUptimeMetric() {
  const uptimeSeconds = (Date.now() - appStartTime) / 1000;
  appUptimeGauge.set(uptimeSeconds);
}

/**
 * Update memory metrics
 */
export function updateMemoryMetrics() {
  const memUsage = process.memoryUsage();
  processMemoryUsage.set({ type: 'rss' }, memUsage.rss);
  processMemoryUsage.set({ type: 'heapUsed' }, memUsage.heapUsed);
  processMemoryUsage.set({ type: 'heapTotal' }, memUsage.heapTotal);
  processMemoryUsage.set({ type: 'external' }, memUsage.external);
}

/**
 * Update CPU metrics
 */
export function updateCpuMetrics() {
  const cpuUsage = process.cpuUsage();
  const totalUsage = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
  const uptimeSeconds = process.uptime();
  const cpuPercent = (totalUsage / uptimeSeconds) * 100;
  processCpuUsage.set(cpuPercent);
}

/**
 * Record an HTTP request
 */
export function recordHttpRequest(
  method: string,
  route: string,
  statusCode: number
) {
  httpRequestsTotal.inc({
    method,
    route,
    status_code: statusCode.toString(),
  });
}

/**
 * Record HTTP request duration
 */
export function recordHttpDuration(
  method: string,
  route: string,
  statusCode: number,
  durationSeconds: number
) {
  httpRequestDuration.observe(
    {
      method,
      route,
      status_code: statusCode.toString(),
    },
    durationSeconds
  );
}

/**
 * Update all system metrics (uptime, CPU, memory)
 * Call this periodically or before serving metrics
 */
export function updateSystemMetrics() {
  updateUptimeMetric();
  updateMemoryMetrics();
  updateCpuMetrics();
}

/**
 * Get metrics in Prometheus format
 */
export async function getMetrics(): Promise<string> {
  updateSystemMetrics();
  return await register.metrics();
}
