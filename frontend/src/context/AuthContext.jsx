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
    // Check if the user is in our local storage database
    const storedUsers = JSON.parse(localStorage.getItem('lf_users') || '[]');
    const registeredUser = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (registeredUser) {
      if (registeredUser.password !== password) {
        return { success: false, error: 'invalid_credentials' };
      }
      if (registeredUser.isVerified === false) {
        return { success: false, error: 'unverified' };
      }
      const userData = { 
        id: registeredUser.id, 
        name: registeredUser.name, 
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        email: registeredUser.email, 
        role: registeredUser.role 
      };
      setUser(userData);
      localStorage.setItem('lf_current_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    // Simple mock authentication check for built-in demo accounts
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
    } else {
      return { success: false, error: 'invalid_credentials' };
    }

    const userData = { id, name, email, role };
    setUser(userData);
    localStorage.setItem('lf_current_user', JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const register = (firstName, lastName, email, password) => {
    const id = `user-${Date.now()}`;
    const name = `${firstName} ${lastName}`;
    
    // Add to mock users database (unverified by default)
    const storedUsers = JSON.parse(localStorage.getItem('lf_users') || '[]');
    
    // Check if email already exists
    if (storedUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'email_exists' };
    }

    const newUser = { 
      id, 
      name, 
      firstName, 
      lastName, 
      email, 
      password, // Save password for simulated login checks
      role: 'User', 
      isVerified: false, // Default is unverified
      joined: new Date().toISOString().split('T')[0] 
    };

    storedUsers.push(newUser);
    localStorage.setItem('lf_users', JSON.stringify(storedUsers));

    // Do NOT call setUser yet because the user needs to verify their email
    return { success: true, user: newUser };
  };

  const verifyUserEmail = (email) => {
    const storedUsers = JSON.parse(localStorage.getItem('lf_users') || '[]');
    const updatedUsers = storedUsers.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, isVerified: true };
      }
      return u;
    });
    localStorage.setItem('lf_users', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lf_current_user');
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, login, register, verifyUserEmail, logout, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
