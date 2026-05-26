import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 overflow-hidden transition-all duration-200 ${
        hoverable ? 'hover:shadow-lg dark:hover:shadow-black/50 hover:-translate-y-0.5 hover:border-zinc-200 dark:hover:border-zinc-800/80 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800 mb-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`flex items-center justify-between pt-4 border-t border-zinc-150 dark:border-zinc-800 mt-4 ${className}`}>{children}</div>;
};

export default Card;
