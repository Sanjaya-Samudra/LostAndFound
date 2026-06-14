import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('lf_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple mock authentication check
    let name = 'Alice Johnson';
    let id = 'user-1';
    let role = 'User';

    if (email.toLowerCase().includes('admin')) {
      name = 'Admin Control';
      id = 'user-admin';
      role = 'Admin';
    } else if (email === 'bob@example.com') {
      name = 'Bob Smith';
      id = 'user-2';
    }

    const userData = { id, name, email, role };
    setUser(userData);
    localStorage.setItem('lf_current_user', JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const register = (name, email, password) => {
    const id = `user-${Date.now()}`;
    const userData = { id, name, email, role: 'User' };
    
    // Add to mock users database
    const storedUsers = JSON.parse(localStorage.getItem('lf_users') || '[]');
    storedUsers.push({ id, name, email, role: 'User', joined: new Date().toISOString().split('T')[0] });
    localStorage.setItem('lf_users', JSON.stringify(storedUsers));

    setUser(userData);
    localStorage.setItem('lf_current_user', JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lf_current_user');
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
