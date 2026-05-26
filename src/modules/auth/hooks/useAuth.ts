import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { connectSocket } from '../../../socket/socket.client';

export const useAuth = () => {
  const router = useRouter();
  const { setTokens, setUser, logout: clearAuthStore } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Set values in Zustand store
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      
      // Connect WS Socket
      connectSocket(data.accessToken);

      // Redirect to feed
      router.push('/feed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Set values in Zustand store
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);

      // Connect WS Socket
      connectSocket(data.accessToken);

      // Redirect to feed
      router.push('/feed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuthStore();
      router.push('/auth/login');
    },
    onError: () => {
      // Even if network fails, force clean client and redirect
      clearAuthStore();
      router.push('/auth/login');
    }
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
export default useAuth;
