import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!;
const SHOPIFY_REDIRECT_URI = process.env.SHOPIFY_REDIRECT_URI!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');
  const state = searchParams.get('state');

  if (!code || !shop) {
    return NextResponse.json({ error: 'Missing code or shop' }, { status: 400 });
  }

  // Get the logged-in user from the session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: SHOPIFY_CLIENT_ID,
      client_secret: SHOPIFY_CLIENT_SECRET,
      code,
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 });
  }
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Save to PlatformConnection, associated with the logged-in user
  await prisma.platformConnection.create({
    data: {
      userId: user.id,
      platform: 'shopify',
      accessToken,
      storeName: shop,
      storeUrl: `https://${shop}`,
    },
  });

  // Redirect to integrations page with absolute URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${baseUrl}/dashboard/integrations`);
} 