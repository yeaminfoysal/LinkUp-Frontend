import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import postsService from '../services/posts.service';
import toast from '../../../components/ui/Toast';
import { useAuthStore } from '../../../store/auth.store';

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
    onMutate: async (newCommentData) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      const previousComments = queryClient.getQueryData(['comments', postId]);

      const currentUser = useAuthStore.getState().user;
      const mockComment: any = {
        id: `temp-${Date.now()}`,
        postId: postId!,
        content: newCommentData.content,
        parentId: newCommentData.parentId || null,
        userId: currentUser?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: currentUser?.id,
          name: currentUser?.name || 'You',
          username: currentUser?.username || 'you',
          avatar: currentUser?.avatar || null,
        },
        replies: [],
      };

      queryClient.setQueryData(['comments', postId], (old: any) => {
        if (!old) {
          return { items: [mockComment] };
        }
        if (Array.isArray(old)) {
          return [mockComment, ...old];
        }
        if (old.items && Array.isArray(old.items)) {
          return {
            ...old,
            items: [mockComment, ...old.items],
          };
        }
        return old;
      });

      // Snapshot and increment post comment count across feeds
      const postQueries = queryClient.getQueryCache().findAll({
        predicate: (query) => ['feed', 'savedPosts', 'userPosts'].includes(query.queryKey[0] as string)
      });
      const snapshots = postQueries.map((query) => ({
        queryKey: query.queryKey,
        data: queryClient.getQueryData(query.queryKey)
      }));

      snapshots.forEach(({ queryKey, data }) => {
        if (!data) return;
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          const updatePost = (post: any) => {
            if (post.id !== postId) return post;
            return {
              ...post,
              _count: {
                ...post._count,
                comments: (post._count?.comments || 0) + 1,
              },
            };
          };
          if (old.pages && Array.isArray(old.pages)) {
            return {
              ...old,
              pages: old.pages.map((page: any) => {
                if (page.items && Array.isArray(page.items)) {
                  return { ...page, items: page.items.map(updatePost) };
                }
                if (Array.isArray(page)) {
                  return page.map(updatePost);
                }
                return page;
              })
            };
          }
          if (old.items && Array.isArray(old.items)) {
            return { ...old, items: old.items.map(updatePost) };
          }
          if (Array.isArray(old)) {
            return old.map(updatePost);
          }
          return old;
        });
      });

      return { previousComments, snapshots };
    },
    onError: (err: any, newCommentData, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments);
      }
      if (context?.snapshots) {
        context.snapshots.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.response?.data?.message || 'Failed to post comment');
    },
    onSuccess: () => {
      toast.success('Comment posted');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  // Delete Comment Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: postsService.deleteComment,
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      const previousComments = queryClient.getQueryData(['comments', postId]);

      queryClient.setQueryData(['comments', postId], (old: any) => {
        if (!old) return old;
        const removeComment = (c: any) => c.id !== commentId;
        if (Array.isArray(old)) {
          return old.filter(removeComment);
        }
        if (old.items && Array.isArray(old.items)) {
          return { ...old, items: old.items.filter(removeComment) };
        }
        return old;
      });

      // Snapshot and decrement post comment count across feeds
      const postQueries = queryClient.getQueryCache().findAll({
        predicate: (query) => ['feed', 'savedPosts', 'userPosts'].includes(query.queryKey[0] as string)
      });
      const snapshots = postQueries.map((query) => ({
        queryKey: query.queryKey,
        data: queryClient.getQueryData(query.queryKey)
      }));

      snapshots.forEach(({ queryKey, data }) => {
        if (!data) return;
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          const updatePost = (post: any) => {
            if (post.id !== postId) return post;
            return {
              ...post,
              _count: {
                ...post._count,
                comments: Math.max(0, (post._count?.comments || 0) - 1),
              },
            };
          };
          if (old.pages && Array.isArray(old.pages)) {
            return {
              ...old,
              pages: old.pages.map((page: any) => {
                if (page.items && Array.isArray(page.items)) {
                  return { ...page, items: page.items.map(updatePost) };
                }
                if (Array.isArray(page)) {
                  return page.map(updatePost);
                }
                return page;
              })
            };
          }
          if (old.items && Array.isArray(old.items)) {
            return { ...old, items: old.items.map(updatePost) };
          }
          if (Array.isArray(old)) {
            return old.map(updatePost);
          }
          return old;
        });
      });

      return { previousComments, snapshots };
    },
    onError: (err, commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments);
      }
      if (context?.snapshots) {
        context.snapshots.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to delete comment');
    },
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
