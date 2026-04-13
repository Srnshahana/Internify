import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const TermsConditions = () => {
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
        <h1 className="policy-title">Terms & Conditions</h1>
        
        <div className="policy-section">
          <p className="policy-text">
            These Terms and Conditions govern your access to and use of the Internify platform. 
            By accessing the platform, you agree to be bound by these terms.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">1. Company Information</h2>
          <p className="policy-text">
            The Platform is operated by <strong>Qelora Technologies Pvt. Ltd.</strong> 
            <br />
            Registered Office: Door No. 55, 036 Panampilly Nagar, Kadavanthara, Ernakulam-682020, Kerala, India.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">2. Eligibility</h2>
          <p className="policy-text">
            You must be at least 16 years of age to use the Platform. By using the Platform, 
            you represent and warrant that you have the right, authority, and capacity to enter 
            into this agreement.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">3. Pricing & Refunds</h2>
          <p className="policy-text">
            All prices for programs and mentorship are as listed on the Platform. Fees are generally 
            non-refundable once a program has started or a mentorship session has been used. 
            Refer to specific program details for any exception policies.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">4. Intellectual Property</h2>
          <p className="policy-text">
            The Platform and its original content, features, and functionality are and will remain 
            the exclusive property of Qelora Technologies Pvt. Ltd. Your use of the Platform grants 
            no right or license to reproduce or use any of our trademarks or copyrighted materials.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="policy-section-title">5. Dispute Resolution</h2>
          <p className="policy-text">
            These terms shall be governed by the laws of India. Any disputes arising from these 
            terms or your use of the Platform will be subject to the exclusive jurisdiction of the 
            courts in Ernakulam, Kerala.
          </p>
        </div>

        <div className="policy-section" style={{ borderTop: '1px solid rgba(15, 23, 42, 0.05)', paddingTop: '2rem' }}>
          <p className="policy-text" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            © 2026 Qelora Technologies Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
