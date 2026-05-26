'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/feed');
    } else {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        <span className="text-xs text-zinc-500 font-semibold select-none">Loading LinkUp...</span>
      </div>
    </div>
  );
}
