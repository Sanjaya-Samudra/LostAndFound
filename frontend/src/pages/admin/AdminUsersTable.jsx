import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { Search, Trash2, Download, Ban, CheckCircle } from 'lucide-react';

export const AdminUsersTable = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers(searchQuery);
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch {}
  };

  const handleSuspend = async (id) => {
    try { await api.suspendUser(id); fetchUsers(); } catch {}
  };

  const handleUnsuspend = async (id) => {
    try { await api.unsuspendUser(id); fetchUsers(); } catch {}
  };

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        <div className="admin-title-row">
          <div>
            <h2>Manage Users</h2>
            <p>View registered accounts and moderate users.</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => api.downloadCsv('users')}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="search-header-form glass-card mb-6">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-card table-container">
          {loading ? (
            <div className="text-center py-12"><div className="spinner" /><p className="mt-4 text-muted">Loading users...</p></div>
          ) : users.length === 0 ? (
            <div className="text-center py-12"><p>No users matched your query.</p></div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={u.suspended ? 'opacity-50' : ''}>
                    <td><div className="flex items-center gap-2 font-semibold"><span>{u.name}</span></div></td>
                    <td>{u.email}</td>
                    <td><span className={`status-badge-inline ${u.role === 'Admin' ? 'claimed' : 'found'}`}>{u.role}</span></td>
                    <td><span className={u.suspended ? 'text-lost-label' : 'text-found-label'}>{u.suspended ? 'Suspended' : 'Active'}</span></td>
                    <td>{u.joined}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {u.suspended ? (
                          <button className="btn btn-outline btn-sm success-action btn-icon" onClick={() => handleUnsuspend(u.id)} title="Unsuspend">
                            <CheckCircle size={14} />
                          </button>
                        ) : (
                          <button className="btn btn-outline btn-sm btn-icon" onClick={() => handleSuspend(u.id)} title="Suspend" disabled={u.id === currentUser?.id}>
                            <Ban size={14} />
                          </button>
                        )}
                        <button
                          className="btn btn-outline btn-sm danger-action btn-icon"
                          onClick={() => setDeleteTarget(u)}
                          title="Delete User"
                          disabled={u.id === currentUser?.id}
                        >
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
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </LayoutWrapper>
  );
};
export default AdminUsersTable;
