'use client';

import React, { useState } from 'react';
import FeedList from '../../../modules/feed/components/FeedList';
import FeedTabs from '../../../modules/feed/components/FeedTabs';
import CreatePostModal from '../../../modules/feed/components/CreatePostModal';
import Avatar from '../../../components/shared/Avatar';
import { useAuthStore } from '../../../store/auth.store';
import { Image as ImageIcon, Video, Calendar } from 'lucide-react';

export default function FeedPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('for-you');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Creation Header Card */}
      {user && (
        <div className="rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-3 px-4 bg-zinc-100/60 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200/20 dark:border-zinc-800/40 rounded-xl text-sm text-zinc-400 dark:text-zinc-500 font-medium cursor-pointer transition-colors"
            >
              What&apos;s on your mind, {user.name.split(' ')[0]}?
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3" />

          {/* Quick upload mockup buttons */}
          <div className="flex items-center justify-around text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4.5 h-4.5 text-green-500" />
              Photo
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer"
            >
              <Video className="w-4.5 h-4.5 text-red-500" />
              Video
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer"
            >
              <Calendar className="w-4.5 h-4.5 text-amber-500" />
              Event
            </button>
          </div>
        </div>
      )}

      {/* Tabs Filter */}
      <FeedTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Feed Stream */}
      <FeedList />

      {/* Write Post Dialog */}
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
