import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { AuthContext } from '../context/AuthContext';
import LayoutWrapper from '../layout/LayoutWrapper';
import { MapPin, Calendar, User, Tag, ArrowLeft, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import './DetailPage.css';

export const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchedItem = mockApi.getItemById(id);
    if (fetchedItem) {
      setItem(fetchedItem);
    }
  }, [id]);

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquiryText) return;
    
    // Simulate API call
    setTimeout(() => {
      setInquirySent(true);
      setInquiryText('');
      // Auto close modal after a short delay
      setTimeout(() => {
        setModalOpen(false);
        setInquirySent(false);
      }, 2000);
    }, 800);
  };

  if (!item) {
    return (
      <LayoutWrapper>
        <div className="container py-12 text-center empty-detail-container">
          <AlertTriangle size={48} className="empty-icon" />
          <h2>Item Not Found</h2>
          <p>The item you are looking for does not exist or has been removed.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="container py-8 detail-root">
        {/* Back Button */}
        <button className="btn btn-outline back-nav-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="detail-layout">
          {/* Left Column - Image & Description */}
          <div className="detail-main glass-card">
            <div className="detail-image-container">
              <img src={item.image} alt={item.title} className="detail-image" />
              <span className={`badge detail-status-badge ${item.status === 'lost' ? 'badge-lost' : item.status === 'found' ? 'badge-found' : 'badge-claimed'}`}>
                {item.status}
              </span>
            </div>

            <div className="detail-body">
              <h1 className="detail-title">{item.title}</h1>
              
              <div className="detail-category-row">
                <span className="badge badge-category"><Tag size={12} /> {item.category}</span>
              </div>

              <div className="detail-description-section">
                <h3>Description</h3>
                <p>{item.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Metadata */}
          <div className="detail-sidebar">
            {/* Map Block (Mocked) */}
            <div className="sidebar-block map-block glass-card">
              <div className="mock-map">
                <div className="map-pin-indicator">
                  <MapPin size={24} className="glow-pin" />
                </div>
                <div className="mock-map-labels">
                  <span>{item.location}</span>
                </div>
              </div>
            </div>

            {/* Meta Information */}
            <div className="sidebar-block info-block glass-card">
              <h3>Item Specifics</h3>
              <div className="info-list">
                <div className="info-item">
                  <MapPin size={18} className="info-item-icon" />
                  <div>
                    <span className="info-label">Location</span>
                    <span className="info-value">{item.location}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Calendar size={18} className="info-item-icon" />
                  <div>
                    <span className="info-label">Date Reported</span>
                    <span className="info-value">{item.date}</span>
                  </div>
                </div>

                <div className="info-item">
                  <User size={18} className="info-item-icon" />
                  <div>
                    <span className="info-label">Reported By</span>
                    <span className="info-value">{item.postedBy}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {item.status !== 'claimed' && (
                <button 
                  className={`btn w-full mt-4 action-cta-btn ${item.status === 'lost' ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                    } else {
                      setModalOpen(true);
                    }
                  }}
                >
                  {item.status === 'lost' ? 'I Found This Item' : 'Claim This Item'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {modalOpen && (
        <div className="modal-overlay flex-center">
          <div className="modal-content glass-card animate-fade-in">
            <div className="modal-header">
              <h3>{item.status === 'lost' ? 'Report Item Discovery' : 'Claim Item Form'}</h3>
              <button className="close-modal-btn" onClick={() => setModalOpen(false)}>×</button>
            </div>

            {inquirySent ? (
              <div className="modal-success-state text-center py-6">
                <CheckCircle2 size={48} className="text-found" />
                <h4>Message Sent!</h4>
                <p>Your inquiry has been forwarded to {item.postedBy}.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="modal-form">
                <p className="modal-instructions">
                  {item.status === 'lost' 
                    ? `Send a message to ${item.postedBy} stating where and when you found their ${item.title.split(' ')[0]}.` 
                    : `Provide proof of ownership or verification details to claim this ${item.title.split(' ')[0]} from ${item.postedBy}.`}
                </p>

                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Enter details here (e.g. Serial numbers, specific stickers, lock screen photo verification description)..."
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-center gap-2">
                    <Send size={16} /> Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
};
export default DetailPage;
