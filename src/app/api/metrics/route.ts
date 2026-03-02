import { NextResponse } from 'next/server';
import { register, updateSystemMetrics } from '@/lib/metrics';

export const dynamic = 'force-dynamic';

/**
 * GET /api/metrics
 *
 * Expose Prometheus metrics for scraping.
 * Returns metrics in Prometheus text format.
 */
export async function GET() {
  try {
    updateSystemMetrics();
    const metrics = await register.metrics();

    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 },
    );
  }
}
