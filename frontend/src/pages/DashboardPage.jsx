import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { ConfirmDialog } from '../components/ConfirmDialog';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Eye, CheckCircle, Trash2, Calendar, MapPin, AlertCircle } from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, claimed: 0 });
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const items = await api.getMyItems();
      setUserItems(items);
      setStats({
        total: items.length,
        lost: items.filter(i => i.status === 'lost').length,
        found: items.filter(i => i.status === 'found').length,
        claimed: items.filter(i => i.status === 'claimed').length,
      });
    } catch {
      setUserItems([]);
      setStats({ total: 0, lost: 0, found: 0, claimed: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleResolve = async (id) => {
    try {
      await api.updateItem(id, { status: 'resolved' });
      fetchUserData();
    } catch {}
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteItem(deleteTarget);
      setDeleteTarget(null);
      fetchUserData();
    } catch {}
  };

  const lostItemsList = userItems.filter(item => item.status === 'lost');
  const foundItemsList = userItems.filter(item => item.status === 'found' || item.status === 'claimed');

  if (loading) {
    return (
      <LayoutWrapper type="sidebar">
        <div className="dashboard-root text-center py-16">
          <div className="spinner" />
          <p className="mt-4 text-muted">Loading your dashboard...</p>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper type="sidebar">
      <div className="dashboard-root">
        <div className="dashboard-title-row">
          <div>
            <h2>My Dashboard</h2>
            <p>Manage your reported listings and track their claim status.</p>
          </div>
        </div>

        <div className="dashboard-stats-grid">
          <div className="stat-card glass-card">
            <span className="stat-label">Total Reports</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card glass-card">
            <span className="stat-label text-lost-label">Active Lost</span>
            <span className="stat-value">{stats.lost}</span>
          </div>
          <div className="stat-card glass-card">
            <span className="stat-label text-found-label">Active Found</span>
            <span className="stat-value">{stats.found}</span>
          </div>
          <div className="stat-card glass-card">
            <span className="stat-label text-claimed-label">Resolved / Claimed</span>
            <span className="stat-value">{stats.claimed}</span>
          </div>
        </div>

        <div className="dashboard-columns">
          <div className="dashboard-column glass-card">
            <h3 className="column-title">My Lost Items ({lostItemsList.length})</h3>
            <div className="list-container">
              {lostItemsList.length === 0 ? (
                <div className="empty-list">
                  <AlertCircle size={32} />
                  <p>No active lost item reports.</p>
                </div>
              ) : lostItemsList.map(item => (
                  <div key={item.id} className="dashboard-item-row">
                    <img src={item.image} alt={item.title} className="item-row-img" />
                    <div className="item-row-info">
                      <h4>{item.title}</h4>
                      <div className="item-row-meta">
                        <span><MapPin size={12} /> {item.location}</span>
                        <span><Calendar size={12} /> {item.date}</span>
                      </div>
                    </div>
                    <div className="item-row-actions">
                      <button className="btn btn-outline btn-icon" onClick={() => navigate(`/items/${item.id}`)} title="View Detail">
                        <Eye size={16} />
                      </button>
                      <button className="btn btn-outline btn-icon success-action" onClick={() => handleResolve(item.id)} title="Mark as Found/Resolved">
                        <CheckCircle size={16} />
                      </button>
                      <button className="btn btn-outline btn-icon danger-action" onClick={() => setDeleteTarget(item.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="dashboard-column glass-card">
            <h3 className="column-title">My Found Items ({foundItemsList.length})</h3>
            <div className="list-container">
              {foundItemsList.length === 0 ? (
                <div className="empty-list">
                  <AlertCircle size={32} />
                  <p>No active found item reports.</p>
                </div>
              ) : foundItemsList.map(item => (
                  <div key={item.id} className="dashboard-item-row">
                    <img src={item.image} alt={item.title} className="item-row-img" />
                    <div className="item-row-info">
                      <h4>{item.title}</h4>
                      <div className="item-row-meta">
                        <span><MapPin size={12} /> {item.location}</span>
                        <span className={`status-badge-inline ${item.status}`}>{item.status}</span>
                      </div>
                    </div>
                    <div className="item-row-actions">
                      <button className="btn btn-outline btn-icon" onClick={() => navigate(`/items/${item.id}`)} title="View Detail">
                        <Eye size={16} />
                      </button>
                      {item.status === 'found' && (
                        <button className="btn btn-outline btn-icon success-action" onClick={() => handleResolve(item.id)} title="Mark as Claimed/Returned">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="btn btn-outline btn-icon danger-action" onClick={() => setDeleteTarget(item.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteTarget(null)}
      />
    </LayoutWrapper>
  );
};
export default DashboardPage;
