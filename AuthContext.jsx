import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { tokenStore } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!tokenStore.getAccess()) {
      setInitializing(false);
      return;
    }
    authService.me().then(setUser).catch(() => authService.logout()).finally(() => setInitializing(false));
  }, []);

  const login = useCallback(async (payload) => {
    const result = await authService.login(payload);
    setUser(result.user);
    return result;
  }, []);

  const register = useCallback(async (payload) => {
    const result = await authService.register(payload);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, initializing, isAuthenticated: Boolean(user), login, register, logout }), [user, initializing, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
