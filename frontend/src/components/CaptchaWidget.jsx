import React, { useState } from 'react';
import './CaptchaWidget.css';

export const CaptchaWidget = ({ onVerify }) => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (checked || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setChecked(true);
      onVerify(true);
    }, 1200);
  };

  return (
    <div className="recaptcha-container">
      <div className="recaptcha-widget glass-card">
        <div className="recaptcha-left" onClick={handleCheck}>
          <button 
            type="button" 
            className={`recaptcha-checkbox ${checked ? 'checked' : ''} ${loading ? 'loading' : ''}`}
            aria-label="Verify you are not a robot"
          >
            {loading && <div className="recaptcha-spinner"></div>}
            {checked && (
              <svg className="recaptcha-checkmark animate-draw" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeWidth="3" d="M20 6L9 17L4 12" />
              </svg>
            )}
          </button>
          <span className="recaptcha-label">I'm not a robot</span>
        </div>
        <div className="recaptcha-right">
          <img 
            src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
            alt="reCAPTCHA" 
            className="recaptcha-logo"
          />
          <div className="recaptcha-links">
            <a href="https://www.google.com/intl/en/policies/privacy/" target="_blank" rel="noopener noreferrer">Privacy</a>
            <span>-</span>
            <a href="https://www.google.com/intl/en/policies/terms/" target="_blank" rel="noopener noreferrer">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptchaWidget;
