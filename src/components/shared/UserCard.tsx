'use client';

import React from 'react';
import Link from 'next/link';
import Avatar from './Avatar';
import Button from '../ui/Button';
import { User } from '../../types/user.types';
import { MessageSquare, UserCheck } from 'lucide-react';

interface UserCardProps {
  user: Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'bio' | 'isOnline'>;
  action?: React.ReactNode;
}

export const UserCard: React.FC<UserCardProps> = ({ user, action }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <Link href={`/profile/${user.username}`}>
          <Avatar
            src={user.avatar}
            name={user.name}
            isOnline={user.isOnline}
            size="md"
            className="hover:scale-105 transition-transform duration-200"
          />
        </Link>
        <div className="min-w-0">
          <Link href={`/profile/${user.username}`} className="hover:underline">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {user.name}
            </h4>
          </Link>
          <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
          {user.bio && (
            <p className="text-xs text-zinc-400 truncate mt-0.5 max-w-[200px] sm:max-w-xs">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {action ? (
          action
        ) : (
          <>
            <Link href={`/profile/${user.username}`}>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                Profile
              </Button>
            </Link>
            <Link href={`/messages`}>
              <Button variant="primary" size="sm" className="h-9 px-3">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default UserCard;
