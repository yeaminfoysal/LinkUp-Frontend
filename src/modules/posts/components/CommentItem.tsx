'use client';

import React from 'react';
import Avatar from '../../../components/shared/Avatar';
import Link from 'next/link';
import { useAuthStore } from '../../../store/auth.store';
import { Comment } from '../../../types/post.types';
import { Trash2 } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isOwner = comment.userId === currentUserId;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex gap-3 group items-start animate-slide-up">
      <Link href={`/profile/${comment.user.username}`} className="flex-shrink-0">
        <Avatar src={comment.user.avatar} name={comment.user.name} size="sm" />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/40 p-3.5 rounded-2xl relative">
          <div className="flex justify-between items-start gap-2 mb-1">
            <div>
              <Link href={`/profile/${comment.user.username}`} className="hover:underline">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  {comment.user.name}
                </span>
              </Link>
              <span className="text-[10px] text-zinc-500">@{comment.user.username}</span>
            </div>
            <span className="text-[9px] text-zinc-400 font-medium">{formatDate(comment.createdAt)}</span>
          </div>

          <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed pr-6 whitespace-pre-wrap">
            {comment.content}
          </p>

          {isOwner && (
            <button
              onClick={() => onDelete(comment.id)}
              className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Delete Comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommentItem;
