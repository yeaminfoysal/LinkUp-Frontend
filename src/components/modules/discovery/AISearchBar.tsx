import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';

interface AISearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const placeholders = [
  "Try 'React developers in Dhaka'...",
  "Find a 'Machine Learning expert'...",
  "Search for 'UI/UX designers open to work'...",
  "Look up 'Node.js backend engineers'..."
];

export const AISearchBar: React.FC<AISearchBarProps> = ({ value, onChange, onSubmit, isLoading }) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto group">
      {/* Animated Glowing Backdrop */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
      
      <form onSubmit={handleSubmit} className="relative flex items-center w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
        <div className="pl-6 text-zinc-400">
          <Search size={22} className="group-focus-within:text-purple-500 transition-colors" />
        </div>
        
        <div className="relative w-full flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent px-4 py-5 outline-none text-zinc-900 dark:text-zinc-100 placeholder-transparent z-10 relative"
            autoComplete="off"
            id="ai-search-input"
          />
          
          {/* Animated Placeholder */}
          {!value && (
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholderIndex}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -5, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {placeholders[placeholderIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || value.length < 3}
          className={`pr-6 pl-4 flex items-center justify-center transition-all ${
            value.length >= 3 && !isLoading
              ? 'text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:scale-110 cursor-pointer'
              : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Sparkles size={24} className={value.length >= 3 ? "animate-pulse" : ""} />
          )}
        </button>
      </form>
    </div>
  );
};
