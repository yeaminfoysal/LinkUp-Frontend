'use client';

import React, { useState } from 'react';
import usePost from '../hooks/usePost';
import { Comment } from '../../../types/post.types';
import CommentItem from './CommentItem';
import Avatar from '../../../components/shared/Avatar';
import { useAuthStore } from '../../../store/auth.store';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import Skeleton from '../../../components/ui/Skeleton';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useAuthStore();
  const { comments, isLoadingComments, createComment, isCreatingComment, deleteComment } = usePost(postId);
  const [newCommentText, setNewCommentText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      await createComment({ content: newCommentText.trim() });
      setNewCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  return (
    <div className="pt-4 mt-2 space-y-4 border-t border-zinc-100 dark:border-zinc-800">
      {/* Write Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <Avatar src={user?.avatar} name={user?.name} size="sm" />
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full pl-4 pr-11 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim() || isCreatingComment}
            className="absolute right-2 text-violet-500 hover:text-violet-600 disabled:text-zinc-400 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {isCreatingComment ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {isLoadingComments ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton variant="circle" className="w-8 h-8" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="rect" className="h-4 w-1/4" />
                  <Skeleton variant="rect" className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment: Comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={(id) => deleteComment(id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-zinc-400 dark:text-zinc-600">
            <MessageSquare className="w-6 h-6 opacity-30 mb-2" />
            <p className="text-[11px] font-semibold">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CommentSection;
