'use client';

import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../../services/api';
import { queryClient } from '../../../lib/queryClient';
import Avatar from '../../../components/shared/Avatar';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/auth.store';
import { Conversation } from '../../../types/conversation.types';
import { Users, Image as ImageIcon, FileText, LogOut, Ban, Loader2 } from 'lucide-react';
import toast from '../../../components/ui/Toast';
import { useRouter } from 'next/navigation';

interface ChatInfoPanelProps {
  conversationId: string;
}

export const ChatInfoPanel: React.FC<ChatInfoPanelProps> = ({ conversationId }) => {
  const router = useRouter();
  const currentUserId = useAuthStore((state) => state.user?.id);

  // Fetch Conversation detail
  const { data: conversation, isLoading } = useQuery<Conversation>({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const res = await api.get(`/conversations/${conversationId}`);
      return res.data;
    },
    enabled: !!conversationId,
  });

  // Leave Group Mutation
  const leaveGroupMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/conversations/group/leave`, { conversationId });
    },
    onSuccess: () => {
      toast.success('You have left the group');
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      router.push('/messages');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to leave group');
    },
  });

  // Block User Mutation
  const blockUserMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      return api.post(`/friends/block`, { userId: targetUserId });
    },
    onSuccess: () => {
      toast.success('User blocked successfully');
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      router.push('/messages');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to block user');
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        <span className="text-xs text-zinc-500">Loading details...</span>
      </div>
    );
  }

  if (!conversation) {
    return <p className="text-xs text-zinc-400 italic text-center py-4">No conversation details</p>;
  }

  const isGroup = conversation.type === 'GROUP';
  
  // Find conversation partner details
  const partner = !isGroup
    ? conversation.members.find((m) => m.userId !== currentUserId)
    : null;

  const displayName = isGroup ? conversation.name : partner?.user.name;
  const displayAvatar = isGroup ? conversation.avatar : partner?.user.avatar;
  const displayStatus = isGroup ? `${conversation.members.length} members` : partner?.user.isOnline ? 'Online' : 'Offline';

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      {/* Header Info */}
      <div className="flex flex-col items-center text-center pb-4 border-b border-zinc-150 dark:border-zinc-800">
        <Avatar
          src={displayAvatar}
          name={displayName || 'G'}
          isOnline={!isGroup && partner?.user.isOnline}
          size="xl"
          className="mb-3 shadow-lg"
        />
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-full">
          {displayName}
        </h4>
        <span className="text-xs text-zinc-500">{displayStatus}</span>
      </div>

      {/* Sections */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        {/* Members List if Group */}
        {isGroup && (
          <div>
            <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-500" />
              Group Members ({conversation.members.length})
            </h5>
            <div className="space-y-2">
              {conversation.members.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <Avatar src={m.user.avatar} name={m.user.name} size="xs" isOnline={m.user.isOnline} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {m.user.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 capitalize">{m.role.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media / Files Grid */}
        <div>
          <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-violet-500" />
            Shared Media
          </h5>
          <div className="grid grid-cols-3 gap-2">
            {/* Mocked shared photos */}
            {Array.from({ length: 3 }).map((_, i) => (
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

      {/* Action Buttons */}
      <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 space-y-2">
        {isGroup ? (
          <Button
            onClick={() => leaveGroupMutation.mutate()}
            isLoading={leaveGroupMutation.isPending}
            variant="danger"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Leave Group
          </Button>
        ) : (
          partner && (
            <Button
              onClick={() => blockUserMutation.mutate(partner.userId)}
              isLoading={blockUserMutation.isPending}
              variant="danger"
              className="w-full flex items-center justify-center gap-2"
            >
              <Ban className="w-4 h-4" />
              Block User
            </Button>
          )
        )}
      </div>
    </div>
  );
};
export default ChatInfoPanel;
