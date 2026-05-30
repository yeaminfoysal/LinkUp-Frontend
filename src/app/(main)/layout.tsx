'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store';
import Sidebar from '../../components/shared/Sidebar';
import RightPanel from '../../components/shared/RightPanel';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, MessageSquare, Users, Bell, User, Menu } from 'lucide-react';
import { useUnreadCount } from '../../hooks/useUnreadCount';
import { useUIStore } from '../../store/ui.store';
import { useAuthHydration } from '../../hooks/useAuthHydration';
import { useFriends } from '../../modules/friends/hooks/useFriends';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { unreadMessagesCount, unreadNotificationsCount } = useUnreadCount();
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const isHydrated = useAuthHydration();
  const { pendingRequests } = useFriends();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  // Mobile Bottom Navigation items
  const navItems = [
    { label: 'Feed', href: '/feed', icon: Home },
    { label: 'Chat', href: '/messages', icon: MessageSquare, badge: unreadMessagesCount },
    { label: 'Friends', href: '/friends', icon: Users, badge: pendingRequests.length },
    { label: 'Alerts', href: '/notifications', icon: Bell, badge: unreadNotificationsCount },
    { label: 'Profile', href: `/profile/${user?.username || ''}`, icon: User },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-150 dark:border-zinc-800 backdrop-blur-md z-20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
              LinkUp
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-zinc-650 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
        </header>

        {/* Dynamic Page Component */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Right Context Panel - Hidden on Tablet/Mobile */}
      <RightPanel />

      {/* Mobile Bottom Navbar (Visible only on Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-zinc-950/90 border-t border-zinc-150 dark:border-zinc-800 backdrop-blur-md flex items-center justify-around px-2 z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all relative ${
                isActive
                  ? 'text-violet-500 dark:text-violet-400 font-bold scale-105'
                  : 'text-zinc-400 hover:text-zinc-500'
              }`}
            >
              <Icon className="w-5.5 h-5.5" />
              <span className="text-[9px] mt-0.5 tracking-wide font-medium">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
