import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { History, User, FileText, Trash2, Edit3, Shield, UserCog } from 'lucide-react';

const ACTION_META = {
  delete_user: { icon: Trash2, color: 'var(--color-lost)', label: 'Deleted User' },
  delete_item: { icon: Trash2, color: 'var(--color-lost)', label: 'Deleted Item' },
  edit_item: { icon: Edit3, color: 'var(--color-found)', label: 'Edited Item' },
  update_user_role: { icon: UserCog, color: 'var(--color-claimed)', label: 'Changed Role' },
};

const getActionMeta = (action) => ACTION_META[action] || { icon: Shield, color: 'var(--text-muted)', label: action };

export const AdminActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getActivityLogs().then(setLogs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        <div className="admin-title-row">
          <div>
            <h2>Activity Log</h2>
            <p>Audit trail of all admin actions performed in the system.</p>
          </div>
        </div>

        <div className="glass-card table-container">
          {loading ? (
            <div className="text-center py-12"><div className="spinner" /><p className="mt-4 text-muted">Loading activity log...</p></div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12"><p>No activity recorded yet.</p></div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Admin</th>
                  <th>Target</th>
                  <th>Details</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const meta = getActionMeta(log.action);
                  const Icon = meta.icon;
                  return (
                    <tr key={log.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span style={{ color: meta.color }}><Icon size={16} /></span>
                          <span className="font-semibold">{meta.label}</span>
                        </div>
                      </td>
                      <td>{log.adminName}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {log.targetType === 'user' ? <User size={14} className="text-muted" /> : <FileText size={14} className="text-muted" />}
                          <span>{log.targetName || log.targetId}</span>
                        </div>
                      </td>
                      <td><span className="text-muted text-sm">{log.details || '—'}</span></td>
                      <td className="text-muted text-sm">{log.createdAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default AdminActivityLog;
