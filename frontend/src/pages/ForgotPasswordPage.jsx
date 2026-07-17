import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWrapper>
      <div className="container py-16" style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          {sent ? (
            <div className="text-center">
              <CheckCircle size={48} style={{ color: 'var(--color-found)', marginBottom: 16 }} />
              <h2>Check Your Email</h2>
              <p className="text-muted mt-2">If an account with that email exists, a password reset link has been sent. Check the server console for the link.</p>
              <Link to="/login" className="btn btn-outline mt-4"><ArrowLeft size={16} /> Back to Login</Link>
            </div>
          ) : (
            <>
              <h2>Forgot Password</h2>
              <p className="text-muted mb-4">Enter your email and we'll send you a reset link.</p>
              {error && <div className="form-error-banner mb-4">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="search-input-wrapper">
                    <Mail className="search-icon" size={16} />
                    <input type="email" className="form-input search-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
              </form>
              <p className="text-center mt-4"><Link to="/login" className="text-muted"><ArrowLeft size={14} /> Back to Login</Link></p>
            </>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default ForgotPasswordPage;
