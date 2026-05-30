'use client';

import React, { useState } from 'react';
import useChat from '../hooks/useChat';
import ConversationItem from './ConversationItem';
import { useChatStore } from '../../../store/chat.store';
import { Search, Plus, MessageSquare, Users } from 'lucide-react';
import Avatar from '../../../components/shared/Avatar';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import { Friendship } from '../../../types/user.types';
import { Conversation } from '../../../types/conversation.types';
import Button from '../../../components/ui/Button';
import { useRouter } from 'next/navigation';

export const ConversationList: React.FC = () => {
  const { conversations, isLoading, createDirectConversation } = useChat();
  const { activeConversationId, setActiveConversationId, onlineUserIds } = useChatStore();
  const router = useRouter();
  const [search, setSearch] = useState('');

  // Fetch friends list to show in active friends strip
  const { data: friendships = [] } = useQuery<Friendship[]>({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await api.get('/friends');
      return res.data;
    },
  });

  // Filter online friends
  const onlineFriends = friendships.filter((f) => {
    return f.friend.isOnline || onlineUserIds.includes(f.friend.id);
  });

  // Filter conversations
  const filteredConversations = conversations.filter((c: Conversation) => {
    if (!search.trim()) return true;
    const isGroup = c.type === 'GROUP';
    if (isGroup) {
      return c.name?.toLowerCase().includes(search.toLowerCase());
    } else {
      // Find partner name
      const partner = c.members.find((m) => m.userId !== m.user.id); // Or check members
      return c.members.some((m) => m.user.name.toLowerCase().includes(search.toLowerCase()));
    }
  });

  const handleOpenDirectChat = async (userId: string) => {
    try {
      await createDirectConversation(userId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-[320px] h-full border-r border-zinc-150 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md flex flex-col p-4 flex-shrink-0">
      {/* List Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-violet-500" />
          Chats
        </h2>
        <Link href="/friends">
          <button className="w-8 h-8 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 flex items-center justify-center transition-colors cursor-pointer" title="New Chat / Friends">
            <Plus className="w-4.5 h-4.5" />
          </button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/15 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Online Contacts strip */}
      {onlineFriends.length > 0 && (
        <div className="mb-4 space-y-2 select-none">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block px-1">
            Online Friends ({onlineFriends.length})
          </span>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
            {onlineFriends.map((f) => (
              <button
                key={f.friendshipId}
                onClick={() => handleOpenDirectChat(f.friend.id)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
                title={f.friend.name}
              >
                <Avatar
                  src={f.friend.avatar}
                  name={f.friend.name}
                  isOnline={true}
                  size="sm"
                  className="group-hover:scale-105 transition-transform duration-200"
                />
                <span className="text-[9px] text-zinc-500 truncate max-w-[48px]">
                  {f.friend.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversations Stream */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block px-1 mb-1">
          Recent Messages
        </span>
        {isLoading ? (
          <LoadingSkeleton variant="conversation" count={4} />
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((c: Conversation) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              isActive={activeConversationId === c.id}
              onClick={() => {
                setActiveConversationId(c.id);
                // In a responsive shell, route to conversation ID page
                router.push(`/messages/${c.id}`);
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400 text-center gap-2">
            <MessageSquare className="w-8 h-8 opacity-25" />
            <p className="text-xs font-semibold">No chats found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ConversationList;
