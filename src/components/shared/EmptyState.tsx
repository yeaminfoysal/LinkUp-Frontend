import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from '../ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <HelpCircle className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto my-12 animate-slide-up">
      <div className="w-20 h-20 rounded-full bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center mb-5 border border-zinc-100 dark:border-zinc-800">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
