import { NextResponse } from 'next/server';
import { one } from '@/lib/db';
import { comparePassword, setAuthCookie } from '@/lib/auth';

export async function POST(req: Request){
  const { email, password } = await req.json();
  if(!email || !password) return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  if(!process.env.DATABASE_URL) return NextResponse.json({ error: 'Database not configured. Add DATABASE_URL in Vercel.' }, { status: 500 });
  const user:any = await one('select * from users where email=$1', [email.toLowerCase()]);
  if(!user || !user.password_hash) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  const ok = await comparePassword(password, user.password_hash);
  if(!ok) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  setAuthCookie({ id: user.id, name: user.name, email: user.email, role: user.role });
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
