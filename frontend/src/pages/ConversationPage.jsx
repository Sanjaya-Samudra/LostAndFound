import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Send, ArrowLeft } from 'lucide-react';

export const ConversationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages(id);
      setMessages(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, [id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = await api.sendMessage(id, text);
    setMessages(prev => [...prev, msg]);
    setText('');
  };

  return (
    <LayoutWrapper type="sidebar">
      <div className="container py-8" style={{ maxWidth: '100%', padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
        <div className="flex items-center gap-4 mb-4">
          <button className="btn btn-outline btn-icon" onClick={() => navigate('/messages')}><ArrowLeft size={18} /></button>
          <h2>Conversation</h2>
        </div>
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          <div className="notif-list" style={{ flex: 1, padding: 16 }}>
            {loading ? <div className="text-center py-8"><div className="spinner" /></div> : messages.length === 0 ? <p className="text-center text-muted py-8">No messages yet. Start the conversation!</p> : messages.map(m => (
              <div key={m._id} className="mb-3" style={{ textAlign: 'left' }}>
                <div className="glass-card" style={{ display: 'inline-block', padding: '8px 14px', maxWidth: '80%', borderRadius: 12, background: 'var(--bg-card-hover)' }}>
                  <p style={{ fontSize: '0.875rem' }}>{m.text}</p>
                  <p className="text-muted" style={{ fontSize: '0.65rem', marginTop: 2 }}>{m.sender?.firstName} {m.sender?.lastName} · {new Date(m.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSend} className="flex items-center gap-3" style={{ padding: 12, borderTop: '1px solid var(--border-color)' }}>
            <input className="form-input" placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} style={{ flex: 1 }} />
            <button type="submit" className="btn btn-primary btn-icon"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default ConversationPage;
