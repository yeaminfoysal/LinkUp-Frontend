'use client';

import React from 'react';
import BaseAvatar, { AvatarProps } from '../ui/Avatar';

interface SharedAvatarProps extends AvatarProps {
  isOnline?: boolean;
}

export const Avatar: React.FC<SharedAvatarProps> = ({ isOnline = false, ...props }) => {
  const dotSizes = {
    xs: 'w-2 h-2 border-[1.5px] bottom-0 right-0',
    sm: 'w-2.5 h-2.5 border-[2px] bottom-0 right-0',
    md: 'w-3 h-3 border-[2px] bottom-0 right-0',
    lg: 'w-3.5 h-3.5 border-[2.5px] bottom-0 right-0.5',
    xl: 'w-5.5 h-5.5 border-[3px] bottom-1 right-1',
  };

  return (
    <div className="relative inline-block">
      <BaseAvatar {...props} />
      {isOnline && (
        <span
          className={`absolute rounded-full bg-green-500 border-white dark:border-zinc-950 animate-pulse ${
            dotSizes[props.size || 'md']
          }`}
          title="Online"
        />
      )}
    </div>
  );
};
export default Avatar;
