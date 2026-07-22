'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Job, Application, ApplicationStatus } from '@/lib/types';
import {
  Building2,
  PlusCircle,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Trash2,
  Edit,
  Mail,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function EmployerDashboard() {
  const { user, token, loginAsEmployer, setEmailModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [employerNotes, setEmployerNotes] = useState('');

  useEffect(() => {
    if (user?.role === 'employer' && token) {
      fetchEmployerData();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchEmployerData = async () => {
    setLoading(true);
    try {
      const resJobs = await fetch(`/api/jobs?employerId=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataJobs = await resJobs.json();
      if (dataJobs.jobs) setJobs(dataJobs.jobs);

      const resApps = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataApps = await resApps.json();
      if (dataApps.applications) setApplications(dataApps.applications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    setUpdatingAppId(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          notes: employerNotes || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus, notes: employerNotes || a.notes } : a))
        );
        if (selectedApp?.id === appId) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user || user.role !== 'employer') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Building2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Employer Access Required</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          You are currently not logged in as an Employer. Click below to instantly log in as our demo hiring manager ("Sarah Jenkins - Nexus Tech").
        </p>
        <button
          onClick={loginAsEmployer}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-slate-950 text-xs shadow-glow-emerald hover:from-emerald-400 hover:to-teal-500 transition"
        >
          Switch to Demo Employer Account
        </button>
      </div>
    );
  }

  const filteredApps = statusFilter === 'All'
    ? applications
    : applications.filter((a) => a.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user.companyLogo || user.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120'}
            alt={user.companyName}
            className="h-14 w-14 rounded-2xl object-cover border border-slate-800 bg-slate-950 p-1"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              {user.companyName || 'Employer Dashboard'}
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Verified Recruiter
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your active hiring pipelines, candidate resumes, and status updates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/employer/post-job"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-glow-emerald hover:from-emerald-400 hover:to-teal-500 transition flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Post New Job Opening
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Openings</span>
          <p className="text-2xl font-extrabold text-white">{jobs.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Applicants</span>
          <p className="text-2xl font-extrabold text-emerald-400">{applications.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Under Review</span>
          <p className="text-2xl font-extrabold text-cyan-400">
            {applications.filter((a) => a.status === 'Under Review' || a.status === 'Submitted').length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Shortlisted / Interviewing</span>
          <p className="text-2xl font-extrabold text-purple-400">
            {applications.filter((a) => a.status === 'Interviewing' || a.status === 'Accepted').length}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'jobs'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="h-4 w-4" /> Manage Job Postings ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('applicants')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'applicants'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" /> Candidate Applications ({applications.length})
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <Briefcase className="mx-auto h-10 w-10 text-slate-600" />
              <h3 className="text-lg font-bold text-white">No Job Postings Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create your first job listing to start receiving qualified candidate resumes!
              </p>
              <Link
                href="/employer/post-job"
                className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
              >
                Create Job Posting
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">{job.department}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-xs text-emerald-400 font-semibold">{job.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                      <span>{job.location}</span>
                      <span>&bull;</span>
                      <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} USD</span>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-bold">{job.applicantCount} Applicant(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
                    >
                      <Eye className="h-4 w-4 text-emerald-400" /> View Public Page
                    </Link>

                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-400 hover:bg-rose-900 transition"
                      title="Delete Posting"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'applicants' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter Status:
            </span>
            {['All', 'Submitted', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                  statusFilter === st
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3">
              {filteredApps.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                  No applicant records match the selected filter.
                </div>
              ) : (
                filteredApps.map((app) => {
                  const isSelected = selectedApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        setSelectedApp(app);
                        setEmployerNotes(app.notes || '');
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500/50 shadow-md'
                          : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-base font-bold text-white">{app.candidateName}</h4>
                          <p className="text-xs text-emerald-400 font-medium">{app.candidateHeadline || 'Candidate'}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-300">
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-400">Position: {app.jobTitle}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 mt-2">
                        <span>{app.candidateEmail}</span>
                        <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="lg:col-span-6">
              {selectedApp ? (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 sticky top-20">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedApp.candidateName}</h3>
                      <p className="text-xs text-slate-400">{selectedApp.candidateEmail} &bull; {selectedApp.candidatePhone}</p>
                    </div>
                    <button
                      onClick={() => setEmailModalOpen(true)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1"
                    >
                      <Mail className="h-3.5 w-3.5" /> Sent Emails
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Update Application Status (Triggers Automated Candidate Email)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Under Review', 'Interviewing', 'Accepted', 'Rejected'] as ApplicationStatus[]).map((st) => (
                        <button
                          key={st}
                          disabled={updatingAppId === selectedApp.id}
                          onClick={() => handleUpdateStatus(selectedApp.id, st)}
                          className={`py-2 rounded-xl text-xs font-bold border transition ${
                            selectedApp.status === st
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300">Employer Internal Notes</label>
                    <textarea
                      rows={2}
                      value={employerNotes}
                      onChange={(e) => setEmployerNotes(e.target.value)}
                      placeholder="Add screening feedback or interview notes..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        {selectedApp.resumeFileName}
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                        Verified PDF/DOC
                      </span>
                    </div>
                    {selectedApp.portfolioUrl && (
                      <p className="text-xs text-slate-400">
                        Portfolio: <a href={selectedApp.portfolioUrl} target="_blank" rel="noreferrer" className="text-emerald-400 underline">{selectedApp.portfolioUrl}</a>
                      </p>
                    )}
                  </div>

                  {selectedApp.coverLetter && (
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-400">Candidate Cover Letter</label>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                        {selectedApp.coverLetter}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 text-xs">
                  Select an applicant on the left to review their resume and update status.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
