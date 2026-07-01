import Link from 'next/link';
import { currentUser } from '@/lib/auth';

export default async function StudentShell({children}:{children:React.ReactNode}){
  const user = await currentUser();
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#164e63,transparent_35%),#020617] p-6">
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-black">PrepVault<span className="text-cyan-300"> AI</span></Link>
        <div className="flex items-center gap-4 text-sm text-slate-300">
          {user ? (
            <>
              <span>{user.name}</span>
              <Link href="/logout" className="px-4 py-2 rounded-xl glass">Logout</Link>
            </>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  </main>;
}
