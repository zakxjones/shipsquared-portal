import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const AMAZON_CLIENT_ID = process.env.AMAZON_CLIENT_ID!;
const AMAZON_CLIENT_SECRET = process.env.AMAZON_CLIENT_SECRET!;
const AMAZON_REDIRECT_URI = process.env.AMAZON_REDIRECT_URI!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('spapi_oauth_code');
  const state = searchParams.get('state');
  const selling_partner_id = searchParams.get('selling_partner_id');

  if (!code || !selling_partner_id) {
    return NextResponse.json({ error: 'Missing code or selling_partner_id' }, { status: 400 });
  }

  // Exchange code for access/refresh tokens
  const tokenRes = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: AMAZON_CLIENT_ID,
      client_secret: AMAZON_CLIENT_SECRET,
      redirect_uri: AMAZON_REDIRECT_URI,
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 });
  }
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const expiresIn = tokenData.expires_in;

  // Save to PlatformConnection (you'll need to associate with the logged-in user)
  await prisma.platformConnection.create({
    data: {
      userId: 'USER_ID_HERE', // TODO: Replace with actual user ID from session
      platform: 'amazon',
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
      storeName: selling_partner_id,
    },
  });

  // Redirect to integrations page
  return NextResponse.redirect('/dashboard/integrations');
} 