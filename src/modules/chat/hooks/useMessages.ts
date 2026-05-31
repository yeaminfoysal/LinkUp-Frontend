import { useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import chatService from '../services/chat.service';
import { useSocketStore } from '../../../store/socket.store';
import { useAuthStore } from '../../../store/auth.store';
import { SOCKET_EVENTS } from '../../../socket/socket.events';
import { Message } from '../../../types/message.types';

export const useMessages = (conversationId: string | null) => {
  const queryClient = useQueryClient();
  const socket = useSocketStore((state) => state.socket);

  // Upward infinite query for loading message history
  const messagesQuery = useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: async ({ pageParam }) => {
      console.log('useMessages queryFn: fetching messages for:', conversationId, 'pageParam:', pageParam);
      try {
        const data = await chatService.getMessages(conversationId!, pageParam as string | undefined);
        console.log('useMessages queryFn: fetch success, data length:', data?.data?.length);
        return data;
      } catch (err) {
        console.error('useMessages queryFn: fetch error:', err);
        throw err;
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    enabled: !!conversationId,
  });

  // Handle Socket Room Joining/Leaving
  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join room
    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });

    // Mark last message as read upon opening conversation
    const pages = queryClient.getQueryData<any>(['messages', conversationId])?.pages;
    const latestMessage = pages?.[0]?.data?.[0];
    if (latestMessage) {
      socket.emit(SOCKET_EVENTS.MARK_AS_READ, {
        conversationId,
        messageId: latestMessage.id,
      });
    }

    return () => {
      // Leave room
      socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
    };
  }, [socket, conversationId, queryClient]);

  // Send Message Method
  const sendMessage = (content: string, type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' = 'TEXT', extra: any = {}) => {
    if (!socket || !conversationId) return;

    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        conversationId,
        senderId: currentUser.id,
        content: type === 'TEXT' ? content : null,
        type,
        mediaUrl: extra.mediaUrl || null,
        mediaSize: extra.mediaSize || null,
        mediaType: extra.mimeType || null,
        replyToId: extra.replyToId || null,
        editedAt: null,
        isDeleted: false,
        deletedAt: null,
        deletedFor: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
      };

      queryClient.setQueryData(['messages', conversationId], (old: any) => {
        if (!old) return old;
        const pages = [...old.pages];
        if (pages.length > 0) {
          pages[0] = {
            ...pages[0],
            data: [optimisticMessage, ...pages[0].data],
          };
        }
        return { ...old, pages };
      });
    }

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      conversationId,
      content: type === 'TEXT' ? content : null,
      type,
      ...extra, // e.g. mediaUrl, mimeType, mediaSize, replyToId
    });
  };

  // Edit Message Method
  const editMessage = (messageId: string, content: string) => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.EDIT_MESSAGE, { messageId, content });
  };

  // Delete Message Method
  const deleteMessage = (messageId: string) => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, { messageId });
  };

  // React to Message Method
  const reactToMessage = (messageId: string, emoji: string) => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.REACT_TO_MESSAGE, { messageId, emoji });
  };

  // Remove Reaction Method
  const removeReaction = (messageId: string, emoji: string) => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.REMOVE_REACTION, { messageId, emoji });
  };

  // Mark Message as Read Method
  const markAsRead = (messageId: string) => {
    if (!socket || !conversationId) return;
    socket.emit(SOCKET_EVENTS.MARK_AS_READ, { conversationId, messageId });
  };

  return {
    // Queries
    messages: messagesQuery.data?.pages.flatMap((page) => page.data) || [],
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    fetchNextPage: messagesQuery.fetchNextPage,
    hasNextPage: messagesQuery.hasNextPage,
    isFetchingNextPage: messagesQuery.isFetchingNextPage,

    // Socket Actions
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    removeReaction,
    markAsRead,
  };
};
export default useMessages;
