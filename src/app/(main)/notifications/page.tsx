'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import Avatar from '../../../components/shared/Avatar';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/shared/EmptyState';
import { Bell, CheckCheck, MessageSquare, Heart, MessageCircle, UserPlus, Loader2 } from 'lucide-react';
import toast from '../../../components/ui/Toast';
import Link from 'next/link';
import { Notification } from '../../../types/notification.types';

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  // Fetch Notifications
  const { data: notificationsData, isLoading } = useQuery<any>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
  });

  const notifications: Notification[] = Array.isArray(notificationsData)
    ? notificationsData
    : notificationsData?.items || [];

  // Mark all as read mutation
  const readAllMutation = useMutation({
    mutationFn: async () => {
      return api.patch('/notifications/read-all', {});
    },
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCounts'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to mark read');
    },
  });

  // Individual Mark as read
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCounts'] });
    },
  });

  const getNotifIcon = (type: string) => {
    const classes = 'w-4 h-4 text-white';
    if (type === 'NEW_MESSAGE') {
      return (
        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-sm shadow-blue-500/20">
          <MessageSquare className={classes} />
        </div>
      );
    }
    if (type === 'POST_LIKED') {
      return (
        <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-sm shadow-red-500/20">
          <Heart className={classes + ' fill-white'} />
        </div>
      );
    }
    if (type === 'POST_COMMENTED') {
      return (
        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-sm shadow-green-500/20">
          <MessageCircle className={classes} />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center shadow-sm shadow-violet-500/20">
        <UserPlus className={classes} />
      </div>
    );
  };

  const getLinkUrl = (n: Notification) => {
    if (n.type === 'NEW_MESSAGE' && n.data?.conversationId) {
      return `/messages/${n.data.conversationId}`;
    }
    if ((n.type === 'POST_LIKED' || n.type === 'POST_COMMENTED') && n.data?.postId) {
      return `/feed`; // Or detailed post modal
    }
    return `/friends`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
            <Bell className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Notifications</h2>
            <p className="text-xs text-zinc-400">Stay up to date with activity and invitations.</p>
          </div>
        </div>

        {hasUnread && (
          <Button
            onClick={() => readAllMutation.mutate()}
            isLoading={readAllMutation.isPending}
            variant="outline"
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl border-zinc-200/60 dark:border-zinc-800"
          >
            <CheckCheck className="w-4 h-4 text-zinc-400" />
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const linkUrl = getLinkUrl(notif);
            return (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && markReadMutation.mutate(notif.id)}
                className={`flex items-start justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  notif.isRead
                    ? 'border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30'
                    : 'border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 shadow-sm shadow-violet-500/5'
                }`}
              >
                <Link href={linkUrl} className="flex gap-3 flex-1 min-w-0">
                  <div className="relative">
                    {/* Placeholder avatar or icon */}
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs">
                      {notif.title.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1.5 -right-1">{getNotifIcon(notif.type)}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs ${notif.isRead ? 'text-zinc-700 dark:text-zinc-350' : 'text-zinc-900 dark:text-zinc-50 font-bold'}`}>
                      {notif.body}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-medium block mt-1">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                </Link>

                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-md shadow-violet-500/20 mt-1 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />}
          title="All caught up!"
          description="When new social updates arrive, they will appear in this feed."
        />
      )}
    </div>
  );
}
