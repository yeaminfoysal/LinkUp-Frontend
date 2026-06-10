import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Modal from '../../../components/ui/Modal';
import Avatar from '../../../components/shared/Avatar';
import { adminService } from '../services/admin.service';

interface AdminNestedViewsProps {
  user: any;
  view: 'friends' | 'pendingRequests' | 'conversations';
  onClose: () => void;
}

export default function AdminNestedViews({ user, view, onClose }: AdminNestedViewsProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminUserView', user.id, view],
    queryFn: async () => {
      if (view === 'friends') return adminService.getUserFriends(user.id);
      if (view === 'pendingRequests') return adminService.getUserPendingRequests(user.id);
      if (view === 'conversations') return adminService.getUserConversations(user.id);
    },
    enabled: !!user.id && !!view,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['adminConversationMessages', activeConversationId],
    queryFn: () => adminService.getConversationMessages(activeConversationId!),
    enabled: !!activeConversationId,
  });

  let title = '';
  if (view === 'friends') title = `${user.name}'s Friends`;
  if (view === 'pendingRequests') title = `${user.name}'s Pending Sent Requests`;
  if (view === 'conversations') title = `${user.name}'s Conversations`;

  return (
    <Modal isOpen={true} onClose={onClose} title={title}>
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="p-4 text-center text-zinc-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            {view === 'friends' && data?.map((friend: any) => (
              <div key={friend.friendshipId} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <Avatar src={friend.avatar} name={friend.name} size="md" />
                <div>
                  <p className="font-semibold text-sm">{friend.name}</p>
                  <p className="text-xs text-zinc-500">@{friend.username}</p>
                </div>
              </div>
            ))}

            {view === 'pendingRequests' && data?.map((req: any) => (
              <div key={req.id} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <Avatar src={req.receiver.avatar} name={req.receiver.name} size="md" />
                <div>
                  <p className="font-semibold text-sm">Sent to: {req.receiver.name}</p>
                  <p className="text-xs text-zinc-500">@{req.receiver.username}</p>
                </div>
              </div>
            ))}

            {view === 'conversations' && !activeConversationId && data?.map((conv: any) => (
              <div 
                key={conv.id} 
                className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => setActiveConversationId(conv.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                    {conv.type === 'GROUP' ? 'G' : 'D'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {conv.type === 'GROUP' ? conv.name : conv.members.filter((m: any) => m.user.id !== user.id).map((m: any) => m.user.name).join(', ')}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{conv.lastMessage?.content || 'No messages'}</p>
                  </div>
                </div>
              </div>
            ))}

            {activeConversationId && (
              <div className="space-y-4">
                <button 
                  onClick={() => setActiveConversationId(null)}
                  className="text-xs text-violet-500 hover:underline mb-2 block"
                >
                  &larr; Back to Conversations
                </button>
                {isLoadingMessages ? (
                  <div className="text-center text-xs text-zinc-500">Loading messages...</div>
                ) : (
                  <div className="space-y-3 flex flex-col-reverse">
                    {messages?.map((msg: any) => (
                      <div key={msg.id} className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar src={msg.sender.avatar} name={msg.sender.name} size="sm" />
                          <span className="text-xs font-bold">{msg.sender.name}</span>
                          <span className="text-[10px] text-zinc-500">{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {data?.length === 0 && <p className="text-center text-sm text-zinc-500 py-4">No data found.</p>}
          </div>
        )}
      </div>
    </Modal>
  );
}
