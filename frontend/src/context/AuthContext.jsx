import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (storedUser && !api.isTokenExpired()) {
      setUser(storedUser);
    } else {
      api.logout();
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await api.login(email, password);
      setUser(result.user);
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

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, login, register, verifyUserEmail, logout, isAdmin, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
