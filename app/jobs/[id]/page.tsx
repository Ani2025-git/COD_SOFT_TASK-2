'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Job } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import ApplyModal from '@/components/ApplyModal';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Globe,
  Building2,
  ArrowLeft,
  Share2,
  Zap,
  ShieldCheck,
  Users,
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toggleSaveJob, isSaved } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchJobDetails(params.id as string);
    }
  }, [params.id]);

  const fetchJobDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();
      if (data.job) {
        setJob(data.job);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-10 w-48 mx-auto bg-slate-900 animate-pulse rounded-xl" />
        <div className="h-64 w-full bg-slate-900 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Briefcase className="mx-auto h-12 w-12 text-slate-600" />
        <h2 className="text-xl font-bold text-white">Job Position Not Found</h2>
        <p className="text-xs text-slate-400">The position you are looking for may have expired or been removed.</p>
        <Link
          href="/jobs"
          className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          Back to All Jobs
        </Link>
      </div>
    );
  }

  const saved = isSaved(job.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Job Search
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120'}
              alt={job.companyName}
              className="h-16 w-16 rounded-2xl object-cover border border-slate-800 bg-slate-950 p-1.5 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">{job.companyName}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                  {job.department}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  {job.location}
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <Users className="h-4 w-4" />
                  {job.applicantCount} Applicants
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white transition relative"
              title="Share job link"
            >
              <Share2 className="h-5 w-5" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Copied!
                </span>
              )}
            </button>

            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`p-3 rounded-xl border transition ${
                saved
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
              }`}
              title={saved ? 'Unsave Job' : 'Save Job'}
            >
              {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setApplyModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-sm shadow-glow-emerald hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:-translate-y-0.5"
            >
              Apply For Position
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span className="font-bold">${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
            <span className="text-slate-400">/ year</span>
          </div>

          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400">
            {job.type}
          </div>

          <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 text-xs font-bold text-indigo-400">
            {job.experienceLevel}
          </div>

          {job.isRemote && (
            <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-xs font-bold text-cyan-400">
              100% Remote Option
            </div>
          )}

          {job.urgent && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 text-xs font-bold text-rose-400 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" /> Urgent Requirement
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">About The Role</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Requirements & Qualifications</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Key Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.perks && job.perks.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Benefits & Employee Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.perks.map((perk, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 sticky top-20">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
              Company Snapshot
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120'}
                alt={job.companyName}
                className="h-12 w-12 rounded-xl object-cover border border-slate-800 bg-slate-950 p-1"
              />
              <div>
                <h4 className="font-bold text-white text-base">{job.companyName}</h4>
                <p className="text-xs text-slate-400">Verified Tech Employer</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Category:</span>
                <span className="font-medium text-white">{job.category}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Location:</span>
                <span className="font-medium text-white">{job.location}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Applicants:</span>
                <span className="font-bold text-emerald-400">{job.applicantCount} candidates</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">Required Skills / Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((t) => (
                  <span key={t} className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setApplyModalOpen(true)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-xs text-slate-950 shadow-glow-emerald transition"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}
