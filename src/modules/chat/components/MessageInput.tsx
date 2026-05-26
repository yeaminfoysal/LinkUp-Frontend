'use client';

import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from '../../../components/shared/EmojiPicker';
import { Paperclip, Send, X, Loader2, Smile } from 'lucide-react';
import usePost from '../../posts/hooks/usePost';
import toast from '../../../components/ui/Toast';

interface MessageInputProps {
  onSend: (content: string, type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE', extra?: any) => void;
  onKeyPress: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, onKeyPress }) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { uploadFile, isUploading } = usePost();

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      onKeyPress();
    }
  };

  const handleSend = () => {
    const trimmedText = text.trim();
    if (!trimmedText && !attachment) return;

    if (attachment) {
      // Send media message
      onSend(attachment.name, attachment.type, {
        mediaUrl: attachment.mediaUrl,
        mediaSize: attachment.mediaSize,
        mimeType: attachment.mimeType,
      });
      setAttachment(null);
    } else {
      // Send standard text
      onSend(trimmedText, 'TEXT');
      setText('');
    }

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const res = await uploadFile(file);
      
      const fileType = file.type.startsWith('image/')
        ? 'IMAGE'
        : file.type.startsWith('video/')
        ? 'VIDEO'
        : 'FILE';

      setAttachment({
        name: file.name,
        type: fileType,
        mediaUrl: res.mediaUrl,
        mediaSize: file.size,
        mimeType: file.type,
      });
      toast.success('Attachment ready to send!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload attachment');
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="space-y-2.5">
      {/* Attachment Drawer Preview */}
      {attachment && (
        <div className="flex items-center justify-between p-2.5 bg-zinc-150/50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/20 max-w-xs animate-slide-up ml-4">
          <div className="flex items-center gap-2 min-w-0">
            {attachment.type === 'IMAGE' ? (
              <img src={attachment.mediaUrl} className="w-10 h-10 object-cover rounded-lg" alt="Attachment" />
            ) : (
              <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center text-violet-500 font-bold text-xs">
                FILE
              </div>
            )}
            <span className="text-xs font-semibold truncate text-zinc-700 dark:text-zinc-300">
              {attachment.name}
            </span>
          </div>
          <button
            onClick={handleRemoveAttachment}
            className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input controls container */}
      <div className="flex items-end gap-2.5 p-3 rounded-2xl border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 shadow-sm relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Paperclip attach */}
        <button
          type="button"
          onClick={handleFileClick}
          disabled={isUploading}
          className="p-2.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 rounded-xl transition-all cursor-pointer flex-shrink-0"
          title="Attach file"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
          ) : (
            <Paperclip className="w-5 h-5" />
          )}
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={attachment ? 'File attached. Click send...' : 'Type a message...'}
          disabled={!!attachment}
          rows={1}
          className="flex-1 bg-transparent border-0 resize-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 focus:outline-none text-sm max-h-[120px] py-2 outline-none"
        />

        {/* Emoji picker */}
        {!attachment && (
          <EmojiPicker onSelect={handleEmojiSelect} />
        )}

        {/* Send */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() && !attachment}
          className="p-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl shadow-md shadow-violet-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex-shrink-0"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};
export default MessageInput;
