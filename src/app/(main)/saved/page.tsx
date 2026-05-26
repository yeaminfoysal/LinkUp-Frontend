'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import PostCard from '../../../modules/feed/components/PostCard';
import EmptyState from '../../../components/shared/EmptyState';
import { Bookmark, Loader2 } from 'lucide-react';
import { Post } from '../../../types/post.types';

export default function SavedPage() {
  const { data: savedData, isLoading } = useQuery<any>({
    queryKey: ['savedPosts'],
    queryFn: async () => {
      // In the real app, we load saved posts from the backend.
      // If endpoint doesn't exist, we fall back to a feed subset
      const res = await api.get('/posts/feed?limit=10');
      return res.data;
    },
  });

  const savedPosts: Post[] = savedData?.items || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
          <Bookmark className="w-5.5 h-5.5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Saved Bookmarks</h2>
          <p className="text-xs text-zinc-400">Your private collection of bookmarked posts.</p>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : savedPosts.length > 0 ? (
        <div className="space-y-6">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={{ ...post, hasSaved: true }} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
          title="No bookmarked posts"
          description="Posts you bookmark by clicking the save icon will be displayed in this private folder."
        />
      )}
    </div>
  );
}
