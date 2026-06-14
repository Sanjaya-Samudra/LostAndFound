import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Info, MapPin, Tag } from 'lucide-react';
import './PostForm.css';

export const PostLostPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Electronics', 'Pets', 'Wallets', 'Keys', 'Documents', 'Clothing', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      setError('Please fill in all required fields.');
      return;
    }

    mockApi.createItem({
      title,
      description,
      category,
      location,
      status: 'lost'
    });

    navigate('/dashboard');
  };

  return (
    <LayoutWrapper type="sidebar">
      <div className="form-page-root animate-fade-in">
        <div className="form-page-header">
          <h2>Report a Lost Item</h2>
          <p>Provide detailed information about the item you lost to help find matching records.</p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="post-item-form glass-card">
          <div className="form-group">
            <label className="form-label">Item Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. iPhone 14 Pro, Toyota Key fob, Black Backpack"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea 
              className="form-input form-textarea" 
              placeholder="Describe unique characteristics, color, serial numbers, branding, cases, contents, or what the screen locker looks like."
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
              rows={5}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label"><Tag size={14} /> Category</label>
              <select 
                className="form-input form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label"><MapPin size={14} /> Location Lost *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Washington Square Park, Subway Q Train"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setError(''); }}
                required
              />
            </div>
          </div>

          <div className="form-info-note">
            <Info size={16} />
            <span>Reporting a lost item creates a listing in the public database, helping find matching item discoveries.</span>
          </div>

          <div className="form-action-row">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-8">
              Post Listing
            </button>
          </div>
        </form>
      </div>
    </LayoutWrapper>
  );
};
export default PostLostPage;
