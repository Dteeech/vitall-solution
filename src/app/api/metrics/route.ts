import { NextRequest, NextResponse } from 'next/server';
import { getMetrics } from '@/lib/metrics';

/**
 * GET /api/metrics
 * 
 * Expose Prometheus metrics for scraping
 * Returns metrics in Prometheus text format
 */
export async function GET(request: NextRequest) {
  try {
    const metrics = await getMetrics();
    
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    );
  }
}
