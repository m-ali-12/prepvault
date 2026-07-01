import StudentShell from '@/components/StudentShell';
import { fallbackLevels } from '@/lib/data';
import { query } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const examNames: Record<string,string> = { hat: 'HAT', lat: 'LAT', ecat: 'ECAT', mdcat: 'MDCAT', lawgat: 'Law GAT' };

export default async function Dashboard({ searchParams }: { searchParams: { exam?: string } }){
  const user = await currentUser();
  if(!user) redirect('/login');

  const exam = (searchParams.exam || 'hat').toLowerCase();
  let levels: any[] = await query(
    'select level_id as id, level_no, title, description, verified_questions from dashboard_level_view where test_slug=$1',
    [exam]
  );
  if(!levels.length) levels = exam === 'hat' ? fallbackLevels : [];

  return <StudentShell>
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <section>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-black">{examNames[exam] || exam.toUpperCase()} Prep Command Center</h1>
          <Link href="/exams" className="text-sm text-cyan-300 font-bold">Switch exam</Link>
        </div>
        <p className="text-slate-400 mb-8">Finish preparation, pass level test with 85%, then unlock next level.</p>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-3xl p-6"><div className="text-slate-400">Readiness</div><div className="text-4xl font-black">72%</div></div>
          <div className="glass rounded-3xl p-6"><div className="text-slate-400">Current Level</div><div className="text-4xl font-black">1</div></div>
          <div className="glass rounded-3xl p-6"><div className="text-slate-400">Target Pass</div><div className="text-4xl font-black">85%</div></div>
        </div>

        {levels.length === 0 ? (
          <div className="glass rounded-3xl p-6">
            <p className="text-slate-300">Study material for {examNames[exam] || exam.toUpperCase()} is being added. Check back soon, or try HAT which has full sample content.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {levels.map((l, i) => (
              <div key={l.id} className="glass rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <div className="text-cyan-300 text-sm">Level {l.level_no} • {i === 0 ? 'Unlocked' : 'Locked after pass'}</div>
                  <h2 className="text-2xl font-bold">{l.title}</h2>
                  <p className="text-slate-400">{l.description}</p>
                </div>
                <div className="flex gap-3">
                  <Link href={`/study/${l.id}`} className="px-4 py-3 rounded-xl bg-white/10">Study</Link>
                  <Link href={`/test/${l.id}`} className="px-4 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold">Test</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <aside className="space-y-4">
        <div className="glass rounded-3xl p-6">
          <h3 className="text-xl font-bold">AI Tutor</h3>
          <p className="text-slate-400 mt-2">Ask reasoning, math, or verbal questions and get step-by-step explanations.</p>
          <Link href="/ai-tutor" className="mt-5 inline-block rounded-xl neon px-5 py-3 font-bold">Open Tutor</Link>
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="text-xl font-bold">Anti-cheat mode</h3>
          <p className="text-slate-400 mt-2">Fullscreen, tab switch warning, randomized questions.</p>
        </div>
      </aside>
    </div>
  </StudentShell>;
}
