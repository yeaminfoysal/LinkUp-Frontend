
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useFriends from '../../../modules/friends/hooks/useFriends';
import FriendCard from '../../../modules/friends/components/FriendCard';
import FriendRequestCard from '../../../modules/friends/components/FriendRequestCard';
import FriendTabs from '../../../modules/friends/components/FriendTabs';
import EmptyState from '../../../components/shared/EmptyState';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import UserCard from '../../../components/shared/UserCard';
import Button from '../../../components/ui/Button';
import { Users, UserCheck, Plus, UserPlus, Ban } from 'lucide-react';
import { Friendship, FriendRequest } from '../../../types/user.types';

export default function FriendsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  const {
    friends,
    pendingRequests,
    sentRequests,
    blockedUsers,
    isLoadingFriends,
    isLoadingPending,
    isLoadingSent,
    isLoadingBlocked,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeFriend,
    blockUser,
    unblockUser,
  } = useFriends();

  const isLoading =
    (activeTab === 'all' && isLoadingFriends) ||
    (activeTab === 'pending' && isLoadingPending) ||
    (activeTab === 'sent' && isLoadingSent) ||
    (activeTab === 'blocked' && isLoadingBlocked);

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
          <Users className="w-5.5 h-5.5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Friends Connection</h2>
          <p className="text-xs text-zinc-400">Manage your friendships, requests and connections.</p>
        </div>
      </div>

      {/* Tabs */}
      <FriendTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        pendingCount={pendingRequests.length}
      />

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-2xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3 mx-auto" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mx-auto" />
              <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ALL FRIENDS */}
          {activeTab === 'all' && (
            friends.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {friends.map((friendship: Friendship) => (
                  <FriendCard
                    key={friendship.friendshipId}
                    friendship={friendship}
                    onRemove={removeFriend}
                    onBlock={blockUser}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Users className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
                title="No friends yet"
                description="Browse smart matches or search for users to connect and start conversations."
                action={{
                  label: 'Find Friends',
                  onClick: () => router.push('/matches'),
                }}
              />
            )
          )}

          {/* INCOMING PENDING REQUESTS */}
          {activeTab === 'pending' && (
            pendingRequests.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {pendingRequests.map((req: FriendRequest) => (
                  <FriendRequestCard
                    key={req.id}
                    request={req}
                    type="incoming"
                    onAccept={acceptRequest}
                    onReject={rejectRequest}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<UserCheck className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
                title="No pending requests"
                description="When someone sends you a friend invitation, it will appear here."
              />
            )
          )}

          {/* OUTGOING SENT REQUESTS */}
          {activeTab === 'sent' && (
            sentRequests.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {sentRequests.map((req: FriendRequest) => (
                  <FriendRequestCard
                    key={req.id}
                    request={req}
                    type="outgoing"
                    onCancel={cancelRequest}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<UserPlus className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
                title="No outgoing requests"
                description="Any pending friend requests you send to others will be displayed here."
              />
            )
          )}

          {/* BLOCKED USERS */}
          {activeTab === 'blocked' && (
            blockedUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blockedUsers.map((blockedUser: any) => (
                  <UserCard
                    key={blockedUser.id}
                    user={blockedUser}
                    action={
                      <Button
                        onClick={() => unblockUser(blockedUser.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 h-8.5 rounded-lg py-1 px-3 text-xs border-red-500/20 hover:border-red-500 hover:bg-red-500/5 hover:text-red-650 dark:hover:text-red-400 text-red-500 cursor-pointer"
                      >
                        Unblock
                      </Button>
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Ban className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
                title="No blocked users"
                description="Any users you block will be displayed here, where you can unblock them at any time."
              />
            )
          )}
        </>
      )}
    </div>
  );
}
