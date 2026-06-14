import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import LayoutWrapper from '../layout/LayoutWrapper';
import { User, Mail, Shield, Bell, CheckCircle } from 'lucide-react';
import './ProfilePage.css';

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || 'Alice Johnson');
  const [email, setEmail] = useState(user?.email || 'alice@example.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchingAlerts, setMatchingAlerts] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }
    setError('');
    // Mock update
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setPasswordSuccess(true);
    setPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <LayoutWrapper type="sidebar">
      <div className="profile-root animate-fade-in">
        <div className="profile-header">
          <h2>My Profile</h2>
          <p>Manage your account settings, credentials, and notification preferences.</p>
        </div>

        {error && <div className="form-error-banner mb-4">{error}</div>}

        <div className="profile-grid">
          {/* Account Details Form */}
          <form onSubmit={handleUpdateProfile} className="glass-card profile-form-block">
            <h3 className="section-title"><User size={18} /> Account Details</h3>
            
            {updateSuccess && (
              <div className="profile-success-banner">
                <CheckCircle size={16} /> Profile details updated successfully!
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary mt-2">
              Save Profile
            </button>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handleUpdatePassword} className="glass-card profile-form-block">
            <h3 className="section-title"><Shield size={18} /> Security & Password</h3>

            {passwordSuccess && (
              <div className="profile-success-banner">
                <CheckCircle size={16} /> Password updated successfully!
              </div>
            )}

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-outline mt-2">
              Change Password
            </button>
          </form>

          {/* Preferences Settings Block */}
          <div className="glass-card profile-form-block full-width-block">
            <h3 className="section-title"><Bell size={18} /> Notification Preferences</h3>
            <p className="preferences-subtitle">Choose how you want to be notified about potential matches and listings.</p>

            <div className="preference-toggles">
              <label className="preference-toggle-item">
                <div>
                  <span className="pref-title">Email Notifications</span>
                  <span className="pref-desc">Receive account alerts, listing updates, and chat message notifications.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
              </label>

              <label className="preference-toggle-item">
                <div>
                  <span className="pref-title">Auto-Matching Alerts</span>
                  <span className="pref-desc">Get notified immediately when an item matching your lost report is found.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={matchingAlerts}
                  onChange={(e) => setMatchingAlerts(e.target.checked)}
                />
              </label>

              <label className="preference-toggle-item">
                <div>
                  <span className="pref-title">LostFound Community Newsletter</span>
                  <span className="pref-desc">Receive monthly statistics, safety guidelines, and recovery stories.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default ProfilePage;
