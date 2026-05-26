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
