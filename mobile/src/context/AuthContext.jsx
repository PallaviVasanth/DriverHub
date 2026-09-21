import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { tokens } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/auth/me/').then(({ data }) => setUser(data)).catch(() => tokens.clear()).finally(() => setLoading(false)); }, []);
  const value = useMemo(() => ({ user, loading,
    login: async (payload) => { const { data } = await api.post('/auth/login/', payload); await tokens.set(data); setUser(data.user); return data.user; },
    register: async (payload) => { const { data } = await api.post('/auth/register/', payload); await tokens.set(data.tokens); setUser(data.user); return data.user; },
    logout: async () => { await tokens.clear(); setUser(null); },
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value; }
