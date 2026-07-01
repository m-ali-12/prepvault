import Link from 'next/link';
import StudentShell from '@/components/StudentShell';

const exams = [
  { slug: 'hat', name: 'HAT', desc: 'HEC HAT preparation with modules and mock tests' },
  { slug: 'lat', name: 'LAT', desc: 'Law Admission Test preparation' },
  { slug: 'ecat', name: 'ECAT', desc: 'Engineering entry test preparation' },
  { slug: 'mdcat', name: 'MDCAT', desc: 'Medical entry test preparation' },
  { slug: 'lawgat', name: 'Law GAT', desc: 'Law GAT preparation' },
];

export default function Exams(){
  return <StudentShell>
    <h1 className="text-4xl font-black mb-2">Choose your exam</h1>
    <p className="text-slate-400 mb-8">Pick the test you're preparing for. Your study path and level tests will be tailored to it.</p>
    <div className="grid md:grid-cols-3 gap-5">
      {exams.map(e => (
        <Link key={e.slug} href={`/dashboard?exam=${e.slug}`} className="glass rounded-3xl p-6 hover:border-cyan-300/40 border border-transparent transition">
          <h2 className="text-2xl font-bold">{e.name}</h2>
          <p className="text-slate-400 mt-2">{e.desc}</p>
          <span className="inline-block mt-5 text-cyan-300 font-bold">Start preparation →</span>
        </Link>
      ))}
    </div>
  </StudentShell>;
}
