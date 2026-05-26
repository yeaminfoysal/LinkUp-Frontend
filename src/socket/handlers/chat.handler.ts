import { Socket } from 'socket.io-client';
import { queryClient } from '../../lib/queryClient';
import { useChatStore } from '../../store/chat.store';
import { SOCKET_EVENTS } from '../socket.events';
import { Message } from '../../types/message.types';

export const registerChatHandlers = (socket: Socket) => {
  // New Message Received
  socket.on(SOCKET_EVENTS.NEW_MESSAGE, ({ message }: { message: Message }) => {
    const { conversationId } = message;

    // Update messages history query cache instantly
    queryClient.setQueryData(['messages', conversationId], (old: any) => {
      if (!old) return old;
      // Prepend message to the first page of messages
      const pages = [...old.pages];
      if (pages.length > 0) {
        pages[0] = {
          ...pages[0],
          data: [message, ...pages[0].data],
        };
      }
      return { ...old, pages };
    });

    // Invalidate conversation query cache to update previews and ordering
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    queryClient.invalidateQueries({ queryKey: ['unreadCounts'] });
  });

  // Message Edited
  socket.on(SOCKET_EVENTS.MESSAGE_EDITED, ({ messageId, content, editedAt }: { messageId: string; content: string; editedAt: string }) => {
    const activeConvId = useChatStore.getState().activeConversationId;
    if (activeConvId) {
      queryClient.setQueryData(['messages', activeConvId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((msg: Message) =>
              msg.id === messageId ? { ...msg, content, editedAt } : msg
            ),
          })),
        };
      });
    }
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  });

  // Message Deleted
  socket.on(SOCKET_EVENTS.MESSAGE_DELETED, ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
    queryClient.setQueryData(['messages', conversationId], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((msg: Message) =>
            msg.id === messageId ? { ...msg, isDeleted: true, content: null, mediaUrl: null } : msg
          ),
        })),
      };
    });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  });

  // User Typing Status
  socket.on(SOCKET_EVENTS.USER_TYPING, ({ userId, conversationId }: { userId: string; conversationId: string }) => {
    useChatStore.getState().setTyping(conversationId, userId, true);
  });

  // User Stop Typing Status
  socket.on(SOCKET_EVENTS.USER_STOP_TYPING, ({ userId, conversationId }: { userId: string; conversationId: string }) => {
    useChatStore.getState().setTyping(conversationId, userId, false);
  });

  // Message Read Receipt
  socket.on(SOCKET_EVENTS.MESSAGE_READ, ({ messageId, readBy, readAt }: { messageId: string; readBy: string; readAt: string }) => {
    const activeConvId = useChatStore.getState().activeConversationId;
    if (activeConvId) {
      queryClient.setQueryData(['messages', activeConvId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((msg: Message) => {
              if (msg.id === messageId) {
                const currentReads = msg.reads || [];
                const alreadyRead = currentReads.some((r) => r.userId === readBy);
                return {
                  ...msg,
                  reads: alreadyRead ? currentReads : [...currentReads, { userId: readBy, readAt }],
                };
              }
              return msg;
            }),
          })),
        };
      });
    }
  });

  // Message Reaction Added
  socket.on(SOCKET_EVENTS.MESSAGE_REACTED, ({ messageId, userId, emoji }: { messageId: string; userId: string; emoji: string }) => {
    const activeConvId = useChatStore.getState().activeConversationId;
    if (activeConvId) {
      queryClient.setQueryData(['messages', activeConvId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((msg: Message) => {
              if (msg.id === messageId) {
                const reactions = msg.reactions || [];
                const filtered = reactions.filter((r) => r.userId !== userId);
                return {
                  ...msg,
                  reactions: [...filtered, { userId, emoji, createdAt: new Date().toISOString() }],
                };
              }
              return msg;
            }),
          })),
        };
      });
    }
  });

  // Message Reaction Removed
  socket.on(SOCKET_EVENTS.REACTION_REMOVED, ({ messageId, userId }: { messageId: string; userId: string }) => {
    const activeConvId = useChatStore.getState().activeConversationId;
    if (activeConvId) {
      queryClient.setQueryData(['messages', activeConvId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((msg: Message) => {
              if (msg.id === messageId) {
                const reactions = msg.reactions || [];
                return {
                  ...msg,
                  reactions: reactions.filter((r) => r.userId !== userId),
                };
              }
              return msg;
            }),
          })),
        };
      });
    }
  });

  // Conversation Management Changes
  socket.on(SOCKET_EVENTS.CONVERSATION_CREATED, () => {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  });

  socket.on(SOCKET_EVENTS.CONVERSATION_UPDATED, () => {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  });

  socket.on(SOCKET_EVENTS.CONVERSATION_LEFT, () => {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  });
};
