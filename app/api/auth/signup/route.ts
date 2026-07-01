import { NextResponse } from 'next/server';
import { one } from '@/lib/db';
import { pool } from '@/lib/db';
import { hashPassword, setAuthCookie } from '@/lib/auth';

export async function POST(req: Request){
  const { name, email, password } = await req.json();
  if(!name || !email || !password) return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
  if(!process.env.DATABASE_URL) return NextResponse.json({ error: 'Database not configured. Add DATABASE_URL in Vercel.' }, { status: 500 });
  const existing = await one('select id from users where email=$1', [email.toLowerCase()]);
  if(existing) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  const password_hash = await hashPassword(password);
  const r = await pool.query(
    'insert into users(name,email,password_hash,role) values($1,$2,$3,$4) returning id,name,email,role',
    [name, email.toLowerCase(), password_hash, 'student']
  );
  const user = r.rows[0];
  setAuthCookie({ id: user.id, name: user.name, email: user.email, role: user.role });
  return NextResponse.json({ ok: true, user });
}
