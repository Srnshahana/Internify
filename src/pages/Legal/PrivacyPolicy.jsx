import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <nav className="simple-navbar" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
        <div className="nav-container-new">
          <div className="nav-logo-group" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="nav-logo-text">Internify</span>
          </div>
          <div className="nav-links-right">
            <button className="nav-login-btn-new" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </nav>

      <div className="policy-container">
        <div className="policy-meta">Effective Date: January 21, 2026</div>
        <h1 className="policy-title">Privacy Policy</h1>
        
        <div className="policy-section">
          <p className="policy-text">
            This Privacy Policy describes how <strong>Qelora Technologies Pvt. Ltd.</strong> (CIN: U63120KL2025PTC098876) 
            collects, uses, and discloses your personal information when you use the Internify platform.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">1. Information We Collect</h2>
          <p className="policy-text">
            We collect information that you provide directly to us when you create an account, apply for mentorship, 
            enroll in a program, or communicate with us. This may include your name, email address, educational 
            background, professional experience, and payment details.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">2. How We Use Your Information</h2>
          <p className="policy-text">
            We use the information we collect to provide, maintain, and improve our services, including connecting 
            students with mentors, processing certificates, and facilitating career referrals. We also use your 
            information to communicate with you about updates and opportunities.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">3. Data Security</h2>
          <p className="policy-text">
            We take reasonable measures to protect your personal information from loss, theft, misuse, and 
            unauthorized access. However, no internet transmission is ever completely secure or error-free.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">4. Your Rights</h2>
          <p className="policy-text">
            Under applicable Indian laws, you have the right to access, correct, or delete your personal information. 
            You may manage your information through your account settings or by contacting our support team.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">5. Contact Information</h2>
          <p className="policy-text">
            If you have any questions about this Privacy Policy, please contact us at: 
            <br />
            <strong>internship@internify.online</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
