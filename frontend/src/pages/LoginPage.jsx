import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import './AuthPage.css';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    const res = login(email, password);
    if (res.success) {
      if (res.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid login credentials.');
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
                <button type="button" className="forgot-password-link" onClick={() => alert('Mock Password Reset: In a production app, this would send an email.')}>
                  Forgot Password?
                </button>
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

            <button type="submit" className="btn btn-primary auth-submit-btn">
              Log In
            </button>
          </form>

          {/* Quick Login Helpers */}
          <div className="quick-login-helpers">
            <p>Quick testing accounts:</p>
            <div className="helper-buttons">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setEmail('alice@example.com');
                  setPassword('password123');
                }}
              >
                👤 User Demo
              </button>
              <button 
                className="btn btn-outline btn-sm admin-helper-btn"
                onClick={() => {
                  setEmail('admin@lostfound.com');
                  setPassword('admin123');
                }}
              >
                <ShieldCheck size={14} /> Admin Demo
              </button>
            </div>
          </div>

          <div className="auth-footer text-center">
            <p>Don't have an account? <Link to="/register">Create one here</Link></p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default LoginPage;
