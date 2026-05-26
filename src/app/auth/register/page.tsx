import React from 'react';
import RegisterForm from '../../../modules/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[128px]" />
      
      {/* Decorative grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md flex flex-col items-center justify-center z-10">
        <RegisterForm />
      </div>
    </div>
  );
}
export const metadata = {
  title: 'Sign Up | LinkUp',
  description: 'Create a new LinkUp account to connect, chat, and share with friends.',
};
