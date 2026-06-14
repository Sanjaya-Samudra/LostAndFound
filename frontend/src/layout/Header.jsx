import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, User, LogOut, Shield, Compass, Bell, Menu, X, Sun, Moon } from 'lucide-react';
import './Header.css';

export const Header = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🔍</span>
          <span className="logo-text">Lost<span className="text-gradient">Found</span></span>
        </Link>

        {/* Mobile menu button */}
        <button className="mobile-menu-toggle btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation links */}
        <nav className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/search" className="nav-link" onClick={() => setMenuOpen(false)}>
            <Compass size={18} />
            <span>Browse Items</span>
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                <span>Dashboard</span>
              </Link>
              <div className="post-buttons">
                <Link to="/post-lost" className="btn btn-outline btn-sm font-sm lost-btn" onClick={() => setMenuOpen(false)}>
                  <Plus size={16} /> Report Lost
                </Link>
                <Link to="/post-found" className="btn btn-primary btn-sm font-sm found-btn" onClick={() => setMenuOpen(false)}>
                  <Plus size={16} /> Report Found
                </Link>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}

          {/* Theme & Notifications */}
          <div className="header-actions">
            <button className="btn btn-outline btn-icon" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user && (
              <div className="notification-bell">
                <Bell size={18} />
                <span className="bell-badge"></span>
              </div>
            )}

            {/* Profile Dropdown */}
            {user && (
              <div className="profile-menu-container">
                <button 
                  className="profile-trigger btn btn-outline"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <User size={18} />
                  <span className="username">{user.name.split(' ')[0]}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="profile-dropdown glass-card">
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                      <span className="user-role-badge">{user.role}</span>
                    </div>
                    <hr className="dropdown-divider" />
                    
                    <Link to="/profile" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                      <User size={16} /> My Profile
                    </Link>
                    
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item admin-item" onClick={() => setProfileDropdownOpen(false)}>
                        <Shield size={16} /> Admin Suite
                      </Link>
                    )}

                    <hr className="dropdown-divider" />
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Header;
