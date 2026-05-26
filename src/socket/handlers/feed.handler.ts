import { Socket } from 'socket.io-client';
import { queryClient } from '../../lib/queryClient';
import { SOCKET_EVENTS } from '../socket.events';

export const registerFeedHandlers = (socket: Socket) => {
  // Post liked notification
  socket.on(SOCKET_EVENTS.POST_LIKED, ({ postId }: { postId: string }) => {
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    queryClient.invalidateQueries({ queryKey: ['post', postId] });
  });

  // Post unliked
  socket.on(SOCKET_EVENTS.POST_UNLIKED, ({ postId }: { postId: string }) => {
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    queryClient.invalidateQueries({ queryKey: ['post', postId] });
  });

  // Post commented
  socket.on(SOCKET_EVENTS.POST_COMMENTED, ({ postId }: { postId: string }) => {
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    queryClient.invalidateQueries({ queryKey: ['post', postId] });
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
  });

  // Comment deleted
  socket.on(SOCKET_EVENTS.POST_COMMENT_DELETED, ({ postId }: { postId: string }) => {
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    queryClient.invalidateQueries({ queryKey: ['post', postId] });
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
  });
};
