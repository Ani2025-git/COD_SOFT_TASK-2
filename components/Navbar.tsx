'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  Search,
  PlusCircle,
  User as UserIcon,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  BookmarkCheck,
  Zap,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, loginAsEmployer, loginAsCandidate, setEmailModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-glow-emerald transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Briefcase className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Job<span className="text-emerald-400">Connect</span>
              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wide font-medium -mt-1">
              Tech Careers & Talent
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
          <Link
            href="/jobs"
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              isActive('/jobs')
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="h-4 w-4" />
            Browse Jobs
          </Link>

          {user?.role === 'employer' ? (
            <Link
              href="/employer/dashboard"
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                isActive('/employer/dashboard')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="h-4 w-4 text-emerald-400" />
              Employer Dashboard
            </Link>
          ) : (
            <Link
              href="/candidate/dashboard"
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                isActive('/candidate/dashboard')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookmarkCheck className="h-4 w-4 text-emerald-400" />
              Candidate Dashboard
            </Link>
          )}

          <button
            onClick={() => setEmailModalOpen(true)}
            className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-emerald-300 hover:bg-slate-800/60 transition-all"
            title="Inspect Email Notifications"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Mail className="h-3.5 w-3.5 text-emerald-400" />
            Email Logs
          </button>
        </nav>

        {/* Right Action Controls & User Profiles */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={loginAsCandidate}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition"
              >
                <Zap className="h-3 w-3 text-amber-400" />
                Demo Candidate
              </button>
              <button
                onClick={loginAsEmployer}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900 transition"
              >
                <Building2 className="h-3 w-3 text-emerald-400" />
                Demo Employer
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full bg-slate-900 p-1 pr-3 border border-slate-800 hover:border-slate-700 transition"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 p-1.5 border border-slate-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-medium text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                  </div>

                  {user.role === 'employer' ? (
                    <>
                      <Link
                        href="/employer/dashboard"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Building2 className="h-4 w-4 text-emerald-400" />
                        Employer Dashboard
                      </Link>
                      <Link
                        href="/employer/post-job"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <PlusCircle className="h-4 w-4 text-emerald-400" />
                        Post New Job
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/candidate/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 text-emerald-400" />
                      Candidate Profile & Applications
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-800"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {user?.role === 'employer' && (
            <Link
              href="/employer/post-job"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-slate-950 shadow-glow-emerald hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="h-4 w-4" />
              Post a Job
            </Link>
          )}

          {!user && (
            <Link
              href="/login"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:border-slate-600 hover:bg-slate-800 transition"
            >
              Log In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setEmailModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <Mail className="h-5 w-5 text-emerald-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/jobs"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search className="h-5 w-5 text-emerald-400" />
            Browse Job Listings
          </Link>

          {user?.role === 'employer' ? (
            <Link
              href="/employer/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building2 className="h-5 w-5 text-emerald-400" />
              Employer Dashboard
            </Link>
          ) : (
            <Link
              href="/candidate/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookmarkCheck className="h-5 w-5 text-emerald-400" />
              Candidate Dashboard
            </Link>
          )}

          <div className="pt-2 border-t border-slate-800 space-y-2">
            {!user ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      loginAsCandidate();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800"
                  >
                    Demo Candidate
                  </button>
                  <button
                    onClick={() => {
                      loginAsEmployer();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-800"
                  >
                    Demo Employer
                  </button>
                </div>
                <Link
                  href="/login"
                  className="block w-full text-center py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In / Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-900 py-2.5 font-medium"
              >
                <LogOut className="h-4 w-4" />
                Sign Out ({user.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
