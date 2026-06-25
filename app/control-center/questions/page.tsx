import AdminShell from '@/components/AdminShell';import { query } from '@/lib/db';
export const dynamic='force-dynamic';
export default async function Page(){const rows=await query('select * from questions limit 20').catch(()=>[]);return <AdminShell><h1 className="text-4xl font-black capitalize mb-6">questions</h1><div className="glass rounded-3xl p-6"><p className="text-slate-400 mb-4">Admin CRUD area. Connect DB to manage live data.</p><pre className="text-xs overflow-auto">{JSON.stringify(rows,null,2)}</pre></div></AdminShell>}
