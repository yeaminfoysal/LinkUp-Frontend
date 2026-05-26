'use client';

import React from 'react';
import ConversationList from '../../../modules/chat/components/ConversationList';
import { MessageSquare } from 'lucide-react';

export default function MessagesIndexPage() {
  return (
    <div className="flex h-[calc(100vh-100px)] md:h-[calc(100vh-48px)] overflow-hidden border border-zinc-150 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-950">
      {/* Chats directory list panel */}
      <ConversationList />

      {/* Select conversation placeholder (hidden on mobile) */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-zinc-50/20 dark:bg-black/5 p-6 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 mb-4 border border-violet-500/15">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-1">Your Messages</h3>
        <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
          Select a chat from the directory list or add new friends to initiate a real-time conversation.
        </p>
      </div>
    </div>
  );
}
