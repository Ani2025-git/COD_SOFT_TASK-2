'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Application, Job } from '@/lib/types';
import ApplyModal from '@/components/ApplyModal';
import {
  BookmarkCheck,
  FileText,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Mail,
  User as UserIcon,
  UploadCloud,
  ChevronRight,
  Zap,
} from 'lucide-react';

const STATUS_STEPS = ['Submitted', 'Under Review', 'Interviewing', 'Accepted'];

export default function CandidateDashboard() {
  const { user, token, loginAsCandidate, setEmailModalOpen, refreshUser, isSaved, toggleSaveJob } = useAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'profile'>('applications');

  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillsStr, setSkillsStr] = useState(user?.skills ? user.skills.join(', ') : 'React, Node.js, TypeScript, Next.js');
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFileName || 'Alex_Rivera_Senior_FullStack_Resume.pdf');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'candidate' && token) {
      fetchCandidateData();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchCandidateData = async () => {
    setLoading(true);
    try {
      const resApps = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataApps = await resApps.json();
      if (dataApps.applications) setApplications(dataApps.applications);

      const resSaved = await fetch('/api/saved-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataSaved = await resSaved.json();
      if (dataSaved.savedJobs) setSavedJobs(dataSaved.savedJobs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          headline,
          bio,
          skills: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
          resumeFileName,
        }),
      });
      if (res.ok) {
        await refreshUser();
        alert('Candidate profile updated successfully!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (!user || user.role !== 'candidate') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <UserIcon className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Candidate Account Required</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          You are currently not logged in as a candidate. Click below to instantly log in as our demo job seeker ("Alex Rivera").
        </p>
        <button
          onClick={loginAsCandidate}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-slate-950 text-xs shadow-glow-emerald hover:from-emerald-400 hover:to-teal-500 transition"
        >
          Switch to Demo Candidate Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-glow-emerald"
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              {user.name}
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Job Seeker
              </span>
            </h1>
            <p className="text-xs text-emerald-400 font-medium">{user.headline || 'Full-Stack Software Developer'}</p>
            <p className="text-xs text-slate-400 max-w-xl">{user.bio || 'Building modern web applications.'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEmailModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2"
          >
            <Mail className="h-4 w-4 text-emerald-400" /> View Email Notifications
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'applications'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" /> Submitted Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'saved'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookmarkCheck className="h-4 w-4" /> Bookmarked Jobs ({savedJobs.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'profile'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserIcon className="h-4 w-4" /> Edit Profile & Resume
        </button>
      </div>

      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <Briefcase className="mx-auto h-10 w-10 text-slate-600" />
              <h3 className="text-lg font-bold text-white">No Applications Submitted Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore open developer jobs and apply with your uploaded resume!
              </p>
              <Link
                href="/jobs"
                className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Browse Job Openings
              </Link>
            </div>
          ) : (
            applications.map((app) => {
              const currentStepIndex = STATUS_STEPS.indexOf(app.status);
              const isRejected = app.status === 'Rejected';

              return (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400">{app.companyName}</span>
                      <h3 className="text-lg font-bold text-white">{app.jobTitle}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isRejected
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {!isRejected && (
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 relative">
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = idx <= currentStepIndex;
                          return (
                            <div key={step} className="flex flex-col items-center space-y-1 text-center">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                                    : 'bg-slate-950 text-slate-600 border border-slate-800'
                                }`}
                              >
                                {idx + 1}
                              </div>
                              <span
                                className={`text-[11px] font-medium ${
                                  isDone ? 'text-emerald-400 font-bold' : 'text-slate-500'
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {app.notes && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                      <span className="font-semibold text-white">Employer Feedback: </span>
                      {app.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-emerald-400" />
                      Resume: {app.resumeFileName}
                    </span>
                    <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedJobs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              No saved jobs found. Click the bookmark icon on any job card to save it here!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                >
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">{job.companyName}</span>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-white">{job.title}</h3>
                    <p className="text-xs text-slate-400">{job.location} &bull; ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-xs text-emerald-400 font-semibold hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setApplyModalOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 max-w-2xl">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Update Candidate Profile</h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Headline / Role Title</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bio Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Top Skills (Comma separated)</label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Default Resume File Name</label>
            <input
              type="text"
              value={resumeFileName}
              onChange={(e) => setResumeFileName(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updatingProfile}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:bg-emerald-400 transition"
            >
              {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      <ApplyModal
        job={selectedJob}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
}
