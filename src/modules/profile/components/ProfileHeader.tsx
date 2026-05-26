'use client';

import React, { useState } from 'react';
import Avatar from '../../../components/shared/Avatar';
import Button from '../../../components/ui/Button';
import EditProfileModal from './EditProfileModal';
import { useAuthStore } from '../../../store/auth.store';
import useFriends from '../../friends/hooks/useFriends';
import { useChatStore } from '../../../store/chat.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import chatService from '../../chat/services/chat.service';
import {
  MessageSquare,
  UserPlus,
  UserCheck,
  UserX,
  UserMinus,
  Edit2,
  Calendar,
  Grid,
  Heart
} from 'lucide-react';
import toast from '../../../components/ui/Toast';
import { Friendship, FriendRequest } from '../../../types/user.types';
import { useRouter } from 'next/navigation';

interface ProfileHeaderProps {
  profile: any;
  onUpdate: (data: { name: string; bio: string; avatar: string }) => Promise<any>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onUpdate }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const { onlineUserIds } = useChatStore();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    friends,
    pendingRequests,
    sentRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeFriend,
    blockUser,
  } = useFriends();

  // Create chat mutation
  const openChatMutation = useMutation({
    mutationFn: chatService.createDirectConversation,
    onSuccess: (data) => {
      useChatStore.getState().setActiveConversationId(data.id);
      router.push(`/messages/${data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to start conversation');
    },
  });

  const isSelf = profile.id === currentUser?.id;
  const isOnline = profile.isOnline || onlineUserIds.includes(profile.id);

  // Compute friendship relation state
  const friendship = friends.find((f: Friendship) => f.friend.id === profile.id);
  const isFriend = !!friendship;

  const incomingRequest = pendingRequests.find((r: FriendRequest) => r.senderId === profile.id);
  const isPendingRecv = !!incomingRequest;

  const outgoingRequest = sentRequests.find((r: FriendRequest) => r.receiverId === profile.id);
  const isPendingSent = !!outgoingRequest;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'long', year: 'numeric' });
  };

  const handleFriendAction = () => {
    if (isFriend) {
      if (confirm('Are you sure you want to remove this friend?')) {
        removeFriend(friendship.friendshipId);
      }
    } else if (isPendingSent) {
      cancelRequest(outgoingRequest.id);
    } else if (isPendingRecv) {
      acceptRequest(incomingRequest.id);
    } else {
      sendRequest(profile.id);
    }
  };

  const renderActionButton = () => {
    if (isSelf) {
      return (
        <Button
          onClick={() => setIsEditOpen(true)}
          variant="outline"
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl font-semibold border-zinc-200/60 dark:border-zinc-800"
        >
          <Edit2 className="w-4 h-4 text-zinc-400" />
          Edit Profile
        </Button>
      );
    }

    return (
      <div className="flex gap-2">
        {/* Friend Request Toggles */}
        {isPendingRecv ? (
          <>
            <Button
              onClick={() => acceptRequest(incomingRequest.id)}
              variant="primary"
              className="h-10 px-4 rounded-xl font-semibold text-xs"
            >
              Accept
            </Button>
            <Button
              onClick={() => rejectRequest(incomingRequest.id)}
              variant="outline"
              className="h-10 px-4 rounded-xl font-semibold text-xs border-zinc-200/60 dark:border-zinc-800"
            >
              Reject
            </Button>
          </>
        ) : (
          <Button
            onClick={handleFriendAction}
            variant={isFriend ? 'outline' : 'primary'}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl font-semibold"
          >
            {isFriend ? (
              <>
                <UserMinus className="w-4 h-4 text-zinc-400" />
                Unfriend
              </>
            ) : isPendingSent ? (
              <>
                <UserX className="w-4 h-4" />
                Cancel Request
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Add Friend
              </>
            )}
          </Button>
        )}

        {/* Message chat link */}
        <Button
          onClick={() => openChatMutation.mutate(profile.id)}
          isLoading={openChatMutation.isPending}
          variant="outline"
          className="flex items-center justify-center w-10 h-10 p-0 rounded-xl border-zinc-200/60 dark:border-zinc-800"
          title="Message user"
        >
          <MessageSquare className="w-4 h-4 text-zinc-400" />
        </Button>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden pb-6 mb-6">
      {/* 1. Cover Photo Gradient area */}
      <div className="h-44 bg-gradient-to-r from-violet-600/30 via-indigo-600/20 to-pink-500/10 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px]" />
      </div>

      {/* 2. Overlapping Avatar & details */}
      <div className="px-6 relative flex flex-col md:flex-row md:items-end justify-between -mt-10 mb-6 gap-4">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
          <Avatar
            src={profile.avatar}
            name={profile.name}
            isOnline={isOnline}
            size="xl"
            className="w-28 h-28 md:w-32 md:h-32 border-4 border-white dark:border-zinc-950 shadow-lg rounded-full"
          />
          <div className="pb-1">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center justify-center md:justify-start gap-1.5">
              {profile.name}
            </h2>
            <p className="text-xs text-zinc-400 font-semibold">@{profile.username}</p>
            {/* Join date */}
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-2 justify-center md:justify-start">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-end">{renderActionButton()}</div>
      </div>

      {/* 3. Bio text */}
      {profile.bio && (
        <div className="px-6 pb-6">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic max-w-2xl whitespace-pre-wrap">
            {profile.bio}
          </div>
        </div>
      )}

      {/* 4. Edit dialog */}
      {isSelf && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          profile={profile}
          onSave={onUpdate}
        />
      )}
    </div>
  );
};
export default ProfileHeader;
