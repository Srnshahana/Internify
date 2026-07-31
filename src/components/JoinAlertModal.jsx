import React from 'react';
import { createPortal } from 'react-dom';

const JoinAlertModal = ({ isOpen, onClose, title, message, type = 'warning' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '50%', color: '#ef4444' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        );
      case 'warning':
      default:
        return (
          <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '50%', color: '#f59e0b' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        );
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2147483647 }}>
      <div 
        className="modal-content-centered shadow-lg ring-1 ring-black/5" 
        style={{ borderRadius: '24px', border: '1px solid #e2e8f0', maxWidth: '400px', width: '90%', padding: '24px', textAlign: 'center' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          {getIcon()}
        </div>
        
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
          {title}
        </h3>
        
        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
          {message}
        </p>

        <button 
          onClick={onClose}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#2a7eff', 
            border: 'none', 
            borderRadius: '100px', 
            color: '#fff', 
            fontWeight: '600', 
            cursor: 'pointer', 
            fontSize: '14px', 
            boxShadow: '0 4px 12px rgba(42, 126, 255, 0.25)', 
            transition: 'all 0.2s' 
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default JoinAlertModal;
