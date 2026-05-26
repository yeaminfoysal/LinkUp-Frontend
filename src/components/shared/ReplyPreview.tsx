import React from 'react';
import { X, CornerDownRight } from 'lucide-react';
import { Message } from '../../types/message.types';

interface ReplyPreviewProps {
  message: Message | null;
  onClear: () => void;
}

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({ message, onClear }) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-3 border-l-4 border-violet-500 bg-zinc-100/50 dark:bg-zinc-900/40 rounded-r-xl gap-3 animate-slide-up">
      <div className="flex items-center gap-2 min-w-0">
        <CornerDownRight className="w-4 h-4 text-violet-500 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
            Replying to {message.sender?.name || 'User'}
          </p>
          <p className="text-[11px] text-zinc-500 truncate mt-0.5">
            {message.type === 'TEXT' ? message.content : `[${message.type.toLowerCase()}] Attachment`}
          </p>
        </div>
      </div>

      <button
        onClick={onClear}
        className="w-6 h-6 rounded-full bg-zinc-200/50 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors flex-shrink-0 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
export default ReplyPreview;
