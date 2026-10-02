"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Welcome</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your ONAA account</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-center font-semibold text-slate-950 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-cyan-300 hover:text-cyan-200">
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}
