'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AISearchBar } from '../../../components/modules/discovery/AISearchBar';
import { MatchCard } from '../../../components/modules/discovery/MatchCard';
import { DiscoverySkeleton } from '../../../components/modules/discovery/DiscoverySkeleton';
import { DiscoveryEmptyState } from '../../../components/modules/discovery/DiscoveryEmptyState';
import { useAISearch } from '../../../hooks/useAIDiscovery';
import { AxiosError } from 'axios';

export default function AIDiscoveryPage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { mutate: searchUsers, data: results, isPending, error } = useAISearch();

  const handleSearch = () => {
    if (query.trim().length >= 3) {
      setHasSearched(true);
      searchUsers(query.trim());
    }
  };

  const getErrorToast = () => {
    if (!error) return null;
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 429) {
      return "Too many searches. Please wait a minute and try again.";
    }
    return "Failed to search. Please try again.";
  };

  const errorMessage = getErrorToast();

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          AI-Powered Discovery
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
          Describe who you are looking for in natural language, and our AI will find the best matches based on skills, experience, and interests.
        </p>
      </motion.div>

      {/* Search Bar Section */}
      <div className="mb-6 relative">
        <AISearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          isLoading={isPending}
        />
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center border border-red-200 dark:border-red-900/50">
          {errorMessage}
        </div>
      )}

      {/* Main Content Area */}
      <div className="mt-8">
        {isPending ? (
          <DiscoverySkeleton />
        ) : hasSearched && results && results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {results.map((user) => (
              <MatchCard key={user.id} user={user} />
            ))}
          </motion.div>
        ) : (
          <DiscoveryEmptyState hasSearched={hasSearched && !!results && results.length === 0} query={query} />
        )}
      </div>
    </div>
  );
}
