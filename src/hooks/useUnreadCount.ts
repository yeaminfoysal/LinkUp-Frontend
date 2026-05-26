import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/auth.store';
import { Conversation } from '../types/conversation.types';
import { Notification } from '../types/notification.types';

export const useUnreadCount = () => {
  const { isAuthenticated } = useAuthStore();

  // Fetch conversations to sum unread messages
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get('/conversations');
      return res.data;
    },
    enabled: isAuthenticated,
  });

  // Fetch notifications to count unread alerts
  const { data: notificationsData } = useQuery<{ items?: Notification[] } | Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
    enabled: isAuthenticated,
  });

  // Calculate unread messages
  // (In direct/group members, count unread count)
  // Let's assume unread messages is calculated by count of messages whose reads do not contain current user
  const unreadMessagesCount = conversations.reduce((acc, conv) => {
    // If the conversation endpoint returns unreadCount directly on members, we would use it.
    // For now, let's look at conv.messages and check if the last message sender is not current user and unread
    // If we have an unread count badge, let's assume we sum up unread messages.
    // Let's sum up unread counts for simplicity
    const currentUserId = useAuthStore.getState().user?.id;
    const member = conv.members.find(m => m.userId === currentUserId);
    // Since backend may return unread count, let's check. If not, let's count 0
    return acc + (conv.messages?.[0]?.senderId !== currentUserId && !(conv.messages?.[0]?.reads?.some(r => r.userId === currentUserId)) ? 1 : 0);
  }, 0);

  // Calculate unread notifications
  const items = Array.isArray(notificationsData) ? notificationsData : notificationsData?.items || [];
  const unreadNotificationsCount = items.filter((n: Notification) => !n.isRead).length;

  return {
    unreadMessagesCount,
    unreadNotificationsCount,
  };
};
export default useUnreadCount;
