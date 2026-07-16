import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { Search, Eye, CheckCircle, Trash2, Edit3, X } from 'lucide-react';

export const AdminItemsTable = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', location: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await api.getItems({ search: searchQuery });
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchQuery]);

  const handleResolve = async (id) => {
    try {
      await api.updateItem(id, { status: 'resolved' });
      fetchItems();
    } catch {}
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteItemAdmin(deleteTarget.id);
      setDeleteTarget(null);
      fetchItems();
    } catch {}
  };

  const openEdit = (item) => {
    setEditTarget(item);
    setEditForm({ title: item.title, description: item.description, category: item.category, location: item.location });
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await api.updateItem(editTarget.id, editForm);
      setEditTarget(null);
      fetchItems();
    } catch {} finally {
      setSaving(false);
    }
  };

  const categories = ['Electronics', 'Documents', 'Clothing', 'Other'];

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        <div className="admin-title-row">
          <div>
            <h2>Manage Reported Items</h2>
            <p>Monitor reported lost and found belongings, edit content, and moderate listings.</p>
          </div>
        </div>

        <div className="search-header-form glass-card mb-6">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search items by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-card table-container">
          {loading ? (
            <div className="text-center py-12"><div className="spinner" /><p className="mt-4 text-muted">Loading items...</p></div>
          ) : items.length === 0 ? (
            <div className="text-center py-12"><p>No reported items matched your query.</p></div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Posted By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs text-muted mt-1">{item.location}</div>
                    </td>
                    <td>{item.category}</td>
                    <td><span className={`status-badge-inline ${item.status}`}>{item.status}</span></td>
                    <td>{item.postedBy}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="btn btn-outline btn-sm btn-icon" onClick={() => navigate(`/items/${item.id}`)} title="View">
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(item)} title="Edit">
                          <Edit3 size={14} />
                        </button>
                        {item.status !== 'claimed' && (
                          <button className="btn btn-outline btn-sm success-action btn-icon" onClick={() => handleResolve(item.id)} title="Mark Claimed">
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button className="btn btn-outline btn-sm danger-action btn-icon" onClick={() => setDeleteTarget(item)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Listing"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteTarget(null)}
      />

      {editTarget && (
        <div className="confirm-overlay" onClick={() => setEditTarget(null)}>
          <div className="edit-modal glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Edit Item</h3>
              <button className="confirm-close" onClick={() => setEditTarget(null)}><X size={18} /></button>
            </div>
            <div className="edit-modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" rows={4} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Category</label>
                  <select className="form-input form-select" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Location</label>
                  <input className="form-input" value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
              <p className="text-xs text-muted mt-2">Note: Posted by and user information cannot be edited.</p>
            </div>
            <div className="edit-modal-footer">
              <button className="btn btn-outline" onClick={() => setEditTarget(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEdit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
};
export default AdminItemsTable;
