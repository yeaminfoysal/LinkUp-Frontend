'use client';

import React, { useState } from 'react';
import Avatar from '../../../components/shared/Avatar';
import FileAttachment from '../../../components/shared/FileAttachment';
import MediaViewer from '../../../components/shared/MediaViewer';
import ReactionPicker from './ReactionPicker';
import { Message } from '../../../types/message.types';
import { useAuthStore } from '../../../store/auth.store';
import { CornerUpLeft, Trash2, Edit3, Smile, Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  showSenderHeader?: boolean;
  onReply: (message: Message) => void;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onRemoveReact: (messageId: string, emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showSenderHeader = false,
  onReply,
  onEdit,
  onDelete,
  onReact,
  onRemoveReact,
}) => {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [showMedia, setShowMedia] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content || '');

  const isOwn = message.senderId === currentUserId;
  const hasMedia = !!message.mediaUrl;
  const isDeleted = message.isDeleted;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;
    onEdit(message.id, editText.trim());
    setIsEditing(false);
  };

  // Reactions count mapping
  const reactionCounts = (message.reactions || []).reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const myReaction = message.reactions?.find((r) => r.userId === currentUserId)?.emoji || null;

  const handleEmojiSelect = (emoji: string) => {
    if (myReaction === emoji) {
      onRemoveReact(message.id, emoji);
    } else {
      onReact(message.id, emoji);
    }
    setShowPicker(false);
  };

  // Read receipt status:
  // If reads length > 0 (excluding own) -> read (double blue check)
  // Else -> delivered (double check)
  const isRead = (message.reads || []).some((r) => r.userId !== currentUserId);

  return (
    <div className={`flex w-full gap-2 items-end group ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      {/* Sender avatar for incoming messages */}
      {!isOwn && showSenderHeader && (
        <Avatar src={message.sender?.avatar} name={message.sender?.name} size="sm" className="mb-4" />
      )}
      {!isOwn && !showSenderHeader && <div className="w-8" />}

      {/* Message container */}
      <div className={`max-w-[70%] flex flex-col space-y-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Name Header if group and first message */}
        {!isOwn && showSenderHeader && (
          <span className="text-[11px] font-bold text-zinc-500 ml-1 mb-0.5">
            {message.sender?.name}
          </span>
        )}

        {/* Reply Source Preview */}
        {message.replyTo && (
          <div className="flex items-center gap-1 text-[10px] text-zinc-400 mb-1 border-l-2 border-violet-400 pl-2 max-w-xs truncate">
            <span>Replying to {message.replyTo.sender?.name || 'User'}:</span>
            <span className="italic truncate">{message.replyTo.content || '[Media]'}</span>
          </div>
        )}

        {/* Message bubble itself */}
        <div className="relative">
          {isDeleted ? (
            <div className="px-4 py-2.5 rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 text-xs italic text-zinc-400">
              This message was deleted
            </div>
          ) : isEditing ? (
            <form onSubmit={handleEditSubmit} className="flex gap-2 bg-white dark:bg-zinc-900 border p-1 rounded-xl">
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs px-2 py-1 text-zinc-900 dark:text-zinc-50"
                autoFocus
              />
              <button type="submit" className="text-xs font-bold text-violet-500 px-2 cursor-pointer">
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-semibold text-zinc-400 px-1 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div
              className={`p-3 rounded-2xl relative select-text ${
                isOwn
                  ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-violet-500/10'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-bl-none border border-zinc-150 dark:border-zinc-800/60'
              }`}
            >
              {/* Media Render */}
              {hasMedia && message.type === 'IMAGE' && (
                <div
                  onClick={() => setShowMedia(true)}
                  className="rounded-xl overflow-hidden mb-2 cursor-zoom-in max-w-xs border border-white/10"
                >
                  <img src={message.mediaUrl!} alt="Shared" className="w-full h-auto object-cover max-h-48" />
                </div>
              )}

              {hasMedia && message.type === 'FILE' && (
                <div className="mb-2">
                  <FileAttachment
                    name={message.content || 'Attached File'}
                    url={message.mediaUrl!}
                    size={message.mediaSize}
                  />
                </div>
              )}

              {/* Text Render */}
              {message.type === 'TEXT' && (
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
              )}

              {/* Bubble timestamp & receipts */}
              <div className={`flex items-center gap-1 justify-end text-[9px] mt-1.5 ${
                isOwn ? 'text-violet-200' : 'text-zinc-400'
              }`}>
                <span>{formatDate(message.createdAt)}</span>
                {message.editedAt && <span className="italic">(edited)</span>}
                {isOwn && (
                  <span>
                    {isRead ? (
                      <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Hover Actions (Reply, React, Edit, Delete) */}
          {!isDeleted && !isEditing && (
            <div className={`absolute top-1/2 -translate-y-1/2 z-15 hidden group-hover:flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-1.5 rounded-full shadow-md ${
              isOwn ? 'right-full mr-3 flex-row-reverse' : 'left-full ml-3'
            }`}>
              {/* React */}
              <div className="relative">
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="p-1 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded-full transition-colors cursor-pointer"
                  title="React"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>
                {showPicker && (
                  <div className={`absolute bottom-full mb-2 ${isOwn ? 'right-0' : 'left-0'}`}>
                    <ReactionPicker onSelect={handleEmojiSelect} activeEmoji={myReaction} />
                  </div>
                )}
              </div>

              {/* Reply */}
              <button
                onClick={() => onReply(message)}
                className="p-1 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded-full transition-colors cursor-pointer"
                title="Reply"
              >
                <CornerUpLeft className="w-3.5 h-3.5" />
              </button>

              {/* Edit (only own) */}
              {isOwn && message.type === 'TEXT' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded-full transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Delete (only own) */}
              {isOwn && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reaction Summaries under bubble */}
        {!isDeleted && Object.keys(reactionCounts).length > 0 && (
          <div className={`flex gap-1 items-center mt-1 select-none flex-wrap ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}>
            {Object.entries(reactionCounts).map(([emoji, count]) => {
              const isMyReaction = myReaction === emoji;
              return (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                    isMyReaction
                      ? 'bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-150 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{emoji}</span>
                  {count > 1 && <span className="font-bold">{count}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Full screen media preview */}
      {hasMedia && (
        <MediaViewer
          isOpen={showMedia}
          onClose={() => setShowMedia(false)}
          mediaUrl={message.mediaUrl!}
          mediaType={message.type}
        />
      )}
    </div>
  );
};
export default MessageBubble;
