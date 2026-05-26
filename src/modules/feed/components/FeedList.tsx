'use client';

import React from 'react';
import useFeed from '../hooks/useFeed';
import PostCard from './PostCard';
import InfiniteScroll from '../../../components/shared/InfiniteScroll';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import EmptyState from '../../../components/shared/EmptyState';
import { Newspaper } from 'lucide-react';

export const FeedList: React.FC = () => {
  const {
    posts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed();

  if (isLoading) {
    return <LoadingSkeleton variant="post" count={3} />;
  }

  if (isError) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-center text-sm font-semibold">
        Failed to fetch feed. Please refresh.
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<Newspaper className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
        title="No Feed Items Yet"
        description="Write a new post or add some friends to see what's happening around you."
      />
    );
  }

  return (
    <InfiniteScroll
      fetchNextPage={fetchNextPage}
      hasNextPage={!!hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    >
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </InfiniteScroll>
  );
};
export default FeedList;
