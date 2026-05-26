'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';
import { useUnreadCount } from '../../hooks/useUnreadCount';
import Avatar from './Avatar';
import useAuth from '../../modules/auth/hooks/useAuth';
import {
  Home,
  MessageSquare,
  Users,
  User,
  Bell,
  Bookmark,
  Settings,
  LogOut,
  Moon,
  Sun,
  Layers,
  Search,
  Users2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { theme, toggleTheme, setSidebarOpen } = useUIStore();
  const { unreadMessagesCount, unreadNotificationsCount } = useUnreadCount();

  const menuItems = [
    { label: 'Home Feed', href: '/feed', icon: Home },
    { label: 'Messages', href: '/messages', icon: MessageSquare, badge: unreadMessagesCount },
    { label: 'Friends', href: '/friends', icon: Users },
    { label: 'Groups', href: '/groups', icon: Users2 },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadNotificationsCount },
    { label: 'Saved', href: '/saved', icon: Bookmark },
    { label: 'Profile', href: `/profile/${user?.username || ''}`, icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-[280px] h-full border-r border-zinc-150 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md flex flex-col justify-between p-4 flex-shrink-0 z-30 select-none">
      <div className="space-y-6">
        {/* Header Logo */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            LinkUp
          </span>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-500/10 text-violet-500 dark:text-violet-400 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-violet-500 dark:text-violet-400' : 'text-zinc-400'}`} />
                  {item.label}
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-red-500 text-white font-bold text-[10px] min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center shadow-sm shadow-red-500/25 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 space-y-4">
        {/* Quick Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            Appearance
          </span>
          <span className="uppercase text-[9px] tracking-wider font-bold bg-zinc-150 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-600 dark:text-zinc-400">
            {theme}
          </span>
        </button>

        {/* User Badge Info */}
        {user && (
          <div className="flex items-center justify-between gap-2 px-1">
            <Link href={`/profile/${user.username}`} className="flex items-center gap-3 min-w-0">
              <Avatar src={user.avatar} name={user.name} size="sm" isOnline={true} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-zinc-500 truncate leading-tight">@{user.username}</p>
              </div>
            </Link>

            <button
              onClick={() => logout()}
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer flex-shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
