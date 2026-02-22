import { NextRequest, NextResponse } from 'next/server';
import { logRequest } from '@/lib/logger';

export async function GET(request: NextRequest) {
  logRequest(request);

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime?.() || 0,
  };

  return NextResponse.json(health);
}
