'use client';

import React from 'react';
import Avatar from '../../../components/shared/Avatar';
import Button from '../../../components/ui/Button';
import Link from 'next/link';
import { MessageSquare, UserMinus, ShieldAlert } from 'lucide-react';
import { Friendship } from '../../../types/user.types';

interface FriendCardProps {
  friendship: Friendship;
  onRemove: (id: string) => void;
  onBlock: (id: string) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({ friendship, onRemove, onBlock }) => {
  const { friend, since } = friendship;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', year: 'numeric' });
  };

  return (
    <div className="rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col items-center text-center shadow-sm relative group overflow-hidden">
      {/* Mini top banner color */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-violet-500/10 to-indigo-500/10" />

      <Link href={`/profile/${friend.username}`} className="relative mt-3">
        <Avatar
          src={friend.avatar}
          name={friend.name}
          isOnline={friend.isOnline}
          size="lg"
          className="border-2 border-white dark:border-zinc-950 shadow-md group-hover:scale-105 transition-transform"
        />
      </Link>

      <div className="mt-3 w-full min-w-0">
        <Link href={`/profile/${friend.username}`} className="hover:underline">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {friend.name}
          </h4>
        </Link>
        <p className="text-xs text-zinc-400">@{friend.username}</p>
        <p className="text-[10px] text-zinc-500 mt-2">Friends since {formatDate(since)}</p>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
        <Link href={`/messages`}>
          <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1.5 h-9">
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </Button>
        </Link>
        <Button
          onClick={() => onRemove(friendship.friendshipId)}
          variant="ghost"
          size="sm"
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-500/10 flex items-center justify-center gap-1.5 h-9"
        >
          <UserMinus className="w-3.5 h-3.5" />
          Remove
        </Button>
      </div>
    </div>
  );
};
export default FriendCard;
