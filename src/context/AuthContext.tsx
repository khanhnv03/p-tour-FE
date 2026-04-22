import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, type UserInfo } from '../api/auth';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (token: string, user: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  }, []);

  const setAuth = useCallback((newToken: string, newUser: UserInfo) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    getMe()
      .then((userInfo) => {
        setUser(userInfo);
        setToken(storedToken);
      })
      .catch(() => logout())
      .finally(() => setIsLoading(false));
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'ADMIN',
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
