import { Socket } from 'socket.io-client';
import { useChatStore } from '../../store/chat.store';
import { SOCKET_EVENTS } from '../socket.events';

export const registerPresenceHandlers = (socket: Socket) => {
  // User online event
  socket.on(SOCKET_EVENTS.USER_ONLINE, ({ userId }: { userId: string }) => {
    useChatStore.getState().setOnline(userId, true);
  });

  // User offline event
  socket.on(SOCKET_EVENTS.USER_OFFLINE, ({ userId }: { userId: string }) => {
    useChatStore.getState().setOnline(userId, false);
  });

  // Presence list updated
  socket.on(SOCKET_EVENTS.PRESENCE_UPDATED, ({ onlineUserIds }: { onlineUserIds: string[] }) => {
    useChatStore.getState().setOnlineUsers(onlineUserIds);
  });
};
