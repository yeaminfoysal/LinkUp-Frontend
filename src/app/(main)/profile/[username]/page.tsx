'use client';

import React, { use, useState } from 'react';
import useProfile from '../../../../modules/profile/hooks/useProfile';
import ProfileHeader from '../../../../modules/profile/components/ProfileHeader';
import PostCard from '../../../../modules/feed/components/PostCard';
import Avatar from '../../../../components/shared/Avatar';
import Tabs from '../../../../components/ui/Tabs';
import EmptyState from '../../../../components/shared/EmptyState';
import { useAuthStore } from '../../../../store/auth.store';
import { Newspaper, ImageIcon, Users, Bookmark, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../services/api';
import { Friendship } from '../../../../types/user.types';
import { Post } from '../../../../types/post.types';
import Link from 'next/link';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const {
    profile,
    isLoadingProfile,
    isErrorProfile,
    posts,
    isLoadingPosts,
    updateProfile,
  } = useProfile(username);

  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('posts');

  // Fetch target user's friends list
  const { data: userFriends = [], isLoading: isLoadingUserFriends } = useQuery<Friendship[]>({
    queryKey: ['userFriends', profile?.id],
    queryFn: async () => {
      // Mock friend list fetch or real query
      const res = await api.get('/friends');
      return res.data;
    },
    enabled: activeTab === 'friends' && !!profile?.id,
  });

  // Fetch saved/bookmarked posts (own profile only)
  const { data: savedData, isLoading: isLoadingSaved } = useQuery<any>({
    queryKey: ['savedPosts'],
    queryFn: async () => {
      // Mock bookmarks fetch or API call
      // In LinkUp API, we can fetch own bookmarked posts
      const res = await api.get('/posts/feed?limit=5');
      return res.data;
    },
    enabled: activeTab === 'saved' && !!profile?.id && profile.id === currentUser?.id,
  });

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        <span className="text-sm text-zinc-500">Loading user profile...</span>
      </div>
    );
  }

  if (isErrorProfile || !profile) {
    return (
      <EmptyState
        icon={<Newspaper className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
        title="User not found"
        description="We couldn't locate a LinkUp profile matching this username. Double check the address."
      />
    );
  }

  const isSelf = profile.id === currentUser?.id;

  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'media', label: 'Media' },
    { id: 'friends', label: 'Friends' },
    ...(isSelf ? [{ id: 'saved', label: 'Saved' }] : []),
  ];

  // Filter posts having media files
  const mediaPosts = posts.filter((p: Post) => p.mediaUrls && p.mediaUrls.length > 0);
  const mediaUrls = mediaPosts.flatMap((p: Post) => p.mediaUrls);

  // Saved bookmarked posts list
  const savedPosts = savedData?.items || [];

  const handleUpdateProfile = async (data: { name: string; bio: string; avatar: string }) => {
    return updateProfile(data);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader profile={profile} onUpdate={handleUpdateProfile} />

      {/* Tabs Menu */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* 1. Posts stream */}
      {activeTab === 'posts' && (
        isLoadingPosts ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Newspaper className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
            title="No posts yet"
            description={isSelf ? 'Share your thoughts, photos or links with your network.' : `@{profile.username} has not posted yet.`}
          />
        )
      )}

      {/* 2. Media Photos Grid */}
      {activeTab === 'media' && (
        mediaUrls.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {mediaUrls.map((url: string, i: number) => (
              <div
                key={i}
                className="aspect-square relative rounded-xl overflow-hidden bg-zinc-150 dark:bg-zinc-900 border border-zinc-200/10 shadow-sm"
              >
                <img src={url} alt="Shared attachment" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ImageIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
            title="No shared media"
            description="Photos shared in posts will be visible in this gallery."
          />
        )
      )}

      {/* 3. Friends List */}
      {activeTab === 'friends' && (
        isLoadingUserFriends ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : userFriends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userFriends.map((f) => (
              <div
                key={f.friendshipId}
                className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 transition-colors"
              >
                <Avatar src={f.friend.avatar} name={f.friend.name} size="sm" isOnline={f.friend.isOnline} />
                <div className="min-w-0 flex-1">
                  <Link href={`/profile/${f.friend.username}`} className="hover:underline">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{f.friend.name}</p>
                  </Link>
                  <p className="text-[10px] text-zinc-500">@{f.friend.username}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
            title="No friends found"
            description="When users link up, they will appear in this directory."
          />
        )
      )}

      {/* 4. Bookmarked Saved Posts (Only own profile) */}
      {activeTab === 'saved' && isSelf && (
        isLoadingSaved ? (
          <div className="space-y-4">
            <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          </div>
        ) : savedPosts.length > 0 ? (
          <div className="space-y-6">
            {savedPosts.map((post: any) => (
              <PostCard key={post.id} post={{ ...post, hasSaved: true }} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bookmark className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
            title="No bookmarked posts"
            description="Bookmarked posts will show up in this private folder."
          />
        )
      )}
    </div>
  );
}
