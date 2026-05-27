'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useChatStore } from '../../store/chat.store';
import { useUIStore } from '../../store/ui.store';
import Avatar from './Avatar';
import Button from '../ui/Button';
import Link from 'next/link';
import { Users, Sparkles, MessageSquare, ShieldAlert, Image as ImageIcon, FileText } from 'lucide-react';
import { Friendship } from '../../types/user.types';
import ChatInfoPanel from '../../modules/chat/components/ChatInfoPanel';

export const RightPanel: React.FC = () => {
  const pathname = usePathname();
  const { onlineUserIds } = useChatStore();
  const { isRightPanelOpen } = useUIStore();

  // Route matches
  const isFeed = pathname === '/feed';
  const isProfile = pathname?.startsWith('/profile/');
  const isChat = pathname?.startsWith('/messages/');
  
  // Extract active ID for chat or profile
  const conversationId = isChat ? pathname.split('/').pop() : null;
  const username = isProfile ? pathname.split('/').pop() : null;

  // Don't render right panel if closed or on hidden paths
  const isHiddenRoute = pathname === '/friends' || pathname === '/notifications' || pathname === '/settings' || pathname === '/groups' || pathname === '/saved';
  const shouldRender = isRightPanelOpen && !isHiddenRoute;

  // Fetch friends list for Feed/Profile views
  const { data: friendships = [] } = useQuery<Friendship[]>({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await api.get('/friends');
      return res.data;
    },
    enabled: !!shouldRender && (isFeed || isProfile),
  });

  // Fetch suggestions (fetch users query as suggestions)
  const { data: suggestions = [] } = useQuery<any[]>({
    queryKey: ['suggestions'],
    queryFn: async () => {
      // Fetch some default users for suggestions
      const res = await api.get('/users/search?query=a&limit=4');
      return res.data;
    },
    enabled: !!shouldRender && isFeed,
  });

  if (!shouldRender) {
    return null;
  }

  // Filter online friends
  const onlineFriends = friendships.filter((f) => {
    const friendId = f.friend.id;
    return f.friend.isOnline || onlineUserIds.includes(friendId);
  });

  return (
    <aside className="w-[300px] h-full border-l border-zinc-150 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md flex flex-col p-4 flex-shrink-0 z-20 select-none overflow-y-auto hidden lg:flex">
      {/* 1. Feed View Right Panel */}
      {isFeed && (
        <div className="space-y-6">
          {/* Active Contacts */}
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-500" />
              Online Contacts ({onlineFriends.length})
            </h3>
            {onlineFriends.length > 0 ? (
              <div className="space-y-3">
                {onlineFriends.map((f) => (
                  <Link
                    key={f.friendshipId}
                    href={`/messages`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <Avatar src={f.friend.avatar} name={f.friend.name} size="sm" isOnline={true} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {f.friend.name}
                      </p>
                      <p className="text-[11px] text-green-500 font-semibold">Active Now</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic text-center py-4">No friends active now</p>
            )}
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              People You May Know
            </h3>
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((s: any) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40"
                  >
                    <Link href={`/profile/${s.username}`} className="flex items-center gap-2 min-w-0">
                      <Avatar src={s.avatar} name={s.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {s.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate">@{s.username}</p>
                      </div>
                    </Link>
                    <Link href={`/profile/${s.username}`}>
                      <Button variant="primary" size="sm" className="h-7 text-[10px] py-1 px-2.5 rounded-lg font-semibold">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic text-center py-4">No suggestions found</p>
            )}
          </div>
        </div>
      )}

      {/* 2. Chat Info Panel View */}
      {isChat && conversationId && (
        <ChatInfoPanel conversationId={conversationId} />
      )}

      {/* 3. Profile Right Panel */}
      {isProfile && username && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
              Mutual Friends
            </h3>
            {friendships.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {friendships.slice(0, 8).map((f) => (
                  <Link
                    key={f.friendshipId}
                    href={`/profile/${f.friend.username}`}
                    title={f.friend.name}
                    className="flex flex-col items-center gap-1"
                  >
                    <Avatar src={f.friend.avatar} name={f.friend.name} size="sm" />
                    <span className="text-[9px] text-zinc-500 truncate max-w-full">
                      {f.friend.name.split(' ')[0]}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic py-4">No mutual friends found</p>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-violet-500" />
              Shared Photos
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/10 flex items-center justify-center text-zinc-400"
                >
                  <ImageIcon className="w-4 h-4 opacity-30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
export default RightPanel;
