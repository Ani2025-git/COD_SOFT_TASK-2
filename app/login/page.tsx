'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, Building2, User as UserIcon, Lock, Mail, ArrowRight, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsEmployer, loginAsCandidate } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isRegister ? 'register' : 'login',
          email,
          password,
          role,
          name,
          companyName: role === 'employer' ? companyName : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Auth failed');
      }

      login(data.token, data.user);

      if (data.user.role === 'employer') {
        router.push('/employer/dashboard');
      } else {
        router.push('/candidate/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-800/60 space-y-2 text-center shadow-lg">
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 flex items-center justify-center gap-1">
          <Zap className="h-3.5 w-3.5 text-amber-400" /> Instant Demo Access
        </span>
        <p className="text-xs text-slate-300">Test all features instantly with pre-loaded profiles:</p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={async () => {
              await loginAsCandidate();
              router.push('/candidate/dashboard');
            }}
            className="py-2 px-3 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 text-xs font-semibold hover:border-emerald-500/50 transition"
          >
            Demo Candidate
          </button>
          <button
            onClick={async () => {
              await loginAsEmployer();
              router.push('/employer/dashboard');
            }}
            className="py-2 px-3 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:bg-emerald-400 transition"
          >
            Demo Employer
          </button>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isRegister ? 'Create JobConnect Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? 'Sign up to apply for jobs or hire top engineers' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  role === 'candidate'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400'
                }`}
              >
                <UserIcon className="h-3.5 w-3.5" /> Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  role === 'employer'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" /> Employer
              </button>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {isRegister && role === 'employer' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Vercel Inc."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-xs text-slate-950 shadow-glow-emerald hover:from-emerald-400 hover:to-teal-500 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegister(false)} className="text-emerald-400 font-semibold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsRegister(true)} className="text-emerald-400 font-semibold hover:underline">
                Register Now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
