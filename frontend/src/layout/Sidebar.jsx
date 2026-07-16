import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, User, Shield, Users, List, ArrowLeftRight } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = ({ type = 'user' }) => {
  const { user } = useContext(AuthContext);

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
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <User size={18} />
          <span>My Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};
export default Sidebar;
