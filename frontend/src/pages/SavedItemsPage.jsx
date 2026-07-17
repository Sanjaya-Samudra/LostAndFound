import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Bookmark, MapPin, Calendar } from 'lucide-react';
import './SearchPage.css';

export const SavedItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getBookmarks().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <LayoutWrapper type="sidebar">
      <div className="container py-8 search-root" style={{ maxWidth: '100%', padding: 0 }}>
        <div className="mb-6">
          <h2>Saved Items</h2>
          <p className="text-muted">Items you've bookmarked for later.</p>
        </div>
        {loading ? (
          <div className="text-center py-12"><div className="spinner" /><p className="mt-4 text-muted">Loading bookmarks...</p></div>
        ) : items.length === 0 ? (
          <div className="glass-card text-center py-12"><Bookmark size={48} className="text-muted" /><h3 className="mt-4">No Saved Items</h3><p className="text-muted">Browse items and click the bookmark icon to save them here.</p></div>
        ) : (
          <div className="grid-cols-3">
            {items.map(item => (
              <div key={item.id} className="item-card glass-card glass-card-hover" onClick={() => navigate(`/items/${item.id}`)}>
                <div className="item-card-image-wrapper">
                  <img src={item.image} alt={item.title} className="item-card-image" />
                  <span className={`badge item-card-badge ${item.status === 'lost' ? 'badge-lost' : item.status === 'found' ? 'badge-found' : 'badge-claimed'}`}>{item.status}</span>
                </div>
                <div className="item-card-body">
                  <span className="item-card-category">{item.category}</span>
                  <h3 className="item-card-title">{item.title}</h3>
                  <div className="item-card-meta">
                    <div className="meta-row"><MapPin size={12} className="meta-icon" /><span>{item.location}</span></div>
                    <div className="meta-row"><Calendar size={12} className="meta-icon" /><span>{item.date}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
};
export default SavedItemsPage;
