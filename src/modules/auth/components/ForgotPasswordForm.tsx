'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Mail, Loader2, KeyRound } from 'lucide-react';
import authService from '../services/auth.service';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type Fields = z.infer<typeof schema>;

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Fields) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl glass-panel animate-slide-up shadow-2xl relative overflow-hidden">
      {/* Background Gradient Accents */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="flex flex-col items-center mb-8 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4">
          <KeyRound className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Forgot Password</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center">
          Enter your email and we'll send you a link to reset your password.
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
            If that email exists in our system, we've sent a password reset link to it. Please check your inbox.
          </div>
          <Link href="/auth/login" className="w-full py-3.5 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center">
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/25 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400 relative z-10">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-bold text-violet-500 hover:text-violet-600 transition-colors">
              Log in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
export default ForgotPasswordForm;
