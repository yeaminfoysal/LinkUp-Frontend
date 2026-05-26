import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'circle' | 'rect' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const base = 'bg-zinc-200 dark:bg-zinc-800 animate-pulse';
  const variantStyles = {
    circle: 'rounded-full',
    rect: 'rounded-xl',
    text: 'h-4 rounded-md w-full',
  };

  return <div className={`${base} ${variantStyles[variant]} ${className}`} />;
};

export default Skeleton;
