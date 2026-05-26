'use client';

import React, { useState, useRef, useEffect } from 'react';
import Avatar from '../../../components/shared/Avatar';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ReplyPreview from './ReplyPreview';
import useMessages from '../hooks/useMessages';
import useTyping from '../hooks/useTyping';
import { useAuthStore } from '../../../store/auth.store';
import { useChatStore } from '../../../store/chat.store';
import { useUIStore } from '../../../store/ui.store';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import { Conversation } from '../../../types/conversation.types';
import { Message } from '../../../types/message.types';
import { Info, ArrowLeft, Loader2, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface ChatWindowProps {
  conversationId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { typingUsers, onlineUserIds } = useChatStore();
  const { toggleRightPanel } = useUIStore();

  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Messages Query & Socket emitters
  const {
    messages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    removeReaction,
    markAsRead,
  } = useMessages(conversationId);

  // Typing emitter hooks
  const { handleKeyPress, stopTypingNow } = useTyping(conversationId);

  // Fetch Conversation metadata (members name/avatar)
  const { data: conversation } = useQuery<Conversation>({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const res = await api.get(`/conversations/${conversationId}`);
      return res.data;
    },
    enabled: !!conversationId,
  });

  // Scroll to bottom on initial load and new messages
  useEffect(() => {
    if (messageEndRef.current && !isFetchingNextPage) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isFetchingNextPage]);

  // Infinite upward scroll handler (maintain scroll position)
  const previousHeightRef = useRef<number>(0);
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    if (el.scrollTop <= 50 && hasNextPage && !isFetchingNextPage) {
      previousHeightRef.current = el.scrollHeight;
      fetchNextPage();
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (previousHeightRef.current > 0 && !isFetchingNextPage) {
      // Restore scroll offset after loading older pages
      el.scrollTop = el.scrollHeight - previousHeightRef.current;
      previousHeightRef.current = 0;
    }
  }, [messages, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-2" />
        <span className="text-xs text-zinc-500">Loading conversation history...</span>
      </div>
    );
  }

  const isGroup = conversation?.type === 'GROUP';
  const partner = !isGroup
    ? conversation?.members.find((m) => m.userId !== currentUserId)
    : null;

  const displayName = isGroup ? conversation?.name || 'Group Chat' : partner?.user.name || 'User';
  const displayAvatar = isGroup ? conversation?.avatar : partner?.user.avatar;
  const isOnline = !isGroup && (partner?.user.isOnline || (partner && onlineUserIds.includes(partner.userId)));
  const partnerStatus = isGroup
    ? `${conversation?.members.length} members`
    : isOnline
    ? 'Active Now'
    : 'Offline';

  // Typing users list names
  const activeTypers = (typingUsers[conversationId] || [])
    .filter((uid) => uid !== currentUserId)
    .map((uid) => conversation?.members.find((m) => m.userId === uid)?.user.name || 'Someone');

  const handleSendMessage = (content: string, type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE', extra: Record<string, any> = {}) => {
    const payloadExtra = { ...extra };
    if (replyTarget) {
      payloadExtra.replyToId = replyTarget.id;
      setReplyTarget(null);
    }
    
    sendMessage(content, type, payloadExtra);
    stopTypingNow();
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-white dark:bg-zinc-950/40 border border-zinc-150 dark:border-zinc-800/40 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-150 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/messages" className="md:hidden text-zinc-400 hover:text-zinc-650 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Avatar src={displayAvatar} name={displayName} isOnline={!!isOnline} size="md" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{displayName}</h3>
            <p className="text-[10px] text-zinc-400 font-semibold">{partnerStatus}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Quick Call Icon (Mocked) */}
          <button
            onClick={() => alert('Audio/Video calls coming soon!')}
            className="w-9 h-9 rounded-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors flex items-center justify-center cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>
          
          {/* Toggle details sidebar */}
          <button
            onClick={toggleRightPanel}
            className="w-9 h-9 rounded-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors flex items-center justify-center cursor-pointer"
          >
            <Info className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Messages Pane */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/20 dark:bg-black/5"
      >
        {isFetchingNextPage && (
          <div className="w-full flex justify-center py-2">
            <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
          </div>
        )}

        {messages.length > 0 ? (
          // Reverse order since query yields newest first, but visually we render oldest at the top
          [...messages].reverse().map((msg, index, arr) => {
            const nextMsg = arr[index + 1];
            // Show sender header if sender changes, or time separation is > 5 minutes
            const showHeader =
              !nextMsg ||
              nextMsg.senderId !== msg.senderId ||
              new Date(nextMsg.createdAt).getTime() - new Date(msg.createdAt).getTime() > 1000 * 60 * 5;

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                showSenderHeader={showHeader}
                onReply={(m) => setReplyTarget(m)}
                onEdit={(id, content) => editMessage(id, content)}
                onDelete={(id) => deleteMessage(id)}
                onReact={(id, emoji) => reactToMessage(id, emoji)}
                onRemoveReact={(id, emoji) => removeReaction(id, emoji)}
              />
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12 text-zinc-400 text-center gap-2">
            <MessageSquare className="w-10 h-10 opacity-20" />
            <p className="text-xs font-semibold">Say hello! No conversation history found.</p>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Footer input area */}
      <div className="p-3 border-t border-zinc-150 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md flex-shrink-0 space-y-2">
        {/* Active Typers indicator */}
        <TypingIndicator names={activeTypers} />

        {/* Reply targets overlay */}
        <ReplyPreview message={replyTarget} onClear={() => setReplyTarget(null)} />

        {/* Text Input Panel */}
        <MessageInput onSend={handleSendMessage} onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
};
export default ChatWindow;
