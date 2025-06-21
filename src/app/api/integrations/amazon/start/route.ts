import { NextResponse } from 'next/server';

const AMAZON_CLIENT_ID = process.env.AMAZON_CLIENT_ID!;
const AMAZON_REDIRECT_URI = process.env.AMAZON_REDIRECT_URI!;
const AMAZON_SCOPES = 'sellingpartnerapi::notifications sellingpartnerapi::orders';

export async function GET() {
  const redirectUrl = `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${AMAZON_CLIENT_ID}&state=secureRandomState&redirect_uri=${encodeURIComponent(AMAZON_REDIRECT_URI)}&version=beta`;
  return NextResponse.redirect(redirectUrl);
} 