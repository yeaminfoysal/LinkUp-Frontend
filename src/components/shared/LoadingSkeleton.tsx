import React from 'react';
import Skeleton from '../ui/Skeleton';

export const PostCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 animate-shimmer">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-10 h-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="rect" className="h-4 w-1/4" />
          <Skeleton variant="rect" className="h-3 w-1/6" />
        </div>
      </div>
      {/* Content */}
      <div className="space-y-2">
        <Skeleton variant="rect" className="h-4 w-full" />
        <Skeleton variant="rect" className="h-4 w-5/6" />
        <Skeleton variant="rect" className="h-4 w-2/3" />
      </div>
      {/* Media placeholder optional */}
      <Skeleton variant="rect" className="h-48 w-full" />
      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Skeleton variant="rect" className="h-8 w-16" />
        <Skeleton variant="rect" className="h-8 w-16" />
        <Skeleton variant="rect" className="h-8 w-16" />
      </div>
    </div>
  );
};

export const ConversationSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100/50 dark:border-zinc-800/20 bg-white/20 dark:bg-zinc-900/10 animate-shimmer">
      <Skeleton variant="circle" className="w-12 h-12" />
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <Skeleton variant="rect" className="h-4 w-1/3" />
          <Skeleton variant="rect" className="h-3 w-12" />
        </div>
        <Skeleton variant="rect" className="h-3.5 w-3/4" />
      </div>
    </div>
  );
};

export const MessageSkeleton: React.FC<{ isOwn?: boolean }> = ({ isOwn = false }) => {
  return (
    <div className={`flex gap-3 max-w-sm ${isOwn ? 'ml-auto flex-row-reverse' : ''} animate-shimmer`}>
      {!isOwn && <Skeleton variant="circle" className="w-8 h-8 self-end" />}
      <div className={`space-y-1.5 ${isOwn ? 'items-end' : ''}`}>
        <Skeleton variant="rect" className={`h-10 w-48 ${isOwn ? 'bg-violet-600/30' : ''}`} />
        <Skeleton variant="rect" className="h-3 w-8" />
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-shimmer">
      {/* Cover / Avatar area */}
      <div className="relative">
        <Skeleton variant="rect" className="h-48 w-full" />
        <div className="absolute -bottom-10 left-6">
          <Skeleton variant="circle" className="w-24 h-24 border-4 border-white dark:border-zinc-950" />
        </div>
      </div>
      {/* Details */}
      <div className="pt-12 px-6 space-y-4">
        <div className="space-y-2">
          <Skeleton variant="rect" className="h-6 w-1/4" />
          <Skeleton variant="rect" className="h-4 w-1/6" />
        </div>
        <Skeleton variant="rect" className="h-4 w-2/3" />
        {/* Stats */}
        <div className="flex gap-4 pt-2">
          <Skeleton variant="rect" className="h-5 w-16" />
          <Skeleton variant="rect" className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
};

export const LoadingSkeleton: React.FC<{
  variant?: 'post' | 'conversation' | 'message' | 'profile';
  count?: number;
}> = ({ variant = 'post', count = 1 }) => {
  const skeletons = Array.from({ length: count });

  return (
    <div className="space-y-4 w-full">
      {skeletons.map((_, i) => {
        if (variant === 'conversation') return <ConversationSkeleton key={i} />;
        if (variant === 'message') return <MessageSkeleton key={i} isOwn={i % 2 === 0} />;
        if (variant === 'profile') return <ProfileSkeleton key={i} />;
        return <PostCardSkeleton key={i} />;
      })}
    </div>
  );
};

export default LoadingSkeleton;
