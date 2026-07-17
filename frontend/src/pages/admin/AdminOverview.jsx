import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { ArrowRight, Calendar, Download } from 'lucide-react';
import './AdminOverview.css';

export const AdminOverview = () => {
  const [stats, setStats] = useState({ totalItems: 0, totalUsers: 0, lostCount: 0, foundCount: 0, claimedCount: 0, archivedCount: 0, suspendedCount: 0, claimsCount: 0, pendingClaims: 0, reportsCount: 0, successRate: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.getStats(),
      api.getUsers(),
      api.getItems(),
    ]).then(([fetchedStats, users, items]) => {
      setStats(fetchedStats);
      setRecentUsers(users.slice(0, 4));
      setRecentItems((items.items || items).slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const maxCount = Math.max(stats.lostCount, stats.foundCount, stats.claimedCount) || 1;
  const lostPercent = (stats.lostCount / maxCount) * 100;
  const foundPercent = (stats.foundCount / maxCount) * 100;
  const claimedPercent = (stats.claimedCount / maxCount) * 100;

  if (loading) {
    return (
      <LayoutWrapper type="admin">
        <div className="admin-root text-center py-16">
          <div className="spinner" />
          <p className="mt-4 text-muted">Loading admin console...</p>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        <div className="admin-title-row">
          <div>
            <h2>Admin Console</h2>
            <p>System monitoring, user audits, and item moderation controls.</p>
          </div>
        </div>

        <div className="admin-layout">
          <div className="admin-chart-card glass-card">
            <h3>Items Statistics</h3>
            <p className="chart-subtitle">Active and resolved database reports compared</p>

            <div className="bar-chart-container">
              <div className="chart-bar-wrapper">
                <span className="bar-value">{stats.lostCount}</span>
                <div className="chart-bar bar-lost" style={{ height: `${lostPercent}%` }}></div>
                <span className="bar-label">Lost</span>
              </div>

              <div className="chart-bar-wrapper">
                <span className="bar-value">{stats.foundCount}</span>
                <div className="chart-bar bar-found" style={{ height: `${foundPercent}%` }}></div>
                <span className="bar-label">Found</span>
              </div>

              <div className="chart-bar-wrapper">
                <span className="bar-value">{stats.claimedCount}</span>
                <div className="chart-bar bar-claimed" style={{ height: `${claimedPercent}%` }}></div>
                <span className="bar-label">Claimed</span>
              </div>
            </div>

            <div className="chart-details-row" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div><p className="metric-label">Total Listings</p><p className="metric-value">{stats.totalItems}</p></div>
              <div><p className="metric-label">Archived</p><p className="metric-value" style={{ fontSize: '1rem' }}>{stats.archivedCount}</p></div>
              <div><p className="metric-label">Success Rate</p><p className="metric-value text-found-label">{stats.successRate}%</p></div>
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div><p className="metric-label">Suspended Users</p><p className="metric-value" style={{ fontSize: '1rem', color: 'var(--color-lost)' }}>{stats.suspendedCount}</p></div>
              <div><p className="metric-label">Pending Claims</p><p className="metric-value" style={{ fontSize: '1rem', color: 'var(--color-claimed)' }}>{stats.pendingClaims}</p></div>
              <div><p className="metric-label">Open Reports</p><p className="metric-value" style={{ fontSize: '1rem', color: 'var(--color-lost)' }}>{stats.reportsCount}</p></div>
            </div>
          </div>

          <div className="admin-lists-pane">
            <div className="admin-list-card glass-card">
              <div className="card-header-row">
                <h3>Recent Users</h3>
                <div className="flex items-center gap-2">
                  <button className="btn btn-outline btn-sm" onClick={() => api.downloadCsv('users')} title="Export CSV">
                    <Download size={12} /> CSV
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/users')}>
                    View All <ArrowRight size={12} />
                  </button>
                </div>
              </div>
              <div className="list-container">
                {recentUsers.map(user => (
                  <div key={user.id} className="admin-list-row">
                    <div className="user-initials">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="row-details">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                    <div className="row-meta">
                      <Calendar size={12} />
                      <span>{user.joined}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-list-card glass-card">
              <div className="card-header-row">
                <h3>Recent Items Details</h3>
                <div className="flex items-center gap-2">
                  <button className="btn btn-outline btn-sm" onClick={() => api.downloadCsv('items')} title="Export CSV">
                    <Download size={12} /> CSV
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/items')}>
                    View All <ArrowRight size={12} />
                  </button>
                </div>
              </div>
              <div className="list-container">
                {recentItems.map(item => (
                  <div key={item.id} className="admin-list-row">
                    <img src={item.image} alt={item.title} className="item-row-img" />
                    <div className="row-details">
                      <h4>{item.title}</h4>
                      <p>{item.location}</p>
                    </div>
                    <div className="row-meta">
                      <span className={`status-badge-inline ${item.status}`}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default AdminOverview;
