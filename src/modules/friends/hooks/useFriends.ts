import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import friendsService from '../services/friends.service';
import toast from '../../../components/ui/Toast';

export const useFriends = () => {
  const queryClient = useQueryClient();

  // Queries
  const friendsQuery = useQuery({
    queryKey: ['friends'],
    queryFn: friendsService.getFriends,
  });

  const pendingQuery = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: friendsService.getPendingRequests,
  });

  const sentQuery = useQuery({
    queryKey: ['sentRequests'],
    queryFn: friendsService.getSentRequests,
  });

  const blockedQuery = useQuery({
    queryKey: ['blockedUsers'],
    queryFn: friendsService.getBlockedUsers,
  });

  // Mutations with Optimistic Updates
  const sendRequestMutation = useMutation({
    mutationFn: friendsService.sendRequest,
    onMutate: async (receiverId: string) => {
      await queryClient.cancelQueries({ queryKey: ['sentRequests'] });
      const previous = queryClient.getQueryData(['sentRequests']);
      const optimisticRequest = {
        id: `temp-${Date.now()}`,
        receiverId,
        receiver: { id: receiverId },
        status: 'PENDING'
      };
      queryClient.setQueryData(['sentRequests'], (old: any) => {
        return old ? [...old, optimisticRequest] : [optimisticRequest];
      });
      return { previous };
    },
    onError: (err: any, variables, context) => {
      if (context?.previous) queryClient.setQueryData(['sentRequests'], context.previous);
      toast.error(err.response?.data?.message || 'Failed to send request');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    },
    onSuccess: () => {
      toast.success('Friend request sent!');
    }
  });

  const acceptRequestMutation = useMutation({
    mutationFn: friendsService.acceptRequest,
    onMutate: async (requestId: string) => {
      await queryClient.cancelQueries({ queryKey: ['pendingRequests'] });
      const previousPending = queryClient.getQueryData(['pendingRequests']);
      queryClient.setQueryData(['pendingRequests'], (old: any) => {
        return old ? old.filter((req: any) => req.id !== requestId) : [];
      });
      return { previousPending };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousPending) queryClient.setQueryData(['pendingRequests'], context.previousPending);
      toast.error(err.response?.data?.message || 'Failed to accept request');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    },
    onSuccess: () => {
      toast.success('Request accepted! You are now friends.');
    }
  });

  const rejectRequestMutation = useMutation({
    mutationFn: friendsService.rejectRequest,
    onMutate: async (requestId: string) => {
      await queryClient.cancelQueries({ queryKey: ['pendingRequests'] });
      const previous = queryClient.getQueryData(['pendingRequests']);
      queryClient.setQueryData(['pendingRequests'], (old: any) => {
        return old ? old.filter((req: any) => req.id !== requestId) : [];
      });
      return { previous };
    },
    onError: (err: any, variables, context) => {
      if (context?.previous) queryClient.setQueryData(['pendingRequests'], context.previous);
      toast.error(err.response?.data?.message || 'Failed to decline request');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    },
    onSuccess: () => {
      toast.success('Friend request declined');
    }
  });

  const cancelRequestMutation = useMutation({
    mutationFn: friendsService.cancelRequest,
    onMutate: async (requestId: string) => {
      await queryClient.cancelQueries({ queryKey: ['sentRequests'] });
      const previous = queryClient.getQueryData(['sentRequests']);
      queryClient.setQueryData(['sentRequests'], (old: any) => {
        return old ? old.filter((req: any) => req.id !== requestId) : [];
      });
      return { previous };
    },
    onError: (err: any, variables, context) => {
      if (context?.previous) queryClient.setQueryData(['sentRequests'], context.previous);
      toast.error(err.response?.data?.message || 'Failed to cancel request');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    },
    onSuccess: () => {
      toast.success('Friend request cancelled');
    }
  });

  const removeFriendMutation = useMutation({
    mutationFn: friendsService.removeFriend,
    onMutate: async (friendshipId: string) => {
      await queryClient.cancelQueries({ queryKey: ['friends'] });
      const previous = queryClient.getQueryData(['friends']);
      queryClient.setQueryData(['friends'], (old: any) => {
        return old ? old.filter((f: any) => f.friendshipId !== friendshipId) : [];
      });
      return { previous };
    },
    onError: (err: any, variables, context) => {
      if (context?.previous) queryClient.setQueryData(['friends'], context.previous);
      toast.error(err.response?.data?.message || 'Failed to remove friend');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onSuccess: () => {
      toast.success('Friend removed');
    }
  });

  const blockMutation = useMutation({
    mutationFn: friendsService.blockUser,
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ['friends'] });
      await queryClient.cancelQueries({ queryKey: ['blockedUsers'] });
      const previousFriends = queryClient.getQueryData(['friends']);
      const previousBlocked = queryClient.getQueryData(['blockedUsers']);
      
      queryClient.setQueryData(['friends'], (old: any) => {
        return old ? old.filter((f: any) => f.friend.id !== userId) : [];
      });
      const fakeBlockedUser = { id: userId, isBlockedByMe: true };
      queryClient.setQueryData(['blockedUsers'], (old: any) => {
        return old ? [...old, fakeBlockedUser] : [fakeBlockedUser];
      });

      return { previousFriends, previousBlocked };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousFriends) queryClient.setQueryData(['friends'], context.previousFriends);
      if (context?.previousBlocked) queryClient.setQueryData(['blockedUsers'], context.previousBlocked);
      toast.error(err.response?.data?.message || 'Failed to block user');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
    },
    onSuccess: () => {
      toast.success('User blocked');
    }
  });

  const unblockMutation = useMutation({
    mutationFn: friendsService.unblockUser,
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ['blockedUsers'] });
      const previousBlocked = queryClient.getQueryData(['blockedUsers']);
      queryClient.setQueryData(['blockedUsers'], (old: any) => {
        return old ? old.filter((u: any) => u.id !== userId) : [];
      });
      return { previousBlocked };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousBlocked) queryClient.setQueryData(['blockedUsers'], context.previousBlocked);
      toast.error(err.response?.data?.message || 'Failed to unblock user');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
    },
    onSuccess: () => {
      toast.success('User unblocked');
    }
  });

  return {
    // Lists
    friends: friendsQuery.data || [],
    pendingRequests: pendingQuery.data || [],
    sentRequests: sentQuery.data || [],
    blockedUsers: blockedQuery.data || [],
    
    // Loading States
    isLoadingFriends: friendsQuery.isLoading,
    isLoadingPending: pendingQuery.isLoading,
    isLoadingSent: sentQuery.isLoading,
    isLoadingBlocked: blockedQuery.isLoading,

    // Mutation triggers
    sendRequest: sendRequestMutation.mutate,
    acceptRequest: acceptRequestMutation.mutate,
    rejectRequest: rejectRequestMutation.mutate,
    cancelRequest: cancelRequestMutation.mutate,
    removeFriend: removeFriendMutation.mutate,
    blockUser: blockMutation.mutate,
    unblockUser: unblockMutation.mutate,
  };
};
export default useFriends;
