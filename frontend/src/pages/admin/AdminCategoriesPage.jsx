import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { Plus, Trash2 } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetch = async () => { try { setCategories(await api.getCategories()); } catch {} finally { setLoading(false); } };
  useEffect(() => { fetch(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try { await api.createCategory(newName.trim()); setNewName(''); fetch(); } catch {}
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await api.deleteCategory(deleteTarget._id); setDeleteTarget(null); fetch(); } catch {}
  };

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        <div className="admin-title-row"><div><h2>Manage Categories</h2><p>Add or remove item categories.</p></div></div>
        <form onSubmit={handleAdd} className="flex items-center gap-3 mb-6">
          <input className="form-input" placeholder="New category name..." value={newName} onChange={e => setNewName(e.target.value)} style={{ maxWidth: 300 }} />
          <button type="submit" className="btn btn-primary btn-sm"><Plus size={14} /> Add</button>
        </form>
        <div className="glass-card table-container">
          {loading ? <div className="text-center py-12"><div className="spinner" /></div>
          : <table className="table"><thead><tr><th>Name</th><th>Actions</th></tr></thead><tbody>
            {categories.map(c => (
              <tr key={c._id}><td>{c.name}</td><td><button className="btn btn-outline btn-sm danger-action btn-icon" onClick={() => setDeleteTarget(c)}><Trash2 size={14} /></button></td></tr>
            ))}
          </tbody></table>}
        </div>
      </div>
      <ConfirmDialog open={!!deleteTarget} title="Delete Category" message={`Delete "${deleteTarget?.name}"? Items with this category won't be affected.`} confirmLabel="Delete" cancelLabel="Cancel" danger onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </LayoutWrapper>
  );
};
export default AdminCategoriesPage;
