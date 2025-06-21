import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { refreshOrders } from '@/lib/cron/refreshOrders';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Start the refresh process
    refreshOrders().catch(console.error);

    return NextResponse.json({ message: 'Order refresh started' });
  } catch (error) {
    console.error('Error starting order refresh:', error);
    return NextResponse.json(
      { error: 'Failed to start order refresh' },
      { status: 500 }
    );
  }
} 