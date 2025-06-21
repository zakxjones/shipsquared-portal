import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const referrals = await prisma.referral.findMany({
    where: { referrerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ referrals });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { firstName, lastName, brandName, site, email, ordersPerMonth } = body;

    // Validate required fields
    if (!firstName || !lastName || !brandName || !email) {
      return NextResponse.json({ 
        error: 'Missing required fields: firstName, lastName, brandName, email' 
      }, { status: 400 });
    }

    // Check if referral already exists for this user and email
    const existingReferral = await prisma.referral.findFirst({
      where: { 
        referrerId: user.id,
        email: email 
      },
    });

    if (existingReferral) {
      return NextResponse.json({ 
        error: 'A referral with this email already exists' 
      }, { status: 400 });
    }

    const referral = await prisma.referral.create({
      data: {
        referrerId: user.id,
        firstName,
        lastName,
        brandName,
        site: site || null,
        email,
        ordersPerMonth: ordersPerMonth || 0,
        referralStatus: 'pending',
        referralBonusStatus: 'pending',
      },
    });

    return NextResponse.json({ referral }, { status: 201 });
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json({ error: 'Failed to create referral' }, { status: 500 });
  }
} 