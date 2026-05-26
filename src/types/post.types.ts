import { User } from './user.types';

export type PostVisibility = 'PUBLIC' | 'FRIENDS' | 'PRIVATE';

export interface Post {
  id: string;
  userId: string;
  content: string | null;
  mediaUrls: string[];
  visibility: PostVisibility;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, 'id' | 'name' | 'username' | 'avatar'>;
  _count?: {
    likes: number;
    comments: number;
  };
  hasLiked?: boolean; // Convenience property for frontend state
  hasSaved?: boolean; // Convenience property for frontend state
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, 'id' | 'name' | 'username' | 'avatar'>;
  replies?: Comment[];
}
