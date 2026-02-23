import React, { useState } from 'react';

const RescheduleModal = ({ isOpen, onClose, onConfirm, sessionDetails }) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [reason, setReason] = useState('');

    React.useEffect(() => {
        if (sessionDetails?.scheduled_date) {
            const dateObj = new Date(sessionDetails.scheduled_date);

            // Format YYYY-MM-DD for <input type="date">
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            setNewDate(`${year}-${month}-${day}`);

            // Format HH:mm for <input type="time">
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            setNewTime(`${hours}:${minutes}`);
        } else {
            setNewDate('');
            setNewTime('');
        }
        setReason(''); // Reset reason when modal opens/changes session
    }, [sessionDetails, isOpen]);

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
                    <div style={{
                        background: '#f8fafc',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                            Current Session
                        </p>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94a3b8' }}>calendar_month</span>
                                <div>
                                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Date</p>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{sessionDetails?.date}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94a3b8' }}>schedule</span>
                                <div>
                                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Time</p>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{sessionDetails?.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>
                        Propose a new date and time for this session.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>New Date</label>
                            <div
                                style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                onClick={(e) => {
                                    const input = e.currentTarget.querySelector('input');
                                    input?.showPicker?.();
                                }}
                            >
                                <span className="material-symbols-outlined" style={{
                                    position: 'absolute',
                                    left: '12px',
                                    color: '#94a3b8',
                                    fontSize: '20px',
                                    pointerEvents: 'none',
                                    zIndex: 2
                                }}>calendar_month</span>
                                <input
                                    type="date"
                                    required
                                    value={newDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    style={{
                                        padding: '10px 12px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                        width: '100%',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        cursor: 'pointer',
                                        backgroundColor: '#ffffff',
                                        zIndex: 1
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.target.showPicker?.();
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>New Time</label>
                            <div
                                style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                onClick={(e) => {
                                    const input = e.currentTarget.querySelector('input');
                                    input?.showPicker?.();
                                }}
                            >
                                <span className="material-symbols-outlined" style={{
                                    position: 'absolute',
                                    left: '12px',
                                    color: '#94a3b8',
                                    fontSize: '20px',
                                    pointerEvents: 'none',
                                    zIndex: 2
                                }}>schedule</span>
                                <input
                                    type="time"
                                    required
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    style={{
                                        padding: '10px 12px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                        width: '100%',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        cursor: 'pointer',
                                        backgroundColor: '#ffffff',
                                        zIndex: 1
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.target.showPicker?.();
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
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
