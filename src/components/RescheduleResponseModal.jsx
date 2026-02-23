import React from 'react';

const RescheduleResponseModal = ({ isOpen, onClose, sessionDetails, onApprove, onReject }) => {
    if (!isOpen || !sessionDetails) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
            <div className="modal-content-centered" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%' }}>
                <div className="progress-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Reschedule Request</h2>
                    <button className="progress-modal-close" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="reschedule-modal-body text-left">
                    <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>
                        A reschedule has been requested for this session.
                    </p>

                    <div style={{
                        background: '#f8fafc',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                            Summary
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Original Time</p>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{sessionDetails.date} at {sessionDetails.time}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Proposed New Time</p>
                                <p style={{ fontSize: '15px', fontWeight: '700', color: '#0ea5e9', margin: 0 }}>
                                    {formatDate(sessionDetails.rescheduled_date)} <br />
                                    at {formatTime(sessionDetails.rescheduled_date)}
                                </p>
                            </div>
                            {sessionDetails.reschedule_reason && (
                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '4px' }}>
                                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Reason</p>
                                    <p style={{ fontSize: '13px', color: '#475569', margin: 0, fontStyle: 'italic' }}>
                                        "{sessionDetails.reschedule_reason}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            className="approve-btn"
                            onClick={() => onApprove(sessionDetails)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '100px',
                                background: '#22c55e',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.2)'
                            }}
                        >
                            Approve
                        </button>
                        <button
                            className="reject-btn"
                            onClick={() => onReject(sessionDetails)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '100px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RescheduleResponseModal;
