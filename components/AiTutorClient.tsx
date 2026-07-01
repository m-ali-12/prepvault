'use client';
import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

type Msg = { question: string; answer: string };

export default function AiTutorClient(){
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/chat/history').then(r => r.json()).then(d => setMessages(d.messages || []));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function ask(){
    if(!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setError('');
    setLoading(true);
    try{
      const res = await fetch('/api/ai-tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) });
      const data = await res.json();
      if(res.status === 401){ setNeedsLogin(true); setLoading(false); return; }
      if(!res.ok){ setError(data.error || 'Something went wrong.'); setLoading(false); return; }
      setMessages(prev => [...prev, { question, answer: data.answer }]);
    }catch{
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  return <>
    <div className="glass rounded-3xl p-6 flex flex-col" style={{ minHeight: '60vh' }}>
      <div className="flex-1 space-y-5 overflow-y-auto" style={{ maxHeight: '50vh' }}>
        {messages.length === 0 && <p className="text-slate-400">Ask any HAT/LAT/ECAT/MDCAT question and get a step-by-step explanation.</p>}
        {messages.map((m, i) => (
          <div key={i}>
            <div className="rounded-2xl bg-cyan-400/10 border border-cyan-400/20 p-4 ml-auto max-w-[85%] text-right">{m.question}</div>
            <div className="rounded-2xl bg-white/5 p-4 mt-2 max-w-[85%] whitespace-pre-wrap">{m.answer}</div>
          </div>
        ))}
        {loading && <div className="rounded-2xl bg-white/5 p-4 max-w-[85%] text-slate-400">Thinking...</div>}
        <div ref={bottomRef} />
      </div>

      {needsLogin && (
        <div className="mt-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-sm p-3">
          Please <Link href="/login" className="font-bold underline">login</Link> to use the AI Tutor and save your chat history.
        </div>
      )}
      {error && <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3">{error}</div>}

      <div className="mt-4 flex gap-3">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); ask(); } }}
          className="w-full min-h-20 rounded-2xl bg-white/10 p-4"
          placeholder="Ask any HAT/LAT/ECAT/MDCAT question..."
        />
        <button onClick={ask} disabled={loading} className="rounded-xl neon px-6 py-3 font-bold disabled:opacity-50 self-end">
          {loading ? '...' : 'Ask AI'}
        </button>
      </div>
    </div>
  </>;
}
