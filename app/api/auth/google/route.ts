import { NextResponse } from 'next/server';

export async function GET(req: Request){
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if(!clientId) return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured.' }, { status: 500 });
  const base = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const redirectUri = `${base}/api/auth/google/callback`;
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('prompt', 'select_account');
  return NextResponse.redirect(url.toString());
}
