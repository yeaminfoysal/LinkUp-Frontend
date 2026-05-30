import { Socket } from 'socket.io-client';
import { queryClient } from '../../lib/queryClient';
import { SOCKET_EVENTS } from '../socket.events';
import { Notification as AppNotification } from '../../types/notification.types';

export const registerNotificationHandlers = (socket: Socket) => {
  // Received a new notification
  socket.on(SOCKET_EVENTS.NOTIFICATION_RECEIVED, (notification: AppNotification) => {
    // Invalidate notifications query cache
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['unreadCounts'] });

    // Real-time invalidations based on notification type
    if (notification.type === 'NEW_MESSAGE') {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } else if (notification.type === 'FRIEND_REQUEST') {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    } else if (notification.type === 'FRIEND_ACCEPTED') {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    }

    // Display browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/favicon.ico',
        });
      }
    }
  });

  // Unread count updated
  socket.on(SOCKET_EVENTS.UNREAD_COUNT_UPDATED, () => {
    queryClient.invalidateQueries({ queryKey: ['unreadCounts'] });
  });
};
