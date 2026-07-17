import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Lock, CheckCircle } from 'lucide-react';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWrapper>
      <div className="container py-16" style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          {done ? (
            <div className="text-center">
              <CheckCircle size={48} style={{ color: 'var(--color-found)', marginBottom: 16 }} />
              <h2>Password Reset!</h2>
              <p className="text-muted mt-2">Your password has been updated successfully.</p>
              <Link to="/login" className="btn btn-primary mt-4">Login</Link>
            </div>
          ) : (
            <>
              <h2>Reset Password</h2>
              <p className="text-muted mb-4">Enter your new password.</p>
              {error && <div className="form-error-banner mb-4">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="search-input-wrapper">
                    <Lock className="search-icon" size={16} />
                    <input type="password" className="form-input search-input" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-input" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default ResetPasswordPage;
