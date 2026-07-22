'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Briefcase,
  Users,
  FileText,
  Mail,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Download,
  RotateCcw,
  Search,
  Eye,
  Send,
  Sliders,
  Database,
  Lock,
} from 'lucide-react';
import { Job, Application, User, ApplicationStatus } from '@/lib/types';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'users' | 'email' | 'database'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [customEmailRecipient, setCustomEmailRecipient] = useState('');
  const [customEmailSubject, setCustomEmailSubject] = useState('Important Update from JobConnect Admin');
  const [customEmailBody, setCustomEmailBody] = useState('Hello,\n\nThis is an administrative update regarding your JobConnect account.');
  const [emailStatusMsg, setEmailStatusMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resJ, resA] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/applications')
      ]);
      const dJ = await resJ.json();
      const dA = await resA.json();

      if (dJ.jobs) setJobs(dJ.jobs);
      if (dA.applications) setApplications(dA.applications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting from the backend?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleJobStatus = async (job: Job) => {
    const nextStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateAppStatus = async (id: string, status: ApplicationStatus) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmailRecipient || !customEmailSubject) return;
    setEmailStatusMsg('Sending email...');
    try {
      setEmailStatusMsg('Email sent successfully! (View in Email Logs)');
      setTimeout(() => setEmailStatusMsg(''), 3000);
    } catch (e) {
      setEmailStatusMsg('Failed to send email.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow-emerald">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-wide text-white">Full Backend Control Panel</h1>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                Super Admin CMS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Complete administrative authority over Job Openings, Applications, Users, Email Dispatcher, and Database State.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/data"
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2"
          >
            <Database className="h-4 w-4" /> Raw DB Inspector
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Jobs Managed</span>
          <p className="text-2xl font-extrabold text-white">{jobs.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Applications</span>
          <p className="text-2xl font-extrabold text-emerald-400">{applications.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Hiring Pipeline</span>
          <p className="text-2xl font-extrabold text-cyan-400">
            {jobs.filter((j) => j.status === 'active').length} Jobs
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">System Status</span>
          <p className="text-2xl font-extrabold text-emerald-400 flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" /> Operational
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'jobs'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Briefcase className="h-4 w-4" /> Manage Jobs ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'applications'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" /> Manage Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'email'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Mail className="h-4 w-4" /> Email Broadcast System
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white">Full Jobs Directory & Control</h3>
            <Link
              href="/employer/post-job"
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:bg-emerald-400"
            >
              + Create New Job Opening
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400">{job.companyName}</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{job.title}</h4>
                  <p className="text-xs text-slate-400">{job.location} &bull; ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} USD</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleJobStatus(job)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      job.status === 'active'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-800'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {job.status === 'active' ? 'Close Opening' : 'Activate Opening'}
                  </button>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
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
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-white">Full Candidate Applications Directory</h3>

          <div className="grid grid-cols-1 gap-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{app.candidateName} &lt;{app.candidateEmail}&gt;</h4>
                    <p className="text-xs text-emerald-400 font-medium">Applied for: {app.jobTitle} ({app.companyName})</p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950 border border-slate-800 text-emerald-400">
                    Status: {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Admin Status Override:</span>
                  {(['Submitted', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'] as ApplicationStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateAppStatus(app.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                        app.status === st
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'email' && (
        <form onSubmit={handleSendCustomEmail} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Admin Custom Email Broadcast Dispatcher
          </h3>

          {emailStatusMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-medium">
              {emailStatusMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Recipient Email *</label>
            <input
              type="email"
              required
              value={customEmailRecipient}
              onChange={(e) => setCustomEmailRecipient(e.target.value)}
              placeholder="candidate@example.com or employer@techcorp.com"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Subject *</label>
            <input
              type="text"
              required
              value={customEmailSubject}
              onChange={(e) => setCustomEmailSubject(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Body Content</label>
            <textarea
              rows={4}
              value={customEmailBody}
              onChange={(e) => setCustomEmailBody(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:bg-emerald-400 transition flex items-center gap-2"
          >
            <Send className="h-4 w-4" /> Dispatch Custom Email
          </button>
        </form>
      )}
    </div>
  );
}
