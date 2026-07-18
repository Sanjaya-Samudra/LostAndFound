import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LayoutWrapper from '../layout/LayoutWrapper';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const STATUS_META = { pending: { icon: Clock, label: 'Pending', className: '' }, approved: { icon: CheckCircle, label: 'Approved', className: 'text-found-label' }, rejected: { icon: XCircle, label: 'Rejected', className: 'text-lost-label' } };

export const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyClaims().then(setClaims).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <LayoutWrapper type="sidebar">
      <div style={{ maxWidth: '100%', padding: 0 }}>
        <h2 className="mb-2">My Claims</h2>
        <p className="text-muted mb-6">Claims you've submitted on found items.</p>
        {loading ? (
          <div className="text-center py-12"><div className="spinner" /><p className="mt-4 text-muted">Loading claims...</p></div>
        ) : claims.length === 0 ? (
          <div className="glass-card text-center py-12"><FileText size={48} className="text-muted" /><h3 className="mt-4">No Claims</h3><p className="text-muted">You haven't submitted any claims yet.</p></div>
        ) : (
          <div className="glass-card">
            {claims.map(c => {
              const meta = STATUS_META[c.status] || STATUS_META.pending;
              const Icon = meta.icon;
              return (
                <div key={c._id} className="admin-list-row">
                  <div className="row-details"><h4>{c.item?.title || 'Unknown Item'}</h4><p className="text-muted text-sm">{c.description}</p></div>
                  <div className="row-meta"><Icon size={14} /><span className={meta.className} style={{ fontWeight: 600 }}>{meta.label}</span></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
};
export default MyClaimsPage;
