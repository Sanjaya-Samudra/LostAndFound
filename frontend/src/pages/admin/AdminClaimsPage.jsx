import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const AdminClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState(null);

  const fetchClaims = async () => {
    setLoading(true);
    try { setClaims(await api.getAllClaims()); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchClaims(); }, []);

  const handleAction = async (status) => {
    if (!actionTarget) return;
    try { await api.updateClaimStatus(actionTarget, status); setActionTarget(null); fetchClaims(); } catch {}
  };

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        <div className="admin-title-row"><div><h2>Manage Claims</h2><p>Review and moderate item claims from users.</p></div></div>
        <div className="glass-card table-container">
          {loading ? <div className="text-center py-12"><div className="spinner" /><p className="mt-4 text-muted">Loading claims...</p></div>
          : claims.length === 0 ? <div className="text-center py-12"><p>No claims yet.</p></div>
          : <table className="table"><thead><tr><th>Item</th><th>Claimant</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {claims.map(c => (
              <tr key={c._id}>
                <td><div className="font-semibold">{c.item?.title || 'Unknown'}</div><div className="text-xs text-muted">{c.item?.type}</div></td>
                <td>{c.claimant?.firstName} {c.claimant?.lastName}<div className="text-xs text-muted">{c.claimant?.email}</div></td>
                <td><span className="text-sm">{c.description}{c.proofDetails ? <><br /><span className="text-xs text-muted">Proof: {c.proofDetails}</span></> : ''}</span></td>
                <td><span className={`status-badge-inline ${c.status}`}>{c.status}</span></td>
                <td><div className="flex items-center gap-2">
                  {c.status === 'pending' && <>
                    <button className="btn btn-outline btn-sm success-action btn-icon" onClick={() => setActionTarget(c._id)} title="Approve"><CheckCircle size={14} /></button>
                    <button className="btn btn-outline btn-sm danger-action btn-icon" onClick={async () => { await api.updateClaimStatus(c._id, 'rejected'); fetchClaims(); }} title="Reject"><XCircle size={14} /></button>
                  </>}
                  <span className="text-muted text-sm"><Clock size={12} /> {new Date(c.createdAt).toLocaleDateString()}</span>
                </div></td>
              </tr>
            ))}
          </tbody></table>}
        </div>
      </div>
      <ConfirmDialog open={!!actionTarget} title="Approve Claim" message="Approve this claim? The item will be marked as resolved." confirmLabel="Approve" cancelLabel="Cancel" onConfirm={() => handleAction('approved')} onCancel={() => setActionTarget(null)} />
    </LayoutWrapper>
  );
};
export default AdminClaimsPage;
