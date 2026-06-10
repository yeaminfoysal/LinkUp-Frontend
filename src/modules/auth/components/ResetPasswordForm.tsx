'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, KeyRound } from 'lucide-react';
import authService from '../services/auth.service';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Fields = z.infer<typeof schema>;

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Fields) => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await authService.resetPassword(token, data.password);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel animate-slide-up shadow-2xl relative overflow-hidden text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Invalid Link</h2>
        <p className="text-zinc-500 mb-6">The password reset link is missing a valid token.</p>
        <Link href="/auth/forgot-password" className="text-violet-500 hover:text-violet-600 font-semibold">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl glass-panel animate-slide-up shadow-2xl relative overflow-hidden">
      {/* Background Gradient Accents */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="flex flex-col items-center mb-8 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4">
          <KeyRound className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Set New Password</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center">
          Enter your new password below.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-slide-up">
          {error}
        </div>
      )}

      {success ? (
        <div className="space-y-6 relative z-10">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-slide-up text-center">
            Your password has been successfully reset!
          </div>
          <Link href="/auth/login" className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:brightness-110 transition-all flex items-center justify-center">
            Log in with new password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/25 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/25 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      )}
    </div>
  );
};
export default ResetPasswordForm;
