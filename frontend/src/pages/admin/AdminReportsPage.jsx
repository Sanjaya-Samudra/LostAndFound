import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { AlertTriangle, CheckCircle, User, FileText } from 'lucide-react';

export const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReports().then(setReports).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleResolve = async (id) => {
    try { await api.resolveReport(id); setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'resolved' } : r)); } catch {}
  };

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        <div className="admin-title-row"><div><h2>Reports & Disputes</h2><p>User-submitted reports on items and users.</p></div></div>
        <div className="glass-card table-container">
          {loading ? <div className="text-center py-12"><div className="spinner" /><p className="mt-4 text-muted">Loading reports...</p></div>
          : reports.length === 0 ? <div className="text-center py-12"><p>No reports submitted.</p></div>
          : <table className="table"><thead><tr><th>Type</th><th>Reporter</th><th>Reason</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {reports.map(r => (
              <tr key={r._id}>
                <td><div className="flex items-center gap-2">{r.targetType === 'user' ? <User size={14} /> : <FileText size={14} />}<span className="font-semibold">{r.targetType}</span></div></td>
                <td>{r.reporter?.firstName} {r.reporter?.lastName}</td>
                <td>{r.reason}</td>
                <td><span className="text-sm text-muted">{r.description || '—'}</span></td>
                <td><span className={`status-badge-inline ${r.status}`}>{r.status}</span></td>
                <td>{r.status === 'open' && <button className="btn btn-outline btn-sm success-action" onClick={() => handleResolve(r._id)}><CheckCircle size={14} /> Resolve</button>}</td>
              </tr>
            ))}
          </tbody></table>}
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default AdminReportsPage;
