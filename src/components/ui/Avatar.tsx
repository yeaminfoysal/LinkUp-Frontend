'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'U', size = 'md', className = '' }) => {
  const [error, setError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-10 h-10 text-[14px]',
    lg: 'w-12 h-12 text-[16px]',
    xl: 'w-20 h-20 text-[24px]',
  };

  const getInitials = (n: string) => {
    return n.trim().substring(0, 2).toUpperCase();
  };

  // Harmonious gradient colors for fallbacks
  const colors = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-teal-500 to-emerald-500',
    'from-amber-500 to-orange-500',
  ];

  // Pick a stable gradient index based on character code sum
  const sumChar = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorGradient = colors[sumChar % colors.length];

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center font-bold text-white select-none shadow-sm flex-shrink-0 ${
        sizeClasses[size]
      } ${className}`}
    >
      {src && !error ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-tr ${colorGradient} flex items-center justify-center`}>
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};
export default Avatar;
