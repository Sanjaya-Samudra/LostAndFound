import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { Plus, Trash2 } from 'lucide-react';

export const AdminLocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetch = async () => { try { setLocations(await api.getLocations()); } catch {} finally { setLoading(false); } };
  useEffect(() => { fetch(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try { await api.createLocation(newName.trim()); setNewName(''); fetch(); } catch {}
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await api.deleteLocation(deleteTarget._id); setDeleteTarget(null); fetch(); } catch {}
  };

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        <div className="admin-title-row"><div><h2>Manage Locations</h2><p>Add or remove common locations for item postings.</p></div></div>
        <form onSubmit={handleAdd} className="flex items-center gap-3 mb-6">
          <input className="form-input" placeholder="New location name..." value={newName} onChange={e => setNewName(e.target.value)} style={{ maxWidth: 300 }} />
          <button type="submit" className="btn btn-primary btn-sm"><Plus size={14} /> Add</button>
        </form>
        <div className="glass-card table-container">
          {loading ? <div className="text-center py-12"><div className="spinner" /></div>
          : <table className="table"><thead><tr><th>Name</th><th>Actions</th></tr></thead><tbody>
            {locations.map(l => (
              <tr key={l._id}><td>{l.name}</td><td><button className="btn btn-outline btn-sm danger-action btn-icon" onClick={() => setDeleteTarget(l)}><Trash2 size={14} /></button></td></tr>
            ))}
          </tbody></table>}
        </div>
      </div>
      <ConfirmDialog open={!!deleteTarget} title="Delete Location" message={`Delete "${deleteTarget?.name}"?`} confirmLabel="Delete" cancelLabel="Cancel" danger onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </LayoutWrapper>
  );
};
export default AdminLocationsPage;
