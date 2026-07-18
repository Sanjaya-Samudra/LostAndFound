import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Select } from '../components/Select';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Info, MapPin, Camera, X } from 'lucide-react';
import './PostForm.css';

const CATEGORY_OPTIONS = [
  { value: 'Electronics', label: 'Electronics', icon: '📱' },
  { value: 'Documents', label: 'Documents', icon: '📄' },
  { value: 'Clothing', label: 'Clothing', icon: '👕' },
  { value: 'Other', label: 'Other', icon: '📦' },
];

const PLACEHOLDERS = {
  Electronics: {
    title: 'e.g. iPhone 14 Pro, MacBook Air, Samsung Earbuds',
    description: 'Describe the device model, color, condition, and any passcodes or data found.',
  },
  Documents: {
    title: 'e.g. US Passport, California Driver\'s License, NYU Student ID',
    description: 'Note the document type and any visible info — hand over to authorities if sensitive.',
  },
  Clothing: {
    title: 'e.g. Grey Patagonia Vest, Adidas Ultraboost, Kate Spade Wallet',
    description: 'Describe brand, color, size, and where exactly it was found.',
  },
  Other: {
    title: 'e.g. Gold Ring, Acoustic Guitar, Nintendo Switch',
    description: 'Describe the item, its condition, and the exact location where you found it.',
  },
};

export const PostFoundPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const ph = PLACEHOLDERS[category] || PLACEHOLDERS.Other;

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      setError('Please fill in all required fields.');
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls = imageFiles.length > 0 ? await api.uploadImages(imageFiles) : [];

      await api.createItem({
        title,
        description,
        category,
        location,
        images: uploadedUrls,
        type: 'found',
      });
      navigate('/dashboard');
    } catch {
      setError('Failed to create listing. Please try again.');
    } finally {
      setUploading(false);
    }
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
              placeholder={ph.title}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-input form-textarea"
              placeholder={ph.description}
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
              rows={5}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <Select
                label="Category"
                value={category}
                onChange={(v) => { setCategory(v); setError(''); }}
                options={CATEGORY_OPTIONS}
                placeholder="Select category"
              />
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

          <div className="form-group">
            <label className="form-label"><Camera size={14} /> Photographs</label>
            {imagePreviews.length > 0 && (
              <div className="image-previews-row">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="preview-thumb-wrapper">
                    <img src={preview} alt={`Preview ${i + 1}`} className="preview-thumb" />
                    <button type="button" className="preview-remove-btn" onClick={() => removeImage(i)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="image-upload-zone">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden-file-input"
              />
              <Camera size={28} className="upload-icon" />
              <span>{imagePreviews.length > 0 ? 'Add more photos' : 'Upload photos of the item'}</span>
              <p>Supports PNG, JPG, GIF — select multiple</p>
            </label>
          </div>

          <div className="form-info-note">
            <Info size={16} />
            <span>Posting a found item creates a public record. Be careful not to hand over items to claimants without verifying ownership.</span>
          </div>

          <div className="form-action-row">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-8" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>
    </LayoutWrapper>
  );
};
export default PostFoundPage;
