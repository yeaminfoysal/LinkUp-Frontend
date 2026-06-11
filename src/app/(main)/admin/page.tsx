'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { adminService } from '../../../modules/admin/services/admin.service';
import { useAuthStore } from '../../../store/auth.store';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Sparkles } from 'lucide-react';
import Button from '../../../components/ui/Button';
import AdminUserTable from '../../../modules/admin/components/AdminUserTable';
import toast from '../../../components/ui/Toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [sortBy, setSortBy] = useState<'lastSeen' | 'createdAt'>('lastSeen');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['adminUsers', sortBy, order],
    queryFn: () => adminService.getUsers(sortBy, order),
    enabled: user?.role === 'SUPER_ADMIN',
  });

  const reindexMutation = useMutation({
    mutationFn: adminService.reindexEmbeddings,
    onSuccess: (result) => {
      toast.success(
        `Reindex complete: ${result.updated} updated, ${result.skipped} skipped, ${result.failed} failed (total ${result.total})`,
        8000
      );
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      if (err.response?.status === 429) {
        toast.error('Reindex rate limit reached (max 2 per hour). Try again later.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to reindex embeddings');
      }
    },
  });

  const handleReindex = () => {
    if (
      window.confirm(
        'Regenerate AI embeddings for ALL users? This may take a while and is rate-limited to 2 runs per hour.'
      )
    ) {
      reindexMutation.mutate();
    }
  };

  // If not super admin, we shouldn't show this. (Double check)
  // Note: must stay below the hooks — React hooks can't be called conditionally.
  if (user && user.role !== 'SUPER_ADMIN') {
    router.push('/feed');
    return null;
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto pb-6 px-4 md:px-6 my-4 md:my-0">
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Super Admin Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage users and oversee platform activity.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
           <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
             <Users className="w-5 h-5" />
           </div>
           <div>
             <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Users</p>
             <p className="text-xl font-bold">{users.length}</p>
           </div>
        </div>

        {/* AI Discovery Embeddings */}
      <div className="md:col-span-3 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">AI Discovery Embeddings</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
              Regenerate profile embeddings for all users. Run this once after an embedding
              model change, otherwise AI search scores will be inaccurate.
            </p>
            {reindexMutation.data && (
              <p className="text-sm mt-1 font-medium text-emerald-600 dark:text-emerald-400">
                Last run: {reindexMutation.data.updated} updated, {reindexMutation.data.skipped} skipped,{' '}
                {reindexMutation.data.failed} failed (total {reindexMutation.data.total})
              </p>
            )}
          </div>
        </div>
        <Button onClick={handleReindex} isLoading={reindexMutation.isPending}>
          {reindexMutation.isPending ? 'Reindexing…' : 'Reindex All Embeddings'}
        </Button>
      </div>
      </div>

      

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
         <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
           <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">User List</h2>
           <div className="flex gap-2">
             <select 
               className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none"
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as 'lastSeen' | 'createdAt')}
             >
               <option value="lastSeen">Sort by Last Activity</option>
               <option value="createdAt">Sort by Joined Date</option>
             </select>
           </div>
         </div>
         
         <AdminUserTable users={users} isLoading={isLoading} />
      </div>
    </div>
  );
}
