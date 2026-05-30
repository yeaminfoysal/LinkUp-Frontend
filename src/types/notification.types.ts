export type NotificationType =
  | 'NEW_MESSAGE'
  | 'POST_LIKED'
  | 'POST_COMMENTED'
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'FRIEND_REQUEST_RECEIVED'
  | 'FRIEND_REQUEST_ACCEPTED';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  data: {
    conversationId?: string;
    senderId?: string;
    postId?: string;
    commentId?: string;
    likedBy?: string;
    requestId?: string;
  } | null;
  createdAt: string;
}
