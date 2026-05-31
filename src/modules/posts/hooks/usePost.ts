import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import postsService from '../services/posts.service';
import toast from '../../../components/ui/Toast';

export const usePost = (postId?: string) => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Fetch comments query
  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postsService.getComments(postId!),
    enabled: !!postId,
  });

  // Create Comment Mutation
  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string; parentId?: string | null }) =>
      postsService.createComment(postId!, data.content, data.parentId),
    onSuccess: () => {
      toast.success('Comment posted');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    },
  });

  // Delete Comment Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: postsService.deleteComment,
    onSuccess: () => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  // Upload File Mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploadProgress(0);
      return postsService.uploadFile(file, (percent) => {
        setUploadProgress(percent);
      });
    },
  });

  return {
    comments: commentsQuery.data?.items || (Array.isArray(commentsQuery.data) ? commentsQuery.data : []),
    isLoadingComments: commentsQuery.isLoading,
    
    createComment: createCommentMutation.mutateAsync,
    isCreatingComment: createCommentMutation.isPending,
    
    deleteComment: deleteCommentMutation.mutate,
    isDeletingComment: deleteCommentMutation.isPending,

    uploadFile: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadProgress,
  };
};
export default usePost;
