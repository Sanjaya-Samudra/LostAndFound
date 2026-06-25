import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Mail, CheckCircle, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import './VerifyEmailPage.css';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const { verifyUserEmail } = useContext(AuthContext);
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setResendStatus('');
    
    // Simulate sending email
    setTimeout(() => {
      setIsResending(false);
      setCountdown(60);
      setResendStatus('Verification email resent successfully!');
    }, 1500);
  };

  const handleSimulateVerify = () => {
    setVerificationSuccess(true);
    verifyUserEmail(email);
    
    // Redirect to login page after showing success animation
    setTimeout(() => {
      navigate('/login?verified=true');
    }, 2000);
  };

  return (
    <LayoutWrapper>
      <div className="verify-container flex-center">
        <div className="verify-card glass-card animate-fade-in text-center">
          <div className="verify-icon-wrapper flex-center">
            <Mail className="verify-icon" size={36} />
          </div>

          <h2>Verify Your Email</h2>
          <p className="verify-instructions">
            We've sent a verification link to <strong className="highlight-email">{email}</strong>.
            Please check your inbox and click the link to activate your account.
          </p>

          {resendStatus && (
            <div className="verify-success-banner">
              <CheckCircle size={16} /> {resendStatus}
            </div>
          )}

          <div className="resend-section">
            <button 
              onClick={handleResend}
              className={`btn btn-outline resend-btn ${countdown > 0 ? 'disabled' : ''}`}
              disabled={countdown > 0 || isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> Resending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </button>
            {countdown > 0 && (
              <p className="resend-countdown">Resend available in {countdown}s</p>
            )}
          </div>

          {/* Dev Mode Simulated Email Inbox client block */}
          <div className="dev-sandbox glass-card-hover">
            <div className="sandbox-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-secondary" />
                <span className="sandbox-title">Dev Testing Sandbox</span>
              </div>
              <span className="sandbox-badge">Simulation</span>
            </div>
            
            {verificationSuccess ? (
              <div className="sandbox-success-state animate-fade-in">
                <div className="checkmark-circle">
                  <svg viewBox="0 0 24 24" className="checkmark-svg">
                    <path fill="none" stroke="currentColor" strokeWidth="3" d="M20 6L9 17L4 12" />
                  </svg>
                </div>
                <h4>Email Verified!</h4>
                <p>Redirecting you to log in...</p>
              </div>
            ) : (
              <div className="sandbox-action-state">
                <p className="sandbox-description">
                  Since this is a simulated frontend environment, click below to mock clicking the activation link in your email.
                </p>
                <button 
                  onClick={handleSimulateVerify} 
                  className="btn btn-primary sandbox-verify-btn flex-center gap-2"
                >
                  <ExternalLink size={16} />
                  <span>Simulate Verification Link</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default VerifyEmailPage;
