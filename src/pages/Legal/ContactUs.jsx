import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InteractiveGrid } from '../Landing/LandingPage';
import '../../App.css';

const ContactUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <InteractiveGrid />
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

      <div className="policy-container" style={{ marginTop: '40px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)' }}>
        <h1 className="policy-title">Contact Us</h1>
        
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          <div className="contact-info">
            <div className="policy-section">
              <h2 className="policy-section-title">Get in touch</h2>
              <p className="policy-text">
                Have questions about our programs or mentorship? Our team is here to help you navigate your career journey.
              </p>
            </div>

            <div className="policy-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                 <span className="material-symbols-outlined" style={{ color: '#2356c6' }}>mail</span>
                 <div>
                   <h4 style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6 }}>Email Address</h4>
                   <p style={{ margin: 0, fontWeight: 600 }}>internship@internify.online</p>
                 </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                 <span className="material-symbols-outlined" style={{ color: '#2356c6' }}>location_on</span>
                 <div>
                   <h4 style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6 }}>Office Location</h4>
                   <p style={{ margin: 0, fontWeight: 600 }}>Ernakulam, Kerala, India</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(15, 23, 42, 0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>Send a Message</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.7 }}>Full Name</label>
                  <input type="text" placeholder="John Doe" style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.7 }}>Email Address</label>
                  <input type="email" placeholder="john@example.com" style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.7 }}>Your Question</label>
                  <textarea rows="4" placeholder="How can we help?" style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', resize: 'none' }}></textarea>
                </div>

                <button className="nav-login-btn-new" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
