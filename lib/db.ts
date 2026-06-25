import { Pool } from 'pg';
const globalForDb=globalThis as unknown as {pool?:Pool};
export const pool=globalForDb.pool ?? new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL?{rejectUnauthorized:false}:false});
if(process.env.NODE_ENV!=='production') globalForDb.pool=pool;
export async function query(text:string, params?:any[]){ if(!process.env.DATABASE_URL) return []; const r=await pool.query(text,params); return r.rows; }
export async function one(text:string, params?:any[]){ if(!process.env.DATABASE_URL) return null; const r=await pool.query(text,params); return r.rows[0]||null; }
