import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import LayoutWrapper from '../layout/LayoutWrapper';
import { User, Mail, Shield, CheckCircle } from 'lucide-react';
import './ProfilePage.css';

export const ProfilePage = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await api.updateProfile(firstName.trim(), lastName.trim(), email);
      refreshUser();
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LayoutWrapper type="sidebar">
      <div className="profile-root animate-fade-in">
        <div className="profile-header">
          <h2>My Profile</h2>
          <p>Manage your account settings and credentials.</p>
        </div>

        {error && <div className="form-error-banner mb-4">{error}</div>}

        <div className="profile-grid">
          <form onSubmit={handleUpdateProfile} className="glass-card profile-form-block">
            <h3 className="section-title"><User size={18} /> Account Details</h3>

            {updateSuccess && (
              <div className="profile-success-banner">
                <CheckCircle size={16} /> Profile details updated successfully!
              </div>
            )}

            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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

            <button type="submit" className="btn btn-primary mt-2" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <form onSubmit={handleUpdatePassword} className="glass-card profile-form-block">
            <h3 className="section-title"><Shield size={18} /> Security & Password</h3>

            {passwordSuccess && (
              <div className="profile-success-banner">
                <CheckCircle size={16} /> Password updated successfully!
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

            <button type="submit" className="btn btn-outline mt-2" disabled={saving}>
              {saving ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default ProfilePage;
