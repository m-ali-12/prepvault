import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export async function currentUser(){try{const store=cookies(); const token=store.get('token')?.value; if(!token)return null; return jwt.verify(token,process.env.NEXTAUTH_SECRET||'dev-secret') as any;}catch{return null}}
export async function clearAuthCookie(){cookies().delete('token')}
export async function hashPassword(p:string){return bcrypt.hash(p,10)}
export async function comparePassword(p:string,h:string){return bcrypt.compare(p,h)}
export function signToken(payload:any){return jwt.sign(payload,process.env.NEXTAUTH_SECRET||'dev-secret',{expiresIn:'7d'})}
