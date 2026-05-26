import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chatService from '../services/chat.service';
import { useChatStore } from '../../../store/chat.store';
import toast from '../../../components/ui/Toast';
import { useRouter } from 'next/navigation';

export const useChat = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setActiveConversationId } = useChatStore();

  // Get conversation list query
  const conversationsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.getConversations(),
  });

  // Create direct conversation mutation
  const directMutation = useMutation({
    mutationFn: chatService.createDirectConversation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setActiveConversationId(data.id);
      router.push(`/messages/${data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to open conversation');
    },
  });

  // Create group conversation mutation
  const groupMutation = useMutation({
    mutationFn: chatService.createGroupConversation,
    onSuccess: (data) => {
      toast.success('Group created successfully!');
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setActiveConversationId(data.id);
      router.push(`/messages/${data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create group');
    },
  });

  return {
    conversations: conversationsQuery.data || [],
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    refetch: conversationsQuery.refetch,

    createDirectConversation: directMutation.mutateAsync,
    isCreatingDirect: directMutation.isPending,
    
    createGroup: groupMutation.mutateAsync,
    isCreatingGroup: groupMutation.isPending,
  };
};
export default useChat;
