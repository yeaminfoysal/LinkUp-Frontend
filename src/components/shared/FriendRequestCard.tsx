'use client';

import React from 'react';
import Avatar from './Avatar';
import Button from '../ui/Button';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { FriendRequest } from '../../types/user.types';

interface FriendRequestCardProps {
  request: FriendRequest;
  type: 'incoming' | 'outgoing';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
}) => {
  const isIncoming = type === 'incoming';
  const person = isIncoming ? request.sender : request.receiver;

  if (!person) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col items-center text-center shadow-sm relative group overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-violet-500/5 to-indigo-500/5" />

      <Link href={`/profile/${person.username}`} className="relative mt-2">
        <Avatar src={person.avatar} name={person.name} size="md" className="border-2 border-white dark:border-zinc-950 shadow-sm" />
      </Link>

      <div className="mt-3 w-full min-w-0">
        <Link href={`/profile/${person.username}`} className="hover:underline">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {person.name}
          </h4>
        </Link>
        <p className="text-[10px] text-zinc-400">@{person.username}</p>
        <p className="text-[9px] text-zinc-500 mt-2">Requested {formatDate(request.createdAt)}</p>
      </div>

      {/* Action buttons */}
      <div className="mt-4 w-full">
        {isIncoming ? (
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => onAccept?.(request.id)}
              variant="primary"
              size="sm"
              className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 text-[11px] h-8.5 font-bold cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Accept
            </Button>
            <Button
              onClick={() => onReject?.(request.id)}
              variant="outline"
              size="sm"
              className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 text-[11px] h-8.5 font-bold cursor-pointer text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
              Decline
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => onCancel?.(request.id)}
            variant="ghost"
            size="sm"
            className="w-full py-1.5 rounded-lg flex items-center justify-center gap-1 text-[11px] h-8.5 font-bold text-zinc-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Cancel Request
          </Button>
        )}
      </div>
    </div>
  );
};
export default FriendRequestCard;
