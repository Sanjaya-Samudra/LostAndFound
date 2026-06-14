import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Info, MapPin, Tag, Camera, X } from 'lucide-react';
import './PostForm.css';

export const PostFoundPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Electronics', 'Pets', 'Wallets', 'Keys', 'Documents', 'Clothing', 'Other'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 data URL
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage('');
    setImagePreview('');
  };

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
      image: image || 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=500&auto=format&fit=crop&q=60', // Fallback
      status: 'found'
    });

    navigate('/dashboard');
  };

  return (
    <LayoutWrapper type="sidebar">
      <div className="form-page-root animate-fade-in">
        <div className="form-page-header">
          <h2>Report a Found Item</h2>
          <p>Post details of an item you found so that the rightful owner can identify and claim it.</p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="post-item-form glass-card">
          <div className="form-group">
            <label className="form-label">Item Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Lost Dog, Leather Wallet, Set of Keys"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea 
              className="form-input form-textarea" 
              placeholder="Describe where you found it, its condition, and any markings. (Tip: leave out one key detail to verify the owner)."
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
              <label className="form-label"><MapPin size={14} /> Location Found *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Broadway near 42nd St, Central Park benches"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setError(''); }}
                required
              />
            </div>
          </div>

          {/* Image Uploader */}
          <div className="form-group">
            <label className="form-label"><Camera size={14} /> Item Photograph</label>
            {imagePreview ? (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="uploaded-image-preview" />
                <button type="button" className="btn btn-outline clear-image-btn" onClick={clearImage}>
                  <X size={16} /> Remove Photo
                </button>
              </div>
            ) : (
              <label className="image-upload-zone">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden-file-input"
                />
                <Camera size={32} className="upload-icon" />
                <span>Drag & drop or click to upload item photo</span>
                <p>Supports PNG, JPG, GIF up to 5MB</p>
              </label>
            )}
          </div>

          <div className="form-info-note">
            <Info size={16} />
            <span>Posting a found item creates a public record. Be careful not to hand over items to claimants without verifying ownership.</span>
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
export default PostFoundPage;
