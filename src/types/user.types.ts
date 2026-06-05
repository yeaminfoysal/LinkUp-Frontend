export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  location?: string | null;
  university?: string | null;
  department?: string | null;
  skills?: string | null;
  interests?: string | null;
  profession?: string | null;
  work_place?: string | null;
  isOnline: boolean;
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Friendship {
  friendshipId: string;
  friend: Omit<User, 'email' | 'bio' | 'createdAt' | 'updatedAt'>;
  since: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  sender?: Omit<User, 'email' | 'bio' | 'createdAt' | 'updatedAt'>;
  receiver?: Omit<User, 'email' | 'bio' | 'createdAt' | 'updatedAt'>;
}

export interface Block {
  id: string;
  blockedById: string;
  blockedUserId: string;
  createdAt: string;
}
