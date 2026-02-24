import { NextResponse } from 'next/server';
import { recordHttpRequest, recordHttpDuration } from '@/lib/metrics';

// Track application start time
const appStartTime = Date.now();

export async function GET() {
  const start = Date.now();
  const uptimeSeconds = Math.floor((Date.now() - appStartTime) / 1000);
  const memUsage = process.memoryUsage();
  
  // Record metrics for this request
  const duration = (Date.now() - start) / 1000;
  recordHttpRequest('GET', '/api/health', 200);
  recordHttpDuration('GET', '/api/health', 200, duration);
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: uptimeSeconds,
    memory: {
      rss: memUsage.rss,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
    },
  });
}


