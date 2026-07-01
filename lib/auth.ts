import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

export async function currentUser(){
  try{
    const store = cookies();
    const token = store.get('token')?.value;
    if(!token) return null;
    return jwt.verify(token, SECRET) as any;
  }catch{ return null; }
}

export function setAuthCookie(payload:any){
  const token = jwt.sign(payload, SECRET, { expiresIn: '30d' });
  cookies().set('token', token, { httpOnly:true, secure:true, sameSite:'lax', path:'/', maxAge:60*60*24*30 });
}

export async function clearAuthCookie(){
  cookies().delete('token');
}

export async function hashPassword(p:string){ return bcrypt.hash(p,10); }
export async function comparePassword(p:string,h:string){ return bcrypt.compare(p,h); }
export function signToken(payload:any){ return jwt.sign(payload, SECRET, { expiresIn:'30d' }); }
