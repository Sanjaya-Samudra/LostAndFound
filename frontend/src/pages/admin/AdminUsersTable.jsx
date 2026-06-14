import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { Search, UserCheck, Shield, Trash2, ShieldAlert } from 'lucide-react';

export const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = () => {
    const data = mockApi.getUsers();
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      setUsers(data.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      ));
    } else {
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const handleToggleRole = (id, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    mockApi.updateUserRole(id, newRole);
    fetchUsers();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to suspend/delete this user?')) {
      mockApi.deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        {/* Title */}
        <div className="admin-title-row">
          <div>
            <h2>Manage Users</h2>
            <p>View registered accounts, modify system permissions, and moderate users.</p>
          </div>
        </div>

        {/* Search bar */}
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

        {/* Users Table */}
        <div className="glass-card table-container">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p>No users matched your query.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-2 font-semibold">
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status-badge-inline ${u.role === 'Admin' ? 'claimed' : 'found'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.joined}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button 
                          className="btn btn-outline btn-sm flex-center gap-1"
                          onClick={() => handleToggleRole(u.id, u.role)}
                          title="Toggle Admin Role"
                          disabled={u.id === 'user-admin'} // Protect primary admin
                        >
                          {u.role === 'Admin' ? <UserCheck size={14} /> : <Shield size={14} />}
                          <span>{u.role === 'Admin' ? 'Demote' : 'Promote'}</span>
                        </button>
                        <button 
                          className="btn btn-outline btn-sm danger-action btn-icon"
                          onClick={() => handleDeleteUser(u.id)}
                          title="Delete User"
                          disabled={u.id === 'user-admin'}
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
    </LayoutWrapper>
  );
};
export default AdminUsersTable;
