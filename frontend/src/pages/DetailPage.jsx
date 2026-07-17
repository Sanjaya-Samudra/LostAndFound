import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LayoutWrapper from '../layout/LayoutWrapper';
import { MapPin, Calendar, User, Tag, ArrowLeft, Send, CheckCircle2, AlertTriangle, Bookmark, Flag, MessageSquare } from 'lucide-react';
import './DetailPage.css';

export const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(null);
  const [claimDesc, setClaimDesc] = useState('');
  const [claimProof, setClaimProof] = useState('');
  const [claimSent, setClaimSent] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getItemById(id).then(fetchedItem => {
      if (fetchedItem) setItem(fetchedItem);
    }).catch(() => setItem(null)).finally(() => setLoading(false));
  }, [id]);

  const handleBookmark = async () => {
    try {
      const res = await api.toggleBookmark(id);
      setBookmarked(res.bookmarked);
    } catch {}
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    try {
      await api.createClaim(id, claimDesc, claimProof);
      setClaimSent(true);
      setTimeout(() => { setModalOpen(null); setClaimSent(false); setClaimDesc(''); setClaimProof(''); }, 2000);
    } catch {}
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      await api.submitReport('item', id, reportReason, reportDesc);
      setReportSent(true);
      setTimeout(() => { setModalOpen(null); setReportSent(false); setReportReason(''); setReportDesc(''); }, 2000);
    } catch {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText || !item?.userId) return;
    try {
      await api.startConversation(item.userId, id, msgText);
      setMsgSent(true);
      setTimeout(() => { setModalOpen(null); setMsgSent(false); setMsgText(''); }, 2000);
    } catch {}
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="container py-16 text-center">
          <div className="spinner" />
          <p className="mt-4 text-muted">Loading item details...</p>
        </div>
      </LayoutWrapper>
    );
  }

  if (!item) {
    return (
      <LayoutWrapper>
        <div className="container py-12 text-center empty-detail-container">
          <AlertTriangle size={48} className="empty-icon" />
          <h2>Item Not Found</h2>
          <p>The item you are looking for does not exist or has been removed.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="container py-8 detail-root">
        <button className="btn btn-outline back-nav-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="detail-layout">
          <div className="detail-main glass-card">
            <div className="detail-image-container">
              <img src={item.images[selectedImageIndex] || item.image} alt={item.title} className="detail-image" />
              <span className={`badge detail-status-badge ${item.status === 'lost' ? 'badge-lost' : item.status === 'found' ? 'badge-found' : 'badge-claimed'}`}>{item.status}</span>
            </div>
            {item.images.length > 1 && (
              <div className="detail-thumbnails-row">
                {item.images.map((img, i) => (
                  <button key={i} className={`detail-thumb-btn ${i === selectedImageIndex ? 'active' : ''}`} onClick={() => setSelectedImageIndex(i)}>
                    <img src={img} alt={`${item.title} ${i + 1}`} className="detail-thumb-img" />
                  </button>
                ))}
              </div>
            )}
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

          <div className="detail-sidebar">
            <div className="sidebar-block info-block glass-card">
              <h3>Item Specifics</h3>
              <div className="info-list">
                <div className="info-item"><MapPin size={18} className="info-item-icon" /><div><span className="info-label">Location</span><span className="info-value">{item.location}</span></div></div>
                <div className="info-item"><Calendar size={18} className="info-item-icon" /><div><span className="info-label">Date Reported</span><span className="info-value">{item.date}</span></div></div>
                <div className="info-item"><User size={18} className="info-item-icon" /><div><span className="info-label">Reported By</span><span className="info-value">{item.postedBy}</span></div></div>
              </div>

              {user && (
                <div className="flex flex-col gap-2 mt-4">
                  {item.status !== 'claimed' && (
                    <button className="btn btn-primary w-full" onClick={() => setModalOpen('claim')}>
                      <Send size={16} /> {item.status === 'lost' ? 'I Found This' : 'Claim This Item'}
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <button className="btn btn-outline flex-1 btn-sm" onClick={handleBookmark}>
                      <Bookmark size={14} /> {bookmarked ? 'Saved' : 'Save'}
                    </button>
                    <button className="btn btn-outline flex-1 btn-sm" onClick={() => setModalOpen('message')}>
                      <MessageSquare size={14} /> Message
                    </button>
                    <button className="btn btn-outline btn-icon btn-sm" onClick={() => setModalOpen('report')} title="Report">
                      <Flag size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen === 'claim' && (
        <div className="modal-overlay flex-center" onClick={() => setModalOpen(null)}>
          <div className="modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{item.status === 'lost' ? 'Report Finding This Item' : 'Claim This Item'}</h3>
              <button className="close-modal-btn" onClick={() => setModalOpen(null)}>×</button>
            </div>
            {claimSent ? (
              <div className="modal-success-state text-center py-6">
                <CheckCircle2 size={48} className="text-found" />
                <h4>Claim Submitted!</h4>
                <p>The owner will review your claim and get back to you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitClaim} className="modal-form">
                <p className="modal-instructions">Describe how you found this item or provide proof of ownership to verify your claim.</p>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} placeholder="Describe the item and how you came to find/lose it..." value={claimDesc} onChange={e => setClaimDesc(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Proof Details (optional)</label>
                  <textarea className="form-input" rows={2} placeholder="Any identifying details that prove ownership..." value={claimProof} onChange={e => setClaimProof(e.target.value)} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setModalOpen(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary"><Send size={16} /> Submit</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {modalOpen === 'message' && (
        <div className="modal-overlay flex-center" onClick={() => setModalOpen(null)}>
          <div className="modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Message {item.postedBy}</h3>
              <button className="close-modal-btn" onClick={() => setModalOpen(null)}>×</button>
            </div>
            {msgSent ? (
              <div className="modal-success-state text-center py-6">
                <CheckCircle2 size={48} className="text-found" />
                <h4>Message Sent!</h4>
                <p>Check your inbox for replies.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea className="form-input" rows={4} placeholder="Write your message..." value={msgText} onChange={e => setMsgText(e.target.value)} required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setModalOpen(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary"><Send size={16} /> Send</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {modalOpen === 'report' && (
        <div className="modal-overlay flex-center" onClick={() => setModalOpen(null)}>
          <div className="modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Item</h3>
              <button className="close-modal-btn" onClick={() => setModalOpen(null)}>×</button>
            </div>
            {reportSent ? (
              <div className="modal-success-state text-center py-6">
                <CheckCircle2 size={48} className="text-found" />
                <h4>Report Submitted!</h4>
                <p>An admin will review your report.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <select className="form-input" value={reportReason} onChange={e => setReportReason(e.target.value)} required>
                    <option value="">Select a reason...</option>
                    <option value="spam">Spam</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="fake">Fake Listing</option>
                    <option value="wrong_category">Wrong Category</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description (optional)</label>
                  <textarea className="form-input" rows={3} placeholder="Provide more details..." value={reportDesc} onChange={e => setReportDesc(e.target.value)} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setModalOpen(null)}>Cancel</button>
                  <button type="submit" className="btn btn-danger">Submit Report</button>
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
