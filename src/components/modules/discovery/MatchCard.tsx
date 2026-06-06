import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Briefcase } from 'lucide-react';
import { SearchResult } from '../../../services/ai-discovery.service';

interface MatchCardProps {
  user: SearchResult;
}

export const MatchCard: React.FC<MatchCardProps> = ({ user }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  };

  const getRingColor = (score: number) => {
    if (score >= 80) return 'ring-emerald-500 shadow-emerald-500/30';
    if (score >= 60) return 'ring-amber-500 shadow-amber-500/30';
    return 'ring-blue-500 shadow-blue-500/30';
  };

  return (
    <Link href={`/profile/${user.username}`} className="block h-full cursor-pointer">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group h-full flex flex-col"
      >
      {/* Decorative background blob */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>

      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className={`w-14 h-14 rounded-full overflow-hidden ring-2 ring-offset-2 dark:ring-offset-zinc-900 shadow-lg ${getRingColor(user.score || user.matchScore)}`}>
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=random`} 
                alt={user.name || user.username} 
                className="w-full h-full object-cover"
              />
            </div>
            {user.isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 leading-tight break-words">{user.name || user.username}</h3>
            <p className="text-zinc-500 text-sm break-words">@{user.username}</p>
          </div>
        </div>
        
        {/* Match Score Badge */}
        
      </div>
{/* 
      <div className="mb-5 text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 min-h-[40px]">
        {user.bio || "No bio available."}
      </div> */}
      <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-semibold whitespace-nowrap ${getScoreColor(user.score || user.matchScore)}`}>
          <span className="animate-pulse">🔥</span>
          {Math.round(user.score || user.matchScore)}% Match
        </div>

      {/* AI Reason Box */}
      <div className="mt-auto pt-4">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border border-purple-100 dark:border-purple-900/30 relative">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
            <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed font-medium">
              {user.matchReason}
            </p>
          </div>
        </div>
      </div>
      </motion.div>
    </Link>
  );
};
