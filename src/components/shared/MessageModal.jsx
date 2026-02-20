import React from 'react';
import '../../App.css'; // Ensure we have access to global styles

const MessageModal = ({ isOpen, onClose, title, message, type = 'info', onConfirm }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const isError = type === 'error';

    // Determine icon and color based on type
    let icon = 'info';
    let iconColor = '#3b82f6'; // blue-500
    let typeClass = 'info';

    if (isSuccess) {
        icon = 'check_circle';
        iconColor = '#10b981'; // emerald-500
        typeClass = 'success';
    } else if (isError) {
        icon = 'error';
        iconColor = '#ef4444'; // red-500
        typeClass = 'error';
    }

    return (
        <div className="course-modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
            <div
                className={`course-modal-content message-modal ${typeClass}`}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '400px', width: '90%', padding: '0', textAlign: 'center', overflow: 'hidden' }}
            >
                <div style={{ padding: '32px 24px 24px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '16px'
                    }}>
                        <span className="material-symbols-outlined" style={{
                            fontSize: '48px',
                            color: iconColor,
                            fontVariationSettings: "'FILL' 1"
                        }}>
                            {icon}
                        </span>
                    </div>

                    <h3 style={{
                        margin: '0 0 8px',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1e293b'
                    }}>
                        {title}
                    </h3>

                    <p style={{
                        margin: '0 0 24px',
                        color: '#64748b',
                        fontSize: '15px',
                        lineHeight: '1.5'
                    }}>
                        {message}
                    </p>

                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: isError ? '#ef4444' : '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {isSuccess ? 'Continue' : 'Okay'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
