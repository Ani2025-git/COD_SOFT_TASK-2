'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NotificationLog } from '@/lib/types';
import { X, Mail, Clock, Send, Eye, CheckCircle2 } from 'lucide-react';

export default function EmailModal() {
  const { emailModalOpen, setEmailModalOpen, user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<NotificationLog | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailModalOpen) {
      fetchNotifications();
    }
  }, [emailModalOpen, user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const email = user?.email;
      const res = await fetch(`/api/notifications${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        if (data.notifications.length > 0) {
          setSelectedNotif(data.notifications[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!emailModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Live Email Notification Logs
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                  Simulated Service
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspect triggered automated emails sent to candidates and employers.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEmailModalOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[400px]">
          {/* Left Email List */}
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-950/30">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500">Loading notification log...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No email notifications dispatched yet. Submit an application or update a status to generate emails!
              </div>
            ) : (
              notifications.map((notif) => {
                const isSelected = selectedNotif?.id === notif.id;
                return (
                  <button
                    key={notif.id}
                    onClick={() => setSelectedNotif(notif)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500/50 shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        {notif.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate mb-0.5">{notif.subject}</p>
                    <p className="text-[11px] text-slate-400 truncate">To: {notif.toName} ({notif.toEmail})</p>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Preview Detail */}
          <div className="md:col-span-7 p-6 overflow-y-auto bg-slate-900">
            {selectedNotif ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Subject:</span>
                    <span className="font-semibold text-white">{selectedNotif.subject}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Recipient:</span>
                    <span className="font-semibold text-emerald-400">
                      {selectedNotif.toName} &lt;{selectedNotif.toEmail}&gt;
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Sent At:</span>
                    <span className="text-slate-300">{new Date(selectedNotif.sentAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Rendered Email Body Preview
                  </p>
                  <div
                    className="prose prose-invert prose-sm text-slate-200"
                    dangerouslySetInnerHTML={{ __html: selectedNotif.bodyHtml }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Select an email log to view its content.
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Ready for live SMTP / Resend integration
          </span>
          <button
            onClick={() => setEmailModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
