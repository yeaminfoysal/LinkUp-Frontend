import { Socket } from 'socket.io-client';
import { queryClient } from '../../lib/queryClient';
import { SOCKET_EVENTS } from '../socket.events';
import toast from '../../components/ui/Toast';

export const registerFriendHandlers = (socket: Socket) => {
  // Received a friend request
  socket.on(SOCKET_EVENTS.FRIEND_REQUEST_RECEIVED, (data: { requestId: string; sender: any }) => {
    queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    toast.info(`New friend request from ${data.sender.name}!`);
  });

  // Friend request accepted
  socket.on(SOCKET_EVENTS.FRIEND_REQUEST_ACCEPTED, (data: { requestId: string; acceptedBy: any }) => {
    queryClient.invalidateQueries({ queryKey: ['friends'] });
    queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    toast.success(`${data.acceptedBy.name} accepted your friend request!`);
  });

  // Friend request rejected
  socket.on(SOCKET_EVENTS.FRIEND_REQUEST_REJECTED, () => {
    queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
  });

  // Friend request cancelled
  socket.on(SOCKET_EVENTS.FRIEND_REQUEST_CANCELLED, () => {
    queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
  });

  // Friend removed
  socket.on(SOCKET_EVENTS.FRIEND_REMOVED, () => {
    queryClient.invalidateQueries({ queryKey: ['friends'] });
  });
};

export default registerFriendHandlers;
