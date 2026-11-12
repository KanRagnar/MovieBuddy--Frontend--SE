import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser as apiLogin, logoutUser as apiLogout, fetchUserById, registerUser } from '../api/userApi.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('moviebuddy_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('moviebuddy_token') || null);
  const [loading, setLoading] = useState(false);

  const persistSession = (userData, sessionToken) => {
    setUser(userData);
    localStorage.setItem('moviebuddy_user', JSON.stringify(userData));
    if (sessionToken) {
      setToken(sessionToken);
      localStorage.setItem('moviebuddy_token', sessionToken);
    }
  };

  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetchUserById(user.id);
      if (res?.data) {
        persistSession(res.data, token);
      }
    } catch (err) {
      console.warn('Could not refresh user profile:', err.message);
    }
  }, [user?.id, token]);

  useEffect(() => {
    if (user?.id) {
      refreshUser();
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await apiLogin(username, password);
      persistSession(res.data.user, res.data.token);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerUser(userData);
      const fakeToken = `moviebuddy-token-${res.data.id}-${Date.now()}`;
      persistSession(res.data, fakeToken);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Proceed with local logout even if network fails
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('moviebuddy_user');
    localStorage.removeItem('moviebuddy_token');
  };

  const updateLocalUser = (updatedUser) => {
    persistSession(updatedUser, token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshUser,
        updateLocalUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
