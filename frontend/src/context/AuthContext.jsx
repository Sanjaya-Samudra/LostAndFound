import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';

const ACTIVITY_KEY = 'lf_last_activity';
const TIMEOUT_USER = 30 * 60 * 1000;
const TIMEOUT_ADMIN = 10 * 60 * 1000;

const getLastActivity = () => {
  const stored = localStorage.getItem(ACTIVITY_KEY);
  return stored ? parseInt(stored, 10) : Date.now();
};

const updateLastActivity = () => {
  localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const checkInterval = useRef(null);

  const logout = useCallback(() => {
    api.logout();
    localStorage.removeItem(ACTIVITY_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (storedUser && !api.isTokenExpired()) {
      const isAdmin = storedUser.role === 'Admin';
      const timeout = isAdmin ? TIMEOUT_ADMIN : TIMEOUT_USER;
      const elapsed = Date.now() - getLastActivity();
      if (elapsed >= timeout) {
        logout();
      } else {
        setUser(storedUser);
        updateLastActivity();
      }
    } else {
      api.logout();
      localStorage.removeItem(ACTIVITY_KEY);
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => updateLastActivity();
    events.forEach((e) => window.addEventListener(e, handleActivity));
    updateLastActivity();

    checkInterval.current = setInterval(() => {
      const isAdmin = user.role === 'Admin';
      const timeout = isAdmin ? TIMEOUT_ADMIN : TIMEOUT_USER;
      if (Date.now() - getLastActivity() >= timeout) {
        logout();
      }
    }, 5000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (checkInterval.current) clearInterval(checkInterval.current);
    };
  }, [user, logout]);

  const login = async (email, password) => {
    try {
      const result = await api.login(email, password);
      setUser(result.user);
      updateLastActivity();
      return result;
    } catch (err) {
      return { success: false, error: err.message || 'Invalid login credentials' };
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const result = await api.register(firstName, lastName, email, password);
      return { success: true, message: result.message };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const verifyUserEmail = async (email) => {
    try {
      await api.verifyEmail(email);
      return true;
    } catch {
      return false;
    }
  };

  const refreshUser = () => {
    const storedUser = api.getStoredUser();
    if (storedUser) setUser(storedUser);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, login, register, verifyUserEmail, logout, isAdmin, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
