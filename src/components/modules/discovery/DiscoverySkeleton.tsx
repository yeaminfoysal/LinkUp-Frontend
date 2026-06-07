import React from 'react';
import { motion } from 'framer-motion';

export const DiscoverySkeleton: React.FC = () => {
  return (
    <div className="w-full mt-12">
      <div className="flex justify-center mb-8">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="text-purple-500 font-medium flex items-center gap-2"
        >
          <span className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
          ✨ AI is analyzing profiles and computing vectors...
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm overflow-hidden relative">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-zinc-100/50 dark:via-zinc-800/20 to-transparent animate-[shimmer_2s_infinite]"></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                <div>
                  <div className="w-24 h-5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-2"></div>
                  <div className="w-16 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-20 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
            </div>
            
            <div className="space-y-2 mb-5">
              <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-2/3 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
            </div>
            
            <div className="w-full h-16 rounded-xl bg-purple-50 dark:bg-purple-900/10 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
