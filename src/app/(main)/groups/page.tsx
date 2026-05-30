'use client';

import React, { useState } from 'react';
import useChat from '../../../modules/chat/hooks/useChat';
import useFriends from '../../../modules/friends/hooks/useFriends';
import Avatar from '../../../components/shared/Avatar';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import EmptyState from '../../../components/shared/EmptyState';
import { Users2, Plus, ArrowRight, Loader2, Check } from 'lucide-react';
import toast from '../../../components/ui/Toast';
import { Conversation } from '../../../types/conversation.types';
import { Friendship } from '../../../types/user.types';
import { useRouter } from 'next/navigation';

export default function GroupsPage() {
  const { conversations, isLoading, createGroup } = useChat();
  const { friends } = useFriends();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groups = conversations.filter((c: Conversation) => c.type === 'GROUP');

  const toggleSelectMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.warning('Group name is required');
      return;
    }
    if (selectedMembers.length === 0) {
      toast.warning('Select at least one member');
      return;
    }

    try {
      setIsSubmitting(true);
      await createGroup({
        name: groupName.trim(),
        memberIds: selectedMembers,
      });
      setGroupName('');
      setSelectedMembers([]);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
            <Users2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Groups</h2>
            <p className="text-xs text-zinc-400">Join or host group channels with your contacts.</p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl font-semibold"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </Button>
      </div>

      {/* Group Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((g: Conversation) => (
            <div
              key={g.id}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 hover:bg-white dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar src={g.avatar} name={g.name || 'G'} size="md" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                    {g.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-medium">
                    {g.members.length} members
                  </p>
                </div>
              </div>

              <Button
                onClick={() => router.push(`/messages/${g.id}`)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs"
              >
                Open
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Users2 className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
          title="No groups found"
          description="Create a new group space to invite and chat with multiple friends simultaneously."
          action={{
            label: 'Create Group',
            onClick: () => setIsModalOpen(true),
          }}
        />
      )}

      {/* Create Group Dialog */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Group" size="md">
        <form onSubmit={handleCreateGroup} className="space-y-4">
          {/* Group Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/25 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm"
              placeholder="E.g., Project Workspace, Family Room"
              required
            />
          </div>

          {/* Members Selection List */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
              Add Members ({selectedMembers.length} selected)
            </label>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-zinc-250/20 dark:border-zinc-800 rounded-xl p-3 bg-zinc-50/50 dark:bg-black/10">
              {friends.length > 0 ? (
                friends.map((f: Friendship) => {
                  const isChecked = selectedMembers.includes(f.friend.id);
                  return (
                    <div
                      key={f.friendshipId}
                      onClick={() => toggleSelectMember(f.friend.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-violet-500/10'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar src={f.friend.avatar} name={f.friend.name} size="xs" />
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          {f.friend.name}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-violet-500 border-violet-500 text-white'
                          : 'border-zinc-300 dark:border-zinc-700'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-zinc-400 italic text-center py-4">Add some friends first to invite them.</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full py-3"
            disabled={!groupName.trim() || selectedMembers.length === 0}
          >
            Create Group
          </Button>
        </form>
      </Modal>
    </div>
  );
}
