'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Job } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import ApplyModal from '@/components/ApplyModal';
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Zap,
  DollarSign,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Software Engineering', count: '42+ Jobs', icon: Layers, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Frontend Development', count: '28+ Jobs', icon: Sparkles, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { name: 'Backend & Cloud', count: '35+ Jobs', icon: TrendingUp, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { name: 'UI/UX Design', count: '19+ Jobs', icon: Building2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
];

export default function HomePage() {
  const router = useRouter();
  const { toggleSaveJob, isSaved } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.jobs) {
        setFeaturedJobs(data.jobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  return (
    <div className="relative min-h-screen space-y-20 pb-20">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-500/15 via-indigo-500/10 to-transparent blur-3xl opacity-60" />

      {/* Hero Section */}
      <section className="relative pt-16 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 shadow-glow-emerald animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Gen Full-Stack Career Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Engineering Role</span> or Hire World-Class Talent
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Connect directly with top tech companies. Real-time application tracking, verified employer openings, and instant status notifications.
        </p>

        {/* Hero Live Search Card */}
        <div className="max-w-4xl mx-auto pt-4">
          <form
            onSubmit={handleSearchSubmit}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl grid grid-cols-1 sm:grid-cols-12 gap-3"
          >
            <div className="sm:col-span-5 relative flex items-center">
              <Search className="absolute left-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Job title, tech stack (e.g. React, Node)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4 relative flex items-center">
              <MapPin className="absolute left-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="City, country, or Remote..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-full min-h-[48px] rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-sm text-slate-950 shadow-glow-emerald hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search Jobs
              </button>
            </div>
          </form>

          {/* Quick Trending Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <span className="font-medium text-slate-500">Popular:</span>
            {['React', 'Node.js', 'Next.js', 'Remote', 'Full-time', 'TypeScript'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  router.push(`/jobs?q=${encodeURIComponent(tag)}`);
                }}
                className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md">
          <div className="flex flex-col items-center p-3 text-center space-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-1">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-2xl font-extrabold text-white">1,250+</span>
            <span className="text-xs text-slate-400">Active Job Listings</span>
          </div>

          <div className="flex flex-col items-center p-3 text-center space-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-1">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-2xl font-extrabold text-white">480+</span>
            <span className="text-xs text-slate-400">Tech Employers</span>
          </div>

          <div className="flex flex-col items-center p-3 text-center space-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-1">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-2xl font-extrabold text-white">18,500+</span>
            <span className="text-xs text-slate-400">Active Job Seekers</span>
          </div>

          <div className="flex flex-col items-center p-3 text-center space-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-1">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-2xl font-extrabold text-white">96%</span>
            <span className="text-xs text-slate-400">Application Response Rate</span>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Explore by Category</h2>
            <p className="text-xs text-slate-400 mt-1">Browse open roles in top software engineering domains.</p>
          </div>
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            View All Categories <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => router.push(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                className="group flex flex-col justify-between p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl border ${cat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-emerald-400 transition">
                    {cat.count}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-emerald-300 transition">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Explore remote and onsite openings &rarr;</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-2xl font-extrabold text-white">Featured Job Openings</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Verified priority positions with fast-track response windows.</p>
          </div>
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            Explore All Openings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-900 animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredJobs.map((job) => {
              const saved = isSaved(job.id);
              return (
                <div
                  key={job.id}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-emerald-500/50 shadow-xl transition-all duration-300 hover:shadow-glow-emerald"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120'}
                          alt={job.companyName}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-800 bg-slate-950 p-1"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-400">{job.companyName}</p>
                          <Link href={`/jobs/${job.id}`}>
                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                              {job.title}
                            </h3>
                          </Link>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-2 rounded-xl border transition ${
                          saved
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                        title={saved ? 'Remove Bookmark' : 'Bookmark Job'}
                      >
                        {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                        {job.type}
                      </span>
                      <span className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-emerald-400" />
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                      </span>
                      {job.urgent && (
                        <span className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2 py-1 text-[10px] font-bold text-rose-400 flex items-center gap-1">
                          <Zap className="h-3 w-3" /> URGENT HIRING
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleApplyClick(job)}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Dual CTA Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden space-y-4">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
              <Briefcase className="h-48 w-48 text-emerald-400" />
            </div>
            <div className="inline-block rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              For Job Seekers
            </div>
            <h3 className="text-2xl font-extrabold text-white">Land Your Next Dream Role</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Build your candidate profile, save bookmarked jobs, and track your submitted application timeline with instant status email alerts.
            </p>
            <div className="pt-2">
              <Link
                href="/candidate/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
              >
                Go to Candidate Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-800/40 relative overflow-hidden space-y-4">
            <div className="inline-block rounded-lg bg-emerald-400 text-slate-950 px-3 py-1 text-xs font-bold">
              For Hiring Teams
            </div>
            <h3 className="text-2xl font-extrabold text-white">Post Openings & Review Talent</h3>
            <p className="text-xs text-emerald-200/70 leading-relaxed max-w-sm">
              Access candidate resumes, filter applicant statuses (Submitted, Under Review, Interview, Accepted), and notify candidates automatically.
            </p>
            <div className="pt-2">
              <Link
                href="/employer/post-job"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald hover:bg-emerald-300 transition"
              >
                Post a Job Opening <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ApplyModal
        job={selectedJob}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}
