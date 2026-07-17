import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './AuthPage.css';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.error || 'Invalid login credentials.');
    }
  };

  return (
    <LayoutWrapper>
      <div className="auth-container flex-center">
        <div className="auth-card glass-card animate-fade-in">
          <div className="auth-header text-center">
            <h2>Sign In to LostFound</h2>
            <p>Welcome back! Enter your details to access your dashboard.</p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-input auth-input"
                  placeholder="e.g. alice@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Password</label>
              </div>
              <div className="auth-input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          <div className="auth-footer text-center">
            <p>Don't have an account? <Link to="/register">Create one here</Link></p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default LoginPage;
