'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Github, Globe, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Job<span className="text-emerald-400">Connect</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The modern tech career marketplace connecting innovative companies with world-class engineering and product talent.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:text-emerald-400 hover:bg-slate-800 transition"
                title="GitHub Repo Ready"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:text-emerald-400 hover:bg-slate-800 transition"
                title="Vercel Deployable"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-emerald-400 transition">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?remote=true" className="hover:text-emerald-400 transition">
                  Remote Openings
                </Link>
              </li>
              <li>
                <Link href="/candidate/dashboard" className="hover:text-emerald-400 transition">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Software+Engineering" className="hover:text-emerald-400 transition">
                  Engineering Roles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/employer/post-job" className="hover:text-emerald-400 transition">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link href="/employer/dashboard" className="hover:text-emerald-400 transition">
                  Employer ATS Dashboard
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Talent Search (Pro)</span>
              </li>
              <li>
                <span className="text-slate-500">Pricing & Sponsorship</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Deployment & Security
            </h4>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="h-4 w-4" />
                Vercel & GitHub Ready
              </div>
              <p className="text-[11px] text-slate-400">
                Built with Next.js 14, Node.js API routes, JWT security, and Tailwind CSS for 1-click Vercel hosting.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobConnect Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Crafted with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for modern web developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
