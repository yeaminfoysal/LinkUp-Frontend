'use client';

import React from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-zinc-150 dark:border-zinc-800 overflow-x-auto scrollbar-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative py-3.5 px-4 text-sm font-semibold whitespace-nowrap cursor-pointer transition-all duration-250 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-2 ${
              isActive
                ? 'text-violet-500 dark:text-violet-400 font-bold'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-violet-500/10 text-violet-500 dark:text-violet-400'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
export default Tabs;
