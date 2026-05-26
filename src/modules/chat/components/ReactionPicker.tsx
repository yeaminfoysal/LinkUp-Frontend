import React from 'react';

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  activeEmoji?: string | null;
}

const POPULAR_REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect, activeEmoji }) => {
  return (
    <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-lg px-2 py-1 rounded-full backdrop-blur-md">
      {POPULAR_REACTIONS.map((emoji) => {
        const isActive = activeEmoji === emoji;
        return (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className={`w-7 h-7 flex items-center justify-center text-sm rounded-full transition-transform hover:scale-125 cursor-pointer ${
              isActive ? 'bg-violet-500/10 scale-110' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
};
export default ReactionPicker;
