import React from 'react';

interface TypingIndicatorProps {
  names: string[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ names }) => {
  if (names.length === 0) return null;

  const text =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : `${names[0]} and ${names.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs px-4 py-2 select-none animate-slide-up">
      {/* Animated dots */}
      <div className="flex gap-1 items-center h-4">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-650 typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-650 typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-650 typing-dot" />
      </div>
      <span className="italic font-medium">{text}</span>
    </div>
  );
};
export default TypingIndicator;
