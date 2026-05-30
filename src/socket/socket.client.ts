import { io, Socket } from 'socket.io-client';
import { useSocketStore } from '../store/socket.store';
import { registerChatHandlers } from './handlers/chat.handler';
import { registerPresenceHandlers } from './handlers/presence.handler';
import { registerNotificationHandlers } from './handlers/notification.handler';
import { registerFeedHandlers } from './handlers/feed.handler';
import { registerFriendHandlers } from './handlers/friend.handler';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const connectSocket = (accessToken: string) => {
  const { socket: existingSocket, setSocket, setConnected } = useSocketStore.getState();

  // If already connected, do not re-establish
  if (existingSocket?.connected) {
    return existingSocket;
  }

  // If a socket exists but is disconnected, clean it up
  if (existingSocket) {
    existingSocket.disconnect();
  }

  const socket: Socket = io(SOCKET_URL, {
    auth: {
      token: accessToken,
    },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    setConnected(true);
    console.log('Successfully connected to LinkUp WebSocket server');
  });

  socket.on('disconnect', (reason) => {
    setConnected(false);
    console.log('Disconnected from LinkUp WebSocket server:', reason);
  });

  socket.on('connect_error', (error) => {
    setConnected(false);
    console.error('LinkUp WebSocket connection error:', error);
  });

  // Register Handlers
  registerChatHandlers(socket);
  registerPresenceHandlers(socket);
  registerNotificationHandlers(socket);
  registerFeedHandlers(socket);
  registerFriendHandlers(socket);

  setSocket(socket);
  return socket;
};

export const disconnectSocket = () => {
  const { socket, setSocket, setConnected } = useSocketStore.getState();
  if (socket) {
    socket.disconnect();
    setSocket(null);
    setConnected(false);
    console.log('Disconnected LinkUp socket manually');
  }
};
export default connectSocket;
