import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full py-2.5 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/25 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm ${
              icon ? 'pl-11' : 'pl-4'
            } ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium mt-1 animate-slide-up">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
