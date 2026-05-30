'use client';

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { queryClient } from '../../lib/queryClient';
import { useAuthStore } from '../../store/auth.store';
import { connectSocket, disconnectSocket } from '../../socket/socket.client';
import { ToastContainer } from '../ui/Toast';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthHydration } from '../../hooks/useAuthHydration';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const { accessToken, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const isHydrated = useAuthHydration();

  // Socket connection manager
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connectSocket(accessToken);
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, accessToken]);

  // Auth Redirection Guard
  useEffect(() => {
    if (!isHydrated) return;

    const isAuthRoute = pathname?.startsWith('/auth');
    if (!isAuthenticated && !isAuthRoute && pathname !== '/') {
      router.replace('/auth/login');
    } else if (isAuthenticated && isAuthRoute) {
      router.replace('/feed');
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="linkup-theme">
        {children}
        <ToastContainer />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
export default Providers;
