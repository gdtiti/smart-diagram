import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 简单的健康检查
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_VERSION || '0.1.0',
      commit: process.env.NEXT_PUBLIC_COMMIT_SHA || 'unknown',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    return NextResponse.json(healthData);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}