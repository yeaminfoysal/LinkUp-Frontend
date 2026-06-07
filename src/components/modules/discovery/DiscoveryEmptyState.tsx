import React from 'react';
import { motion } from 'framer-motion';
import { Telescope, SearchX } from 'lucide-react';

interface DiscoveryEmptyStateProps {
  hasSearched: boolean;
  query: string;
}

export const DiscoveryEmptyState: React.FC<DiscoveryEmptyStateProps> = ({ hasSearched, query }) => {
  if (!hasSearched) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping"></div>
          <Telescope className="w-12 h-12 text-purple-600 dark:text-purple-400 z-10" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Discover Amazing People</h2>
        <p className="text-zinc-500 max-w-md">
          Use the AI search bar above to describe exactly who you're looking for. The AI will find the best matches based on profiles and skills.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-12 h-12 text-zinc-400" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">No High-Quality Matches Found</h2>
      <p className="text-zinc-500 max-w-md mb-6">
        We couldn't find anyone with an 80%+ match score for <span className="font-semibold text-zinc-700 dark:text-zinc-300">"{query}"</span>.
      </p>
      <p className="text-sm text-zinc-400">
        Try broadening your search or using more generic keywords!
      </p>
    </motion.div>
  );
};
