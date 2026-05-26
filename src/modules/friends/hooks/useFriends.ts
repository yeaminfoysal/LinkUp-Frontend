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

  // Mutations
  const sendRequestMutation = useMutation({
    mutationFn: friendsService.sendRequest,
    onSuccess: () => {
      toast.success('Friend request sent!');
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to send request');
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: friendsService.acceptRequest,
    onSuccess: () => {
      toast.success('Request accepted! You are now friends.');
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to accept request');
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: friendsService.rejectRequest,
    onSuccess: () => {
      toast.success('Friend request declined');
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to decline request');
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: friendsService.cancelRequest,
    onSuccess: () => {
      toast.success('Friend request cancelled');
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to cancel request');
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: friendsService.removeFriend,
    onSuccess: () => {
      toast.success('Friend removed');
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to remove friend');
    },
  });

  const blockMutation = useMutation({
    mutationFn: friendsService.blockUser,
    onSuccess: () => {
      toast.success('User blocked');
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to block user');
    },
  });

  const unblockMutation = useMutation({
    mutationFn: friendsService.unblockUser,
    onSuccess: () => {
      toast.success('User unblocked');
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to unblock user');
    },
  });

  return {
    // Lists
    friends: friendsQuery.data || [],
    pendingRequests: pendingQuery.data || [],
    sentRequests: sentQuery.data || [],
    
    // Loading States
    isLoadingFriends: friendsQuery.isLoading,
    isLoadingPending: pendingQuery.isLoading,
    isLoadingSent: sentQuery.isLoading,

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
