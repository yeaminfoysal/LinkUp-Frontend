'use client';

import React from 'react';
import Avatar from '../../../components/shared/Avatar';
import { Conversation } from '../../../types/conversation.types';
import { useAuthStore } from '../../../store/auth.store';
import { useChatStore } from '../../../store/chat.store';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { onlineUserIds } = useChatStore();

  const isGroup = conversation.type === 'GROUP';
  const partner = !isGroup
    ? conversation.members.find((m) => m.userId !== currentUserId)
    : null;

  const displayName = isGroup ? conversation.name || 'Group Chat' : partner?.user.name || 'User';
  const displayAvatar = isGroup ? conversation.avatar : partner?.user.avatar;
  
  // Presence online check
  const isOnline = !isGroup && (partner?.user.isOnline || (partner && onlineUserIds.includes(partner.userId)));

  // Message preview logic
  const lastMessage = conversation.messages?.[0] || null;
  const lastMessagePreview = lastMessage
    ? lastMessage.isDeleted
      ? 'This message was deleted'
      : lastMessage.senderId === currentUserId
      ? `You: ${lastMessage.content || '[Media]'}`
      : `${lastMessage.content || '[Media]'}`
    : 'No messages yet';

  // Unread badge count
  // In the real app, we can calculate unread based on reads array or backend unread badge count
  const hasUnread = lastMessage && lastMessage.senderId !== currentUserId && !lastMessage.reads?.some((r) => r.userId === currentUserId);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-violet-500/10 dark:bg-violet-500/10 border border-violet-500/25'
          : 'hover:bg-zinc-100/60 dark:hover:bg-zinc-900/30 border border-transparent hover:border-zinc-200/20 dark:hover:border-zinc-800/10'
      }`}
    >
      <Avatar
        src={displayAvatar}
        name={displayName}
        isOnline={!!isOnline}
        size="md"
        className="flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2 mb-0.5">
          <h4 className={`text-sm truncate leading-tight font-bold ${
            hasUnread ? 'text-zinc-900 dark:text-zinc-50 font-extrabold' : 'text-zinc-700 dark:text-zinc-300'
          }`}>
            {displayName}
          </h4>
          <span className="text-[9px] text-zinc-400 font-medium">
            {formatDate(conversation.lastMessageAt || conversation.updatedAt)}
          </span>
        </div>

        <p className={`text-xs truncate leading-normal ${
          hasUnread
            ? 'text-zinc-900 dark:text-zinc-50 font-bold'
            : 'text-zinc-500 dark:text-zinc-400'
        }`}>
          {lastMessagePreview}
        </p>
      </div>

      {hasUnread && (
        <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-sm shadow-violet-500/30 flex-shrink-0" />
      )}
    </div>
  );
};
export default ConversationItem;
