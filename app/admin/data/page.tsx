'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Database, FileText, Users, Briefcase, Mail, Download, RefreshCw, ArrowLeft, Search, Eye } from 'lucide-react';

export default function AdminDataExplorerPage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'notifications'>('jobs');
  const [jobsData, setJobsData] = useState<any[]>([]);
  const [applicationsData, setApplicationsData] = useState<any[]>([]);
  const [notificationsData, setNotificationsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllBackendData();
  }, []);

  const fetchAllBackendData = async () => {
    setLoading(true);
    try {
      const [resJobs, resApps, resNotifs] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/applications'),
        fetch('/api/notifications')
      ]);

      const dataJobs = await resJobs.json();
      const dataApps = await resApps.json();
      const dataNotifs = await resNotifs.json();

      if (dataJobs.jobs) setJobsData(dataJobs.jobs);
      if (dataApps.applications) setApplicationsData(dataApps.applications);
      if (dataNotifs.notifications) setNotificationsData(dataNotifs.notifications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    const fullState = {
      jobs: jobsData,
      applications: applicationsData,
      notifications: notificationsData,
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jobconnect_backend_database_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              Backend Database Explorer
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Live Data Inspector
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Directly view, search, and export all backend database records (Jobs, Applications, Email Logs).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllBackendData}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-slate-950 text-xs shadow-glow-emerald hover:from-emerald-400 hover:to-teal-500 transition flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export DB JSON
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'jobs'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="h-4 w-4" /> Jobs Collection ({jobsData.length})
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'applications'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" /> Applications Collection ({applicationsData.length})
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'notifications'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="h-4 w-4" /> Email Logs ({notificationsData.length})
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-white uppercase tracking-wider">
            Collection View: {activeTab.toUpperCase()}
          </span>
          <span>
            Total Entries: {activeTab === 'jobs' ? jobsData.length : activeTab === 'applications' ? applicationsData.length : notificationsData.length}
          </span>
        </div>

        <div className="p-4 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading database records...</div>
          ) : (
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px]">
              {JSON.stringify(
                activeTab === 'jobs'
                  ? jobsData.filter((j) => !searchTerm || JSON.stringify(j).toLowerCase().includes(searchTerm.toLowerCase()))
                  : activeTab === 'applications'
                  ? applicationsData.filter((a) => !searchTerm || JSON.stringify(a).toLowerCase().includes(searchTerm.toLowerCase()))
                  : notificationsData.filter((n) => !searchTerm || JSON.stringify(n).toLowerCase().includes(searchTerm.toLowerCase())),
                null,
                2
              )}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
