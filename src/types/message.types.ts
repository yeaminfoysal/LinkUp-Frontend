import { User } from './user.types';

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';

export interface MessageRead {
  userId: string;
  readAt: string;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  type: MessageType;
  mediaUrl: string | null;
  mediaSize: number | null;
  mediaType: string | null; // MimeType
  replyToId: string | null;
  editedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedFor: string[];
  createdAt: string;
  updatedAt: string;
  sender?: Pick<User, 'id' | 'name' | 'username' | 'avatar'>;
  replyTo?: Message | null;
  reads?: MessageRead[];
  reactions?: MessageReaction[];
}
