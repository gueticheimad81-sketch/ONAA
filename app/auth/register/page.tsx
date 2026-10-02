"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import bcrypt from 'bcryptjs';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Join ONAA</h1>
          <p className="mt-2 text-sm text-slate-400">Create your marketplace account</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-cyan-300 hover:text-cyan-200">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
