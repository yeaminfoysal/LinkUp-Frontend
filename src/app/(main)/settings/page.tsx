'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { useTheme } from 'next-themes';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/shared/Avatar';
import { Settings, Moon, Sun, Monitor, Shield, Bell, User, Check } from 'lucide-react';
import toast from '../../../components/ui/Toast';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : 'dark';

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
          <Settings className="w-5.5 h-5.5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h2>
          <p className="text-xs text-zinc-400">Configure your appearance, notifications, and account credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left columns - settings sections */}
        <div className="md:col-span-2 space-y-6">
          {/* 1. Profile mini summary card */}
          {user && (
            <div className="rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-violet-500" />
                Account Overview
              </h3>
              <div className="flex items-center gap-4">
                <Avatar src={user.avatar} name={user.name} size="lg" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{user.name}</h4>
                  <p className="text-xs text-zinc-500">@{user.username}</p>
                  <p className="text-xs text-zinc-400 mt-1">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Appearance theme selectors */}
          <div className="rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Sun className="w-4.5 h-4.5 text-violet-500" />
              Appearance Theme
            </h3>
            <p className="text-xs text-zinc-500 leading-normal">
              Select your visual style. Toggle between light mode for high-contrast viewing or dark mode for reduced strain.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Light Theme Option */}
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 cursor-pointer text-center transition-all duration-200 ${
                  currentTheme === 'light'
                    ? 'border-violet-500 bg-violet-500/5 text-violet-650'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm shadow-amber-500/10">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Light Theme</span>
                  <span className="text-[10px] opacity-75 mt-0.5 block">Default clean interface</span>
                </div>
              </button>

              {/* Dark Theme Option */}
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 cursor-pointer text-center transition-all duration-200 ${
                  currentTheme === 'dark'
                    ? 'border-violet-500 bg-violet-500/5 text-violet-400'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 shadow-sm shadow-violet-500/10">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Dark Theme</span>
                  <span className="text-[10px] opacity-75 mt-0.5 block">Midnight immersive style</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right column - Quick tips or additional settings info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/25 p-5 space-y-4">
            <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-violet-500" />
              Security Tips
            </h4>
            <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-2.5 leading-relaxed">
              <li>• Always rotate passwords regularly to ensure security.</li>
              <li>• Do not share your JWT tokens or authentication keys.</li>
              <li>• Logging out terminates socket channels and revokes access.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="flex justify-end pt-4 border-t border-zinc-150 dark:border-zinc-800">
        <Button onClick={handleSaveSettings} variant="primary" className="py-2.5 px-6 rounded-xl font-semibold">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
