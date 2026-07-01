'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setError(''); setLoading(true);
    try{
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if(!res.ok){ setError(data.error || 'Signup failed.'); setLoading(false); return; }
      router.push('/dashboard');
      router.refresh();
    }catch{ setError('Something went wrong. Try again.'); setLoading(false); }
  }

  return <main className="min-h-screen grid place-items-center bg-[radial-gradient(circle_at_top,#1e1b4b,transparent_40%),#020617] p-6">
    <form onSubmit={submit} className="glass rounded-3xl p-8 w-full max-w-md">
      <h1 className="text-3xl font-black">Create account</h1>
      <p className="text-slate-400 mt-2">Start your verified exam prep journey.</p>
      {error && <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3">{error}</div>}
      <input value={name} onChange={e=>setName(e.target.value)} required className="mt-6 w-full rounded-xl bg-white/10 p-4" placeholder="Full name" />
      <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="mt-3 w-full rounded-xl bg-white/10 p-4" placeholder="Email" />
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required minLength={6} className="mt-3 w-full rounded-xl bg-white/10 p-4" placeholder="Password (min 6 characters)" />
      <button disabled={loading} type="submit" className="block w-full text-center mt-5 rounded-xl neon p-4 font-bold disabled:opacity-50">{loading ? 'Creating account...' : 'Create account'}</button>
      <a href="/api/auth/google" className="flex items-center justify-center gap-3 mt-3 w-full rounded-xl bg-white text-slate-900 p-4 font-bold">
        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.6 0-14.1 4.3-17.4 10.7z"/><path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4C29.4 35 26.8 36 24 36c-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.8 39.6 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4 5.8l6.5 5.4C40.9 36.6 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
        Continue with Google
      </a>
      <p className="text-center text-sm text-slate-400 mt-5">Already have an account? <Link href="/login" className="text-cyan-300 font-bold">Login</Link></p>
    </form>
  </main>;
}
