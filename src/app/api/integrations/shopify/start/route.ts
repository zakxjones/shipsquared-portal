import { NextResponse } from 'next/server';

const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!;
const SHOPIFY_REDIRECT_URI = process.env.SHOPIFY_REDIRECT_URI!;
const SHOPIFY_SCOPES = 'read_orders,read_products,write_orders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Optionally, let user enter their shop domain, or use a fixed one for testing
  const shop = searchParams.get('shop');
  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
  }

  const redirectUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_CLIENT_ID}&scope=${encodeURIComponent(
    SHOPIFY_SCOPES
  )}&redirect_uri=${encodeURIComponent(SHOPIFY_REDIRECT_URI)}&state=secureRandomState&grant_options[]=`;

  return NextResponse.redirect(redirectUrl);
} 