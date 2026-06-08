'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, RefreshCw, UserCheck, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import useFriends from '../../../modules/friends/hooks/useFriends';
import SuggestionCard from '../../../modules/friends/components/SuggestionCard';
import EmptyState from '../../../components/shared/EmptyState';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { useAuthStore } from '../../../store/auth.store';

export default function SmartMatchesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isGlobalMode, setIsGlobalMode] = useState(false);

  useEffect(() => {
    if (user) {
      const profileFields = [
        user.university,
        user.profession,
        user.work_place,
        user.location,
        user.interests,
        user.skills
      ];
      const filledCount = profileFields.filter(field => field && field.trim() !== '').length;
      
      // If user has filled less than 1 fields, show warning
      if (filledCount < 1) {
        setShowWarningModal(true);
      }
    }
  }, [user]);

  const {
    sentRequests,
    sendRequest,
    cancelRequest,
    isLoadingSent,
  } = useFriends();

  // Fetch Smart Matches Suggestions
  const { 
    data: suggestions = [], 
    isLoading: isLoadingSuggestions, 
    isFetching,
    refetch 
  } = useQuery<any[]>({
    queryKey: ['suggestionsList', isGlobalMode],
    queryFn: async () => {
      const res = await api.get(`/users/suggestions?limit=20${isGlobalMode ? '&global=true' : ''}`);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const isLoading = isLoadingSuggestions || isLoadingSent;

  const handleRefresh = async () => {
    // Invalidate queries to ensure we fetch fresh friend status details
    queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    await refetch();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-650/10 via-indigo-650/10 to-blue-650/10 border border-violet-500/10 dark:border-violet-500/20 backdrop-blur-md relative overflow-hidden select-none">
        {/* Background Sparkles */}
        <div className="absolute right-0 top-0 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Smart Matches <span className="text-sm px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold border border-violet-500/10">PRO</span>
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
              Deterministic, real-time matching based on shared university, workplace, profession, location, skills, and interests.
            </p>
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-all cursor-pointer self-start sm:self-auto shrink-0 bg-white dark:bg-zinc-950"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Recalculating...' : 'Refresh Matches'}
        </Button>
      </div>

      {/* Grid Content */}
      {isLoading && suggestions.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 border border-zinc-100 dark:border-zinc-850 bg-white/50 dark:bg-zinc-900/50 rounded-2xl space-y-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-850" />
                <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-850 rounded-full" />
              </div>
              <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded w-1/3" />
              <div className="h-3.5 bg-zinc-200 dark:bg-zinc-850 rounded w-1/4" />
              <div className="h-14 bg-zinc-200 dark:bg-zinc-850 rounded-xl w-full" />
              <div className="flex justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-850 rounded-lg" />
                <div className="h-9 w-24 bg-zinc-200 dark:bg-zinc-850 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {suggestions.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {suggestions.map((candidate) => {
                // Determine request statuses
                const sentReq = sentRequests.find(
                  (req: any) => req.receiver?.id === candidate.id || req.receiverId === candidate.id
                );
                const isRequestSent = !!sentReq;
                const requestId = sentReq ? sentReq.id : null;

                return (
                  <SuggestionCard
                    key={candidate.id}
                    user={candidate}
                    isRequestSent={isRequestSent}
                    requestId={requestId}
                    onSendRequest={sendRequest}
                    onCancelRequest={cancelRequest}
                    isPendingAction={false}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EmptyState
                icon={<Sparkles className="w-14 h-14 text-zinc-300 dark:text-zinc-700 animate-pulse" />}
                title={isGlobalMode ? "No Global Suggestions" : "No Smart Matches Found"}
                description={isGlobalMode ? "We couldn't find any users to suggest right now." : "We couldn't find any users matching your details. Try filling out or expanding your profile info (workplace, university, profession, location, skills, interests) to discover connections."}
                action={{
                  label: 'Update My Profile',
                  onClick: () => router.push(`/profile/${user?.username}`),
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Profile Warning Modal */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
      >
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Incomplete Profile
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            To get accurate and meaningful <strong>Smart Matches</strong>, our AI needs to know more about you.
            <br /><br />
            Please add your <span className="font-semibold text-violet-500">university, profession, workplace, location, interests, and skills</span> in your profile settings.
          </p>
          <div className="w-full pt-4 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowWarningModal(false);
                  setIsGlobalMode(true);
                }}
                className="flex-1"
              >
                Explore Global
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowWarningModal(false);
                  router.push(`/profile/${user?.username}`);
                }}
                className="flex-1"
              >
                Update Profile
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowWarningModal(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
