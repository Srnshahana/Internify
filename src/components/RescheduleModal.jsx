import React, { useState } from 'react';

const RescheduleModal = ({ isOpen, onClose, onConfirm, sessionDetails }) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({ newDate, newTime, reason });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
            <div className="modal-content-centered" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%' }}>
                <div className="progress-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Reschedule Session</h2>
                    <button className="progress-modal-close" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="reschedule-modal-body text-left">
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                        Propose a new date and time for <strong>{sessionDetails?.title}</strong>.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>New Date</label>
                            <input
                                type="date"
                                required
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '14px',
                                    width: '100%'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>New Time</label>
                            <input
                                type="time"
                                required
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '14px',
                                    width: '100%'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Reason (Optional)</label>
                            <textarea
                                placeholder="E.g., Medical emergency, power outage..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '14px',
                                    minHeight: '80px',
                                    resize: 'vertical',
                                    width: '100%'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '100px',
                                    border: 'none',
                                    background: '#0ea5e9',
                                    color: 'white',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)'
                                }}
                            >
                                Send Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RescheduleModal;
