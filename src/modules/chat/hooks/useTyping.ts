'use client';

import { useRef, useEffect } from 'react';
import { useSocketStore } from '../../../store/socket.store';
import { SOCKET_EVENTS } from '../../../socket/socket.events';

export const useTyping = (conversationId: string | null) => {
  const socket = useSocketStore((state) => state.socket);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyPress = () => {
    if (!socket || !conversationId) return;

    // If not already typing, emit start
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to emit stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
      }
    }, 2000);
  };

  const stopTypingNow = () => {
    if (!socket || !conversationId || !isTypingRef.current) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    isTypingRef.current = false;
    socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
  };

  return {
    handleKeyPress,
    stopTypingNow,
  };
};
export default useTyping;
