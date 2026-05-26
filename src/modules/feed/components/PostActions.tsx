import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { Post } from '../../../types/post.types';

interface PostActionsProps {
  post: Post;
  hasLiked: boolean;
  hasSaved: boolean;
  likeCount: number;
  commentCount: number;
  onLikeToggle: () => void;
  onCommentToggle: () => void;
  onSaveToggle: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  post,
  hasLiked,
  hasSaved,
  likeCount,
  commentCount,
  onLikeToggle,
  onCommentToggle,
  onSaveToggle,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Counters Info */}
      <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 px-1 py-0.5">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500/10 text-red-500">
            <Heart className="w-2.5 h-2.5 fill-red-500" />
          </span>
          <span className="font-semibold">{likeCount} likes</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hover:underline cursor-pointer" onClick={onCommentToggle}>
            {commentCount} comments
          </span>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800/80 my-1" />

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        {/* Like */}
        <button
          onClick={onLikeToggle}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
            hasLiked
              ? 'text-red-500 bg-red-500/5 hover:bg-red-500/10'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
          Like
        </button>

        {/* Comment */}
        <button
          onClick={onCommentToggle}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-200 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          Comment
        </button>

        {/* Bookmark */}
        <button
          onClick={onSaveToggle}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
            hasSaved
              ? 'text-violet-500 bg-violet-500/5 hover:bg-violet-500/10'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${hasSaved ? 'fill-violet-500 text-violet-500' : ''}`} />
          Save
        </button>

        {/* Share (Mock) */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              navigator.clipboard.writeText(`${window.location.origin}/profile/${post.user.username}`);
              alert('Link copied to clipboard!');
            }
          }}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-200 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
};
export default PostActions;
