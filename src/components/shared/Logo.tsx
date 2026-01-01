import { GraduationCap } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
        <GraduationCap className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl tracking-tight">EduQuest</h1>
        <p className="text-xs text-gray-600">Learn. Play. Grow.</p>
      </div>
    </div>
  );
}
