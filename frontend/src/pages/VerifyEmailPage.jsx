import React, { useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Mail, CheckCircle, ExternalLink } from 'lucide-react';
import './VerifyEmailPage.css';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyUserEmail } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!email) return;
    const success = await verifyUserEmail(email);
    if (success) {
      navigate('/login');
    }
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
            A verification link was sent to <strong className="highlight-email">{email || 'your email'}</strong>.
            Please check your inbox and click the link to activate your account.
          </p>

          {email && (
            <div className="dev-sandbox glass-card-hover">
              <div className="sandbox-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="sandbox-title">Email Verification</span>
                </div>
              </div>

              <div className="sandbox-action-state">
                <p className="sandbox-description">
                  Click below to verify your email and proceed to login.
                </p>
                <button
                  onClick={handleVerify}
                  className="btn btn-primary sandbox-verify-btn flex-center gap-2"
                >
                  <ExternalLink size={16} />
                  <span>Verify Email</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <button className="btn btn-outline" onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default VerifyEmailPage;
