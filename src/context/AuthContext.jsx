import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '../api/config';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    await authService.logout(refreshToken);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .me()
      .then(setAdmin)
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token, logout]);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const accessToken = data.accessToken || data.token;
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
    setToken(accessToken);
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const value = useMemo(
    () => ({
      admin,
      token,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(admin),
    }),
    [admin, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
