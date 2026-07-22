'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loginAsEmployer: () => Promise<void>;
  loginAsCandidate: () => Promise<void>;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => Promise<boolean>;
  isSaved: (jobId: string) => boolean;
  emailModalOpen: boolean;
  setEmailModalOpen: (open: boolean) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('jobconnect_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        fetchSavedJobs(authToken);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async (authToken: string) => {
    try {
      const res = await fetch('/api/saved-jobs', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.savedJobIds) {
        setSavedJobIds(data.savedJobIds);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('jobconnect_token', newToken);
    setToken(newToken);
    setUser(newUser);
    fetchSavedJobs(newToken);
  };

  const logout = () => {
    localStorage.removeItem('jobconnect_token');
    setToken(null);
    setUser(null);
    setSavedJobIds([]);
  };

  const loginAsEmployer = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: 'employer@techcorp.com' }),
      });
      const data = await res.json();
      if (data.token && data.user) {
        login(data.token, data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loginAsCandidate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: 'alex.rivera@example.com' }),
      });
      const data = await res.json();
      if (data.token && data.user) {
        login(data.token, data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async (jobId: string): Promise<boolean> => {
    if (!token || !user) return false;
    try {
      const res = await fetch('/api/saved-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.savedJobIds) {
        setSavedJobIds(data.savedJobIds);
        return data.isSaved;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const isSaved = (jobId: string) => savedJobIds.includes(jobId);

  const refreshUser = async () => {
    if (token) await fetchUser(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        loginAsEmployer,
        loginAsCandidate,
        savedJobIds,
        toggleSaveJob,
        isSaved,
        emailModalOpen,
        setEmailModalOpen,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
