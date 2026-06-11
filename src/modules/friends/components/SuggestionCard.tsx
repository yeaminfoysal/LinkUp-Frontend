'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UserPlus,
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Layers,
  Code,
  Heart,
  Sparkles,
  Users
} from 'lucide-react';
import Avatar from '../../../components/shared/Avatar';
import Button from '../../../components/ui/Button';

export interface SuggestionUser {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  university: string | null;
  department: string | null;
  skills: string | null;
  interests: string | null;
  profession: string | null;
  work_place: string | null;
  isOnline: boolean;
  matchScore: number;
  matchReason: string;
  matchingFields: string[];
  matchingDetails: Array<{ field: string; value: string; label: string }>;
}

interface SuggestionCardProps {
  user: SuggestionUser;
  isRequestSent: boolean;
  requestId: string | null;
  onSendRequest: (userId: string) => void;
  onCancelRequest: (requestId: string) => void;
  isPendingAction: boolean;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  user,
  isRequestSent,
  requestId,
  onSendRequest,
  onCancelRequest,
  isPendingAction,
}) => {
  // Color styling based on score
  const getScoreColor = (score: number) => {
    if (score === 0) return 'from-blue-500 to-cyan-500 text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (score >= 80) return 'from-emerald-500 to-teal-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'from-amber-500 to-orange-500 text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'from-violet-500 to-indigo-500 text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20';
  };

  const getRingColor = (score: number) => {
    if (score === 0) return 'ring-blue-500 shadow-blue-500/20';
    if (score >= 80) return 'ring-emerald-500 shadow-emerald-500/20';
    if (score >= 60) return 'ring-amber-500 shadow-amber-500/20';
    return 'ring-violet-500 shadow-violet-500/20';
  };

  // Get matching icons for fields
  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'mutual_friends':
        return <Users className="w-3.5 h-3.5" />;
      case 'university':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'work_place':
      case 'profession':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'department':
        return <Layers className="w-3.5 h-3.5" />;
      case 'skills':
        return <Code className="w-3.5 h-3.5" />;
      case 'interests':
        return <Heart className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getBadgeStyle = (field: string) => {
    switch (field) {
      case 'mutual_friends':
        return 'bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-900/30';
      case 'university':
      case 'department':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30';
      case 'location':
        return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/30';
      case 'work_place':
      case 'profession':
        return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/30';
      default:
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-violet-500/20 dark:hover:border-violet-500/20 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full"
    >
      {/* Decorative Blob */}
      <div className="absolute -right-10 -top-10 w-28 h-28 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors duration-300" />

      {/* Main Info */}
      <div className="space-y-4">
        {/* Top bar with avatar and match score */}
        <div className="flex items-start justify-between">
          <Link href={`/profile/${user.username}`} className="block">
            <div className={`relative inline-flex shrink-0 ring-2 ring-offset-2 dark:ring-offset-zinc-950 rounded-full transition-transform duration-300 group-hover:scale-105 ${getRingColor(user.matchScore)}`}>
              <Avatar src={user.avatar} name={user.name} size="md" isOnline={user.isOnline} />
            </div>
          </Link>

          {/* Glowing Match Badge */}
          {user.matchScore > 0 ? (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold shadow-sm ${getScoreColor(user.matchScore)}`}>
              <span className="animate-pulse">🔥</span>
              {user.matchScore}% Match
            </div>
          ) : (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold shadow-sm ${getScoreColor(user.matchScore)}`}>
              <span className="animate-pulse">🌍</span>
              Global
            </div>
          )}
        </div>

        {/* User identification */}
        <div>
          <Link href={`/profile/${user.username}`} className="hover:underline block w-fit">
            <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-50 leading-snug">
              {user.name}
            </h4>
          </Link>
          <p className="text-xs text-zinc-500">@{user.username}</p>
          
          {user.bio && (
            <p className="text-xs text-zinc-650 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>

        {/* Shared / Matching Details */}
        {user.matchingDetails.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
              Shared Connections
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.matchingDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${getBadgeStyle(detail.field)}`}
                  title={detail.value}
                >
                  {getFieldIcon(detail.field)}
                  <span className="truncate max-w-[150px]">{detail.label}: {detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI match reason sentence */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 dark:from-violet-500/10 dark:to-indigo-500/10 border border-violet-500/10 dark:border-violet-500/20">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-violet-500 dark:text-violet-400 mt-0.5 shrink-0" />
            <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-semibold">
              {user.matchReason}
            </p>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between gap-3 mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
        <Link href={`/profile/${user.username}`}>
          <Button variant="outline" size="sm" className="text-xs font-bold rounded-lg h-9">
            View Profile
          </Button>
        </Link>

        {isRequestSent ? (
          <Button
            onClick={() => requestId && onCancelRequest(requestId)}
            variant="outline"
            size="sm"
            disabled={isPendingAction}
            className="flex items-center gap-1.5 h-9 rounded-lg px-3 text-xs border-red-500/20 hover:border-red-500 hover:bg-red-500/5 text-red-500 hover:text-red-650 dark:hover:text-red-400 cursor-pointer font-bold"
          >
            <X className="w-3.5 h-3.5" />
            Cancel Request
          </Button>
        ) : (
          <Button
            onClick={() => onSendRequest(user.id)}
            variant="primary"
            size="sm"
            disabled={isPendingAction}
            className="flex items-center gap-1.5 h-9 rounded-lg px-3 text-xs font-bold shadow-md shadow-violet-500/15"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Friend
          </Button>
        )}
      </div>
    </motion.div>
  );
};
export default SuggestionCard;
