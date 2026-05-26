'use client';

import React from 'react';
import Tabs from '../../../components/ui/Tabs';

interface FriendTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
  pendingCount?: number;
}

export const FriendTabs: React.FC<FriendTabsProps> = ({ activeTab, onChange, pendingCount = 0 }) => {
  const tabs = [
    { id: 'all', label: 'All Friends' },
    { id: 'pending', label: 'Pending Requests', count: pendingCount },
    { id: 'sent', label: 'Sent Requests' },
    { id: 'suggestions', label: 'Suggestions' },
  ];

  return <Tabs tabs={tabs} activeTab={activeTab} onChange={onChange} className="mb-6" />;
};
export default FriendTabs;
