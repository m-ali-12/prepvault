import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { pool } from '@/lib/db';

export async function POST(req: Request){
  const user = await currentUser();
  if(!user) return NextResponse.json({ error: 'Please login to use the AI Tutor.' }, { status: 401 });

  const { question } = await req.json();
  if(!question || !question.trim()) return NextResponse.json({ error: 'Please type a question.' }, { status: 400 });

  if(!process.env.GROQ_API_KEY){
    return NextResponse.json({ error: 'AI Tutor is not configured yet. Add GROQ_API_KEY in Vercel Environment Variables.' }, { status: 500 });
  }

  let answer = '';
  try{
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a verified exam preparation tutor for Pakistani HAT, LAT, ECAT, MDCAT and Law GAT students. Explain clearly and step by step.' },
          { role: 'user', content: question },
        ],
      }),
    });
    if(!r.ok){
      const errText = await r.text();
      return NextResponse.json({ error: `AI service error: ${r.status}. ${errText.slice(0,200)}` }, { status: 502 });
    }
    const data = await r.json();
    answer = data.choices?.[0]?.message?.content || 'No answer returned.';
  }catch(e:any){
    return NextResponse.json({ error: 'Could not reach the AI service. Try again.' }, { status: 502 });
  }

  try{
    if(process.env.DATABASE_URL){
      await pool.query('insert into chat_messages(user_id, question, answer) values($1,$2,$3)', [user.id, question, answer]);
    }
  }catch(e){ /* saving history should never block the answer */ }

  return NextResponse.json({ answer });
}
