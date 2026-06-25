import { clearAuthCookie } from '@/lib/auth';import { redirect } from 'next/navigation';
export async function GET(){await clearAuthCookie();redirect('/')}
