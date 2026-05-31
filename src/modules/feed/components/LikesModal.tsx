'use client';

import React from 'react';
import Modal from '../../../components/ui/Modal';
import Avatar from '../../../components/shared/Avatar';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import { Loader2, Heart } from 'lucide-react';
import Link from 'next/link';

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export const LikesModal: React.FC<LikesModalProps> = ({ isOpen, onClose, postId }) => {
  // Fetch users who liked the post
  const { data: likedUsers = [], isLoading } = useQuery<any[]>({
    queryKey: ['postLikes', postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}/likes`);
      return res.data;
    },
    enabled: isOpen && !!postId,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Liked By" size="sm">
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 select-none">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
            <span className="text-xs">Loading likes...</span>
          </div>
        ) : likedUsers.length > 0 ? (
          <div className="space-y-3">
            {likedUsers.map((u: any) => (
              <div
                key={u.id}
                className="flex items-center gap-3 p-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100/50 dark:border-zinc-800/40 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/10 transition-colors"
              >
                <Link href={`/profile/${u.username}`} onClick={onClose} className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">@{u.username}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-zinc-400 dark:text-zinc-600">
            <Heart className="w-8 h-8 opacity-30 mb-2" />
            <p className="text-xs font-semibold">No likes yet</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LikesModal;
