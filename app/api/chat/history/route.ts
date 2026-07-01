import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(){
  const user = await currentUser();
  if(!user) return NextResponse.json({ messages: [] });
  const rows = await query('select question, answer, created_at from chat_messages where user_id=$1 order by created_at asc limit 100', [user.id]).catch(()=>[]);
  return NextResponse.json({ messages: rows });
}
