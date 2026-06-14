import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Eye, CheckCircle, Trash2, Calendar, MapPin, AlertCircle } from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, claimed: 0 });
  const [userItems, setUserItems] = useState([]);
  const navigate = useNavigate();

  const fetchUserData = () => {
    if (user) {
      const data = mockApi.getUserStats(user.id);
      setStats({
        total: data.total,
        lost: data.lost,
        found: data.found,
        claimed: data.claimed
      });
      setUserItems(data.items);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleStatusChange = (id, status) => {
    mockApi.updateItemStatus(id, status);
    fetchUserData(); // Refresh listings and counters
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      mockApi.deleteItem(id);
      fetchUserData();
    }
  };

  const lostItemsList = userItems.filter(item => item.status === 'lost');
  const foundItemsList = userItems.filter(item => item.status === 'found' || item.status === 'claimed');

  return (
    <LayoutWrapper type="sidebar">
      <div className="dashboard-root">
        {/* Page Title */}
        <div className="dashboard-title-row">
          <div>
            <h2>My Dashboard</h2>
            <p>Manage your reported listings and track their claim status.</p>
          </div>
        </div>

        {/* Stats Grid */}
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

        {/* Listings Columns */}
        <div className="dashboard-columns">
          {/* Lost Columns */}
          <div className="dashboard-column glass-card">
            <h3 className="column-title">My Lost Items ({lostItemsList.length})</h3>
            <div className="list-container">
              {lostItemsList.length === 0 ? (
                <div className="empty-list">
                  <AlertCircle size={32} />
                  <p>No active lost item reports.</p>
                </div>
              ) : (
                lostItemsList.map(item => (
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
                      <button className="btn btn-outline btn-icon success-action" onClick={() => handleStatusChange(item.id, 'claimed')} title="Mark as Found/Resolved">
                        <CheckCircle size={16} />
                      </button>
                      <button className="btn btn-outline btn-icon danger-action" onClick={() => handleDeleteItem(item.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Found Columns */}
          <div className="dashboard-column glass-card">
            <h3 className="column-title">My Found Items ({foundItemsList.length})</h3>
            <div className="list-container">
              {foundItemsList.length === 0 ? (
                <div className="empty-list">
                  <AlertCircle size={32} />
                  <p>No active found item reports.</p>
                </div>
              ) : (
                foundItemsList.map(item => (
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
                        <button className="btn btn-outline btn-icon success-action" onClick={() => handleStatusChange(item.id, 'claimed')} title="Mark as Claimed/Returned">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button className="btn btn-outline btn-icon danger-action" onClick={() => handleDeleteItem(item.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default DashboardPage;
