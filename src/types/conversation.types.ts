import { User } from './user.types';
import { Message } from './message.types';

export type ConversationType = 'DIRECT' | 'GROUP';
export type MemberRole = 'MEMBER' | 'ADMIN';

export interface ConversationMember {
  id: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  user: Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'isOnline' | 'lastSeen'>;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string | null;
  avatar: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  lastMessageId: string | null;
  lastMessageAt: string | null;
  members: ConversationMember[];
  messages?: Message[]; // Contains last message preview
}
