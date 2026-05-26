import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'destructive' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold tracking-wide select-none';
  const variants = {
    primary: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20',
    secondary: 'bg-zinc-150 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
    destructive: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    outline: 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400',
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
};
export default Badge;
