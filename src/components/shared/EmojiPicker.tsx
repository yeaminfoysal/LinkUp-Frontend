'use client';

import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import Dropdown from '../ui/Dropdown';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
}

const EMOJIS = [
  // Smileys & Emotion
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  // Hands & Gestures
  '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘',
  '👌', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖',
  // Hearts & Symbols
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '🌟',
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, trigger }) => {
  const defaultTrigger = (
    <button
      type="button"
      className="p-2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl transition-all cursor-pointer flex items-center justify-center"
    >
      <Smile className="w-5 h-5" />
    </button>
  );

  return (
    <Dropdown trigger={trigger || defaultTrigger} align="right">
      <div className="p-3 w-64">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Popular Emojis
        </p>
        <div className="grid grid-cols-8 gap-1">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelect(emoji)}
              className="w-7 h-7 flex items-center justify-center text-lg rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </Dropdown>
  );
};
export default EmojiPicker;
