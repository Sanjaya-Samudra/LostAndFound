import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { Plus, User, LogOut, Shield, Compass, Bell, Sun, Moon, CheckCircle, LayoutDashboard, ChevronDown, Bookmark, MessageSquare, FileText } from 'lucide-react';
import './Header.css';

export const Header = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('lf_theme') || 'dark');
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    api.getNotifications().then(setNotifications).catch(() => {});
    const interval = setInterval(() => {
      api.getNotifications().then(setNotifications).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('lf_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  const handleMarkRead = async (id) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🔍</span>
          <span className="logo-text">Lost<span className="text-gradient">Found</span></span>
        </Link>

        <nav className="nav-menu">
          <Link to="/search" className="nav-link">
            <Compass size={18} />
            <span>Browse Items</span>
          </Link>

          {user ? (
            <>
              {!isAdmin && (
                <>
                  <Link to="/dashboard" className="nav-link">
                    <span>Dashboard</span>
                  </Link>
                  <div className="post-buttons">
                    <Link to="/post-lost" className="btn btn-outline btn-sm font-sm lost-btn">
                      <Plus size={16} /> Report Lost
                    </Link>
                    <Link to="/post-found" className="btn btn-primary btn-sm font-sm found-btn">
                      <Plus size={16} /> Report Found
                    </Link>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}

          <div className="header-actions">
            <button className="btn btn-outline btn-icon" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user && (
              <div className="notification-bell" ref={notifRef} onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={18} />
                {unread > 0 && <span className="bell-badge">{unread > 9 ? '9+' : unread}</span>}
                {notifOpen && (
                  <div className="notif-dropdown glass-card">
                    <div className="notif-header">
                      <h4>Notifications</h4>
                      {unread > 0 && (
                        <button className="notif-mark-all" onClick={handleMarkAllRead}>Mark all read</button>
                      )}
                    </div>
                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <p className="notif-empty">No notifications yet</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={() => handleMarkRead(n.id)}>
                            <div className="notif-icon"><CheckCircle size={16} /></div>
                            <div className="notif-body">
                              <p className="notif-message">{n.message}</p>
                              <span className="notif-time">{n.time}</span>
                            </div>
                            {!n.read && <span className="notif-dot" />}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user && !isAdmin && (
              <>
                <Link to="/saved" className="nav-link"><Bookmark size={18} /><span>Saved</span></Link>
                <Link to="/messages" className="nav-link"><MessageSquare size={18} /><span>Messages</span></Link>
                <div className="profile-menu-container" ref={profileRef}>
                  <div className="profile-trigger-group">
                    <Link to="/dashboard" className="profile-trigger btn btn-outline">
                      <User size={18} />
                      <span className="username">{user.name.split(' ')[0]}</span>
                    </Link>
                    <button
                      className="profile-dropdown-toggle"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      title="Open menu"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {profileDropdownOpen && (
                    <div className="profile-dropdown glass-card">
                      <div className="dropdown-header">
                        <p className="dropdown-name">{user.name}</p>
                        <p className="dropdown-email">{user.email}</p>
                        <span className="user-role-badge">{user.role}</span>
                      </div>
                      <hr className="dropdown-divider" />
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link to="/saved" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                        <Bookmark size={16} /> Saved Items
                      </Link>
                      <Link to="/messages" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                        <MessageSquare size={16} /> Messages
                      </Link>
                      <Link to="/my-claims" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                        <FileText size={16} /> My Claims
                      </Link>
                      <Link to="/profile" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                        <User size={16} /> My Profile
                      </Link>
                      <hr className="dropdown-divider" />
                      <button className="dropdown-item logout-btn" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {user && isAdmin && (
              <div className="admin-header-section">
                <Link to="/admin" className="admin-header-badge"><Shield size={14} /> Admin</Link>
                <button className="btn btn-outline btn-sm admin-logout-btn" onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Header;
