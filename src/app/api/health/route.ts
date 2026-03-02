import { NextResponse } from 'next/server';
import { withMetrics } from '@/lib/withMetrics';

// Track application start time
const appStartTime = Date.now();

export const GET = withMetrics(async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - appStartTime) / 1000);
  const memUsage = process.memoryUsage();

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
});


