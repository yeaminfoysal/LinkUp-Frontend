'use client';

import React, { useRef } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  inverse?: boolean; // Set to true for chat message upward infinite scrolls
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  inverse = false,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: '100px',
  });

  return (
    <div className="flex flex-col w-full">
      {inverse && (
        <div ref={sentinelRef} className="w-full flex items-center justify-center p-4">
          {isFetchingNextPage && <Loader2 className="w-5 h-5 animate-spin text-violet-500" />}
        </div>
      )}

      {children}

      {!inverse && (
        <div ref={sentinelRef} className="w-full flex items-center justify-center p-4">
          {isFetchingNextPage && <Loader2 className="w-5 h-5 animate-spin text-violet-500" />}
        </div>
      )}
    </div>
  );
};
export default InfiniteScroll;
