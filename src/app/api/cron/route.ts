import { NextResponse } from 'next/server';
import { setupCronJobs } from '@/lib/cron/setup';

// Initialize cron jobs
setupCronJobs();

export async function GET() {
  return NextResponse.json({ message: 'Cron jobs initialized' });
} 