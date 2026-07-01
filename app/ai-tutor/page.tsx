import StudentShell from '@/components/StudentShell';
import AiTutorClient from '@/components/AiTutorClient';

export default function AiTutor(){
  return <StudentShell>
    <h1 className="text-4xl font-black mb-6">AI Tutor</h1>
    <AiTutorClient />
  </StudentShell>;
}
