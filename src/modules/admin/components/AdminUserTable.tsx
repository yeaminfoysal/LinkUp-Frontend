import React, { useState } from 'react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { MoreVertical, MessageSquare, Users, UserPlus, FileText } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/shared/Avatar';
import AdminNestedViews from './AdminNestedViews';
import { useRouter } from 'next/navigation';

interface AdminUserTableProps {
  users: any[];
  isLoading: boolean;
}

export default function AdminUserTable({ users, isLoading }: AdminUserTableProps) {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<any>(null);
  const [activeView, setActiveView] = useState<'friends' | 'pendingRequests' | 'conversations' | null>(null);

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500">Loading users...</div>;
  }

  const openView = (user: any, view: 'friends' | 'pendingRequests' | 'conversations') => {
    setActiveUser(user);
    setActiveView(view);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs uppercase text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Status / Activity</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-center">Posts/Likes/Cmds</th>
              <th className="px-4 py-3 font-medium text-center">Friends</th>
              <th className="px-4 py-3 font-medium text-center">Requests</th>
              <th className="px-4 py-3 font-medium text-center">Chats</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors group">
                <td className="px-4 py-3 flex items-center gap-3">
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</p>
                    <p className="text-xs text-zinc-500">@{user.username}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                    <span className="text-xs">
                      {user.isOnline ? 'Online' : (user.lastSeen ? formatDistanceToNow(parseISO(user.lastSeen), { addSuffix: true }) : 'Never')}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {format(parseISO(user.createdAt), 'MMM d, yyyy')}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {format(parseISO(user.createdAt), 'h:mm a')}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs font-semibold" title="Posts">{user.postsCount}</span>
                    <span className="bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 px-2 py-0.5 rounded-full text-xs font-semibold" title="Likes">{user.likesCount}</span>
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded-full text-xs font-semibold" title="Comments">{user.commentsCount}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button variant="secondary" size="sm" onClick={() => openView(user, 'friends')} className="text-xs min-w-[3rem]">
                    {user.friendsCount}
                  </Button>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button variant="secondary" size="sm" onClick={() => openView(user, 'pendingRequests')} className="text-xs min-w-[3rem]">
                    {user.pendingRequestsCount}
                  </Button>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button variant="secondary" size="sm" onClick={() => openView(user, 'conversations')} className="text-xs min-w-[3rem]">
                    {user.conversationsCount}
                  </Button>
                </td>
                <td className="px-4 py-3 text-right">
                   <Button variant="outline" size="sm" onClick={() => router.push(`/profile/${user.username}`)} className="text-xs">
                     View
                   </Button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activeUser && activeView && (
        <AdminNestedViews 
          user={activeUser}
          view={activeView}
          onClose={() => {
            setActiveUser(null);
            setActiveView(null);
          }}
        />
      )}
    </>
  );
}
