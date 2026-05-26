'use client';

import React from 'react';

interface FeedTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'for-you', label: 'For You' },
    { id: 'friends', label: 'Friends' },
    { id: 'trending', label: 'Trending' },
  ];

  return (
    <div className="flex bg-zinc-100/50 dark:bg-zinc-900/60 p-1 rounded-xl w-full max-w-sm mb-6 border border-zinc-200/20">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
              isActive
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
export default FeedTabs;
