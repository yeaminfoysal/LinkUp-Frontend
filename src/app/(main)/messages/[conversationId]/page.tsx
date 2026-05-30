'use client';

import React, { use, useEffect } from 'react';
import ConversationList from '../../../../modules/chat/components/ConversationList';
import ChatWindow from '../../../../modules/chat/components/ChatWindow';
import { useChatStore } from '../../../../store/chat.store';

interface ConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const resolvedParams = use(params);
  const conversationId = resolvedParams.conversationId;
  const { setActiveConversationId } = useChatStore();

  useEffect(() => {
    if (conversationId) {
      setActiveConversationId(conversationId);
    }
    return () => {
      setActiveConversationId(null);
    };
  }, [conversationId, setActiveConversationId]);

  return (
    <div className="flex h-[calc(100vh-100px)] md:h-[calc(100vh-48px)] overflow-hidden border border-zinc-150 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-950">
      {/* Chats directory list panel (hidden on mobile when chat is open) */}
      <div className="hidden md:block">
        <ConversationList />
      </div>

      {/* Main Chat Stream Area */}
      <div className="flex-1 h-full min-w-0">
        <ChatWindow conversationId={conversationId} />
      </div>
    </div>
  );
}
