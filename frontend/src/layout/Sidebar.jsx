import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, User, Shield, Users, List, ArrowLeftRight, History, FileText, AlertTriangle, Bookmark, MessageSquare, Grid3X3, MapPin } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = ({ type = 'user' }) => {
  const { user, isAdmin } = useContext(AuthContext);

  if (type === 'admin') {
    return (
      <aside className="site-sidebar admin-sidebar glass-card">
        <div className="sidebar-header">
          <Shield size={24} className="admin-icon" />
          <div>
            <h3>Admin Panel</h3>
            <p>System Management</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>Manage Users</span>
          </NavLink>
          <NavLink to="/admin/items" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <List size={18} />
            <span>Manage Items</span>
          </NavLink>
          <NavLink to="/admin/claims" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={18} />
            <span>Manage Claims</span>
          </NavLink>
          <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <AlertTriangle size={18} />
            <span>Reports</span>
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Grid3X3 size={18} />
            <span>Categories</span>
          </NavLink>
          <NavLink to="/admin/locations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <MapPin size={18} />
            <span>Locations</span>
          </NavLink>
          <NavLink to="/admin/activity-log" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <History size={18} />
            <span>Activity Log</span>
          </NavLink>
          <hr className="sidebar-divider" />
          <NavLink to="/dashboard" className="sidebar-link back-link">
            <ArrowLeftRight size={18} />
            <span>User Dashboard</span>
          </NavLink>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="site-sidebar user-sidebar glass-card">
      <div className="sidebar-header">
        <div className="avatar-placeholder">👤</div>
        <div>
          <h3>{user?.name || 'My Account'}</h3>
          <p>{user?.email}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {!isAdmin && (
          <>
            <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>My Listings</span>
            </NavLink>
            <NavLink to="/post-lost" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <PlusCircle size={18} className="lost-indicator" />
              <span>Report Lost</span>
            </NavLink>
            <NavLink to="/post-found" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <PlusCircle size={18} className="found-indicator" />
              <span>Report Found</span>
            </NavLink>
          </>
        )}
        <NavLink to="/saved" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Bookmark size={18} />
          <span>Saved Items</span>
        </NavLink>
        <NavLink to="/messages" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <MessageSquare size={18} />
          <span>Messages</span>
        </NavLink>
        <NavLink to="/my-claims" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileText size={18} />
          <span>My Claims</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <User size={18} />
          <span>My Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};
export default Sidebar;
