'use client';

import React, { useState } from 'react';
import { Globe, Users, Lock, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Avatar from '../../../components/shared/Avatar';
import PostActions from './PostActions';
import CommentSection from '../../posts/components/CommentSection';
import MediaViewer from '../../../components/shared/MediaViewer';
import { Post } from '../../../types/post.types';
import { useAuthStore } from '../../../store/auth.store';
import { useFeed } from '../hooks/useFeed';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import feedService from '../services/feed.service';
import Dropdown, { DropdownItem } from '../../../components/ui/Dropdown';
import toast from '../../../components/ui/Toast';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { likePost, unlikePost, savePost, unsavePost } = useFeed();
  const queryClient = useQueryClient();
  
  const [showComments, setShowComments] = useState(false);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);

  const isOwner = post.userId === currentUserId;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getVisibilityIcon = (vis: string) => {
    if (vis === 'FRIENDS') return <span title="Friends Only"><Users className="w-3 h-3" /></span>;
    if (vis === 'PRIVATE') return <span title="Only Me"><Lock className="w-3 h-3" /></span>;
    return <span title="Public"><Globe className="w-3 h-3" /></span>;
  };

  const handleLikeToggle = () => {
    if (post.hasLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleSaveToggle = () => {
    if (post.hasSaved) {
      unsavePost(post.id);
    } else {
      savePost(post.id);
    }
  };

  // Delete Post Mutation
  const deletePostMutation = useMutation({
    mutationFn: feedService.deletePost,
    onSuccess: () => {
      toast.success('Post deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    },
  });

  // Media Grid renderer depending on items count
  const renderMedia = (urls: string[]) => {
    if (urls.length === 0) return null;

    if (urls.length === 1) {
      return (
        <div
          onClick={() => setActiveMediaUrl(urls[0])}
          className="rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-900 cursor-zoom-in max-h-96"
        >
          <img src={urls[0]} alt="Post attachment" className="w-full h-full object-cover max-h-96 hover:scale-[1.01] transition-transform duration-300" />
        </div>
      );
    }

    if (urls.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden border border-zinc-150 dark:border-zinc-900 cursor-zoom-in">
          {urls.map((url, i) => (
            <div key={i} onClick={() => setActiveMediaUrl(url)} className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <img src={url} alt="Attachment" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden border border-zinc-150 dark:border-zinc-900 cursor-zoom-in">
        {urls.slice(0, 3).map((url, i) => (
          <div
            key={i}
            onClick={() => setActiveMediaUrl(url)}
            className={`aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${
              urls.length > 3 && i === 2 ? 'filter brightness-50' : ''
            }`}
          >
            <img src={url} alt="Attachment" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
            {urls.length > 3 && i === 2 && (
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg select-none">
                +{urls.length - 3}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.user.username}`}>
            <Avatar src={post.user.avatar} name={post.user.name} size="md" className="hover:scale-105 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href={`/profile/${post.user.username}`} className="hover:underline">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{post.user.name}</span>
              </Link>
              <span className="text-xs text-zinc-500">@{post.user.username}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              {getVisibilityIcon(post.visibility)}
            </div>
          </div>
        </div>

        {/* Header menu (Delete post if owner) */}
        {isOwner && (
          <Dropdown
            trigger={
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-150 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            }
            align="right"
          >
            <DropdownItem
              onClick={() => deletePostMutation.mutate(post.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50/50"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              Delete Post
            </DropdownItem>
          </Dropdown>
        )}
      </div>

      {/* Content Text */}
      {post.content && (
        <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed mb-4 whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Media Attachments */}
      {post.mediaUrls.length > 0 && (
        <div className="mb-4">
          {renderMedia(post.mediaUrls)}
        </div>
      )}

      {/* Actions (Like/Comment/Save/Share) */}
      <PostActions
        post={post}
        hasLiked={!!post.hasLiked}
        hasSaved={!!post.hasSaved}
        likeCount={post._count?.likes || 0}
        commentCount={post._count?.comments || 0}
        onLikeToggle={handleLikeToggle}
        onCommentToggle={() => setShowComments(!showComments)}
        onSaveToggle={handleSaveToggle}
      />

      {/* Comments section toggleable drawer */}
      {showComments && (
        <CommentSection postId={post.id} />
      )}

      {/* Dynamic Image Overlay Modal */}
      <MediaViewer
        isOpen={!!activeMediaUrl}
        onClose={() => setActiveMediaUrl(null)}
        mediaUrl={activeMediaUrl}
      />
    </div>
  );
};
export default PostCard;
