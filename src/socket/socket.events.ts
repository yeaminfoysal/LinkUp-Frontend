export const SOCKET_EVENTS = {
  // Connection / Presence
  DISCONNECT_USER: 'disconnect_user',
  PING_PRESENCE: 'ping_presence',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  PRESENCE_UPDATED: 'presence_updated',

  // Friend System
  SEND_FRIEND_REQUEST: 'send_friend_request',
  ACCEPT_FRIEND_REQUEST: 'accept_friend_request',
  REJECT_FRIEND_REQUEST: 'reject_friend_request',
  CANCEL_FRIEND_REQUEST: 'cancel_friend_request',
  REMOVE_FRIEND: 'remove_friend',
  BLOCK_USER: 'block_user',
  UNBLOCK_USER: 'unblock_user',
  
  FRIEND_REQUEST_RECEIVED: 'friend_request_received',
  FRIEND_REQUEST_ACCEPTED: 'friend_request_accepted',
  FRIEND_REQUEST_REJECTED: 'friend_request_rejected',
  FRIEND_REQUEST_CANCELLED: 'friend_request_cancelled',
  FRIEND_REMOVED: 'friend_removed',
  USER_BLOCKED: 'user_blocked',
  USER_UNBLOCKED: 'user_unblocked',

  // Conversation
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  CONVERSATION_CREATED: 'conversation_created',
  CONVERSATION_UPDATED: 'conversation_updated',
  CONVERSATION_LEFT: 'conversation_left',

  // Messaging
  SEND_MESSAGE: 'send_message',
  EDIT_MESSAGE: 'edit_message',
  DELETE_MESSAGE: 'delete_message',
  MARK_AS_READ: 'mark_as_read',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  REACT_TO_MESSAGE: 'react_to_message',
  REMOVE_REACTION: 'remove_reaction',
  
  NEW_MESSAGE: 'new_message',
  MESSAGE_EDITED: 'message_edited',
  MESSAGE_DELETED: 'message_deleted',
  MESSAGE_READ: 'message_read',
  USER_TYPING: 'user_typing',
  USER_STOP_TYPING: 'user_stop_typing',
  MESSAGE_REACTED: 'message_reacted',
  REACTION_REMOVED: 'reaction_removed',

  // Group Management
  ADD_GROUP_MEMBERS: 'add_group_members',
  REMOVE_GROUP_MEMBER: 'remove_group_member',
  PROMOTE_TO_ADMIN: 'promote_to_admin',
  DEMOTE_ADMIN: 'demote_admin',
  UPDATE_GROUP_NAME: 'update_group_name',
  UPDATE_GROUP_AVATAR: 'update_group_avatar',
  LEAVE_GROUP: 'leave_group',
  DELETE_GROUP: 'delete_group',
  
  GROUP_MEMBER_ADDED: 'group_member_added',
  GROUP_MEMBER_REMOVED: 'group_member_removed',
  GROUP_ADMIN_PROMOTED: 'group_admin_promoted',
  GROUP_ADMIN_DEMOTED: 'group_admin_demoted',
  GROUP_UPDATED: 'group_updated',
  GROUP_DELETED: 'group_deleted',

  // Social Feed
  POST_LIKED: 'post_liked',
  POST_UNLIKED: 'post_unliked',
  POST_COMMENTED: 'post_commented',
  POST_COMMENT_DELETED: 'post_comment_deleted',
  POST_COMMENT_LIKED: 'post_comment_liked',
  POST_COMMENT_UNLIKED: 'post_comment_unliked',

  // Notifications
  NOTIFICATION_RECEIVED: 'notification_received',
  UNREAD_COUNT_UPDATED: 'unread_count_updated',
} as const;
