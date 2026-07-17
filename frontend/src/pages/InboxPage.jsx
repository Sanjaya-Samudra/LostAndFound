import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LayoutWrapper from '../layout/LayoutWrapper';
import { MessageSquare, ChevronRight } from 'lucide-react';

export const InboxPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getConversations().then(setConversations).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <LayoutWrapper type="sidebar">
      <div className="container py-8" style={{ maxWidth: '100%', padding: 0 }}>
        <h2 className="mb-2">Messages</h2>
        <p className="text-muted mb-6">Your conversations with other users.</p>
        {loading ? (
          <div className="text-center py-12"><div className="spinner" /><p className="mt-4 text-muted">Loading messages...</p></div>
        ) : conversations.length === 0 ? (
          <div className="glass-card text-center py-12"><MessageSquare size={48} className="text-muted" /><h3 className="mt-4">No Messages</h3><p className="text-muted">Contact item owners or finders to start a conversation.</p></div>
        ) : (
          <div className="glass-card">
            {conversations.map((c, i) => {
              const other = c.participants?.find((p) => p._id !== c.currentUserId);
              return (
                <div key={c._id} className={`admin-list-row ${i > 0 ? '' : ''}`} style={{ cursor: 'pointer' }} onClick={() => navigate(`/messages/${c._id}`)}>
                  <div className="user-initials">{other ? other.firstName?.[0] + other.lastName?.[0] : '?'}</div>
                  <div className="row-details">
                    <h4>{other ? `${other.firstName} ${other.lastName}` : 'Unknown'}</h4>
                    <p className="text-muted text-sm">{c.lastMessage || 'No messages yet'}</p>
                  </div>
                  <div className="row-meta"><ChevronRight size={16} /></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
};
export default InboxPage;
