import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LayoutWrapper from '../layout/LayoutWrapper';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './AuthPage.css';

export const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const res = register(firstName.trim(), lastName.trim(), email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <LayoutWrapper>
      <div className="auth-container flex-center">
        <div className="auth-card glass-card animate-fade-in">
          <div className="auth-header text-center">
            <h2>Create an Account</h2>
            <p>Join LostFound to report items, track claims, and help your neighbors.</p>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-row">
              <div className="form-group flex-1">
                <label className="form-label">First Name</label>
                <div className="auth-input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    className="form-input auth-input" 
                    placeholder="e.g. John"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setError(''); }}
                    required
                  />
                </div>
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Last Name</label>
                <div className="auth-input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    className="form-input auth-input" 
                    placeholder="e.g. Doe"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); setError(''); }}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  className="form-input auth-input" 
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input auth-input" 
                  placeholder="Create a strong password"
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input auth-input" 
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn">
              Register
            </button>
          </form>

          <div className="auth-footer text-center">
            <p>Already have an account? <Link to="/login">Sign In instead</Link></p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default RegisterPage;
