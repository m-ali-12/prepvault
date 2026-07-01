import { NextResponse } from 'next/server';
import { one, pool } from '@/lib/db';
import { setAuthCookie } from '@/lib/auth';

export async function GET(req: Request){
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const base = process.env.NEXTAUTH_URL || url.origin;
  if(!code) return NextResponse.redirect(`${base}/login?error=google_failed`);

  try{
    const redirectUri = `${base}/api/auth/google/callback`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if(!tokenData.access_token) return NextResponse.redirect(`${base}/login?error=google_failed`);

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    if(!profile.email) return NextResponse.redirect(`${base}/login?error=google_failed`);

    if(!process.env.DATABASE_URL) return NextResponse.redirect(`${base}/login?error=db_not_configured`);

    let user:any = await one('select * from users where email=$1 or google_id=$2', [profile.email.toLowerCase(), profile.id]);
    if(!user){
      const r = await pool.query(
        'insert into users(name,email,google_id,avatar_url,role) values($1,$2,$3,$4,$5) returning *',
        [profile.name || profile.email, profile.email.toLowerCase(), profile.id, profile.picture, 'student']
      );
      user = r.rows[0];
    } else if(!user.google_id){
      await pool.query('update users set google_id=$1, avatar_url=$2 where id=$3', [profile.id, profile.picture, user.id]);
    }

    setAuthCookie({ id: user.id, name: user.name, email: user.email, role: user.role });
    return NextResponse.redirect(`${base}/dashboard`);
  }catch(e){
    return NextResponse.redirect(`${base}/login?error=google_failed`);
  }
}
