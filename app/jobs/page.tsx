'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Job } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import ApplyModal from '@/components/ApplyModal';
import {
  Search,
  MapPin,
  Filter,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  Zap,
  ChevronRight,
} from 'lucide-react';

function JobListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toggleSaveJob, isSaved } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [type, setType] = useState(searchParams.get('type') || 'All Types');
  const [experience, setExperience] = useState(searchParams.get('experience') || 'All Levels');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '0');
  const [isRemote, setIsRemote] = useState(searchParams.get('remote') === 'true');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [q, location, category, type, experience, minSalary, isRemote]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (location) params.set('location', location);
      if (category && category !== 'All Categories') params.set('category', category);
      if (type && type !== 'All Types') params.set('type', type);
      if (experience && experience !== 'All Levels') params.set('experience', experience);
      if (minSalary && minSalary !== '0') params.set('minSalary', minSalary);
      if (isRemote) params.set('remote', 'true');

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setQ('');
    setLocation('');
    setCategory('All Categories');
    setType('All Types');
    setExperience('All Levels');
    setMinSalary('0');
    setIsRemote(false);
    router.push('/jobs');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-emerald-400" />
            Explore Technical Job Openings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse active software development, product, and engineering roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </button>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="h-4 w-4 text-emerald-400" /> Filter Openings
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="React, Node, Lead..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="City or Remote..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option>All Categories</option>
                <option>Software Engineering</option>
                <option>Frontend Development</option>
                <option>Backend & Cloud</option>
                <option>UI/UX Design</option>
                <option>DevRel & Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option>All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option>All Levels</option>
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior Level</option>
                <option>Lead / Executive</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-slate-300 font-medium">Min Salary</span>
                <span className="text-emerald-400 font-bold">${parseInt(minSalary).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full accent-emerald-500 bg-slate-950"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs font-medium text-slate-300">Remote Only</span>
              <button
                type="button"
                onClick={() => setIsRemote(!isRemote)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isRemote ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isRemote ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white font-bold">{jobs.length}</strong> available position(s)
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <Briefcase className="mx-auto h-10 w-10 text-slate-600" />
              <h3 className="text-lg font-bold text-white">No Matching Jobs Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters to view all available tech openings.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
              {jobs.map((job) => {
                const saved = isSaved(job.id);
                return (
                  <div
                    key={job.id}
                    className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-emerald-500/50 shadow-lg transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120'}
                            alt={job.companyName}
                            className="h-11 w-11 rounded-xl object-cover border border-slate-800 bg-slate-950 p-1"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-400">{job.companyName}</p>
                            <a href={`/jobs/${job.id}`}>
                              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                                {job.title}
                              </h3>
                            </a>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className={`p-2 rounded-xl border transition ${
                            saved
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-0.5 text-xs text-slate-300 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                          {job.type}
                        </span>
                        <span className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-0.5 text-xs text-slate-300">
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {job.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {job.applicantCount} applicant(s)
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`/jobs/${job.id}`}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:bg-slate-800 transition"
                        >
                          View Details
                        </a>
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setApplyModalOpen(true);
                          }}
                          className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <ApplyModal
        job={selectedJob}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}

export default function JobListingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Loading jobs...</div>}>
      <JobListingsContent />
    </Suspense>
  );
}
