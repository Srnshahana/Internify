import React from 'react';

const CourseDetailsModal = ({ isOpen, onClose, course, onSearchMentors }) => {
    if (!isOpen || !course) return null;

    return (
        <div className="course-modal-overlay" onClick={onClose} style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="course-modal-content" onClick={(e) => e.stopPropagation()} style={{
                background: '#fff', borderRadius: '24px', width: '90%', maxWidth: '600px',
                overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex', flexDirection: 'column', maxHeight: '90vh'
            }}>
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    <img 
                        src={course.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBdt2bdOr6yNUso2UGqXJRcNpnjWeSlpumaw&s'} 
                        alt={course.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBdt2bdOr6yNUso2UGqXJRcNpnjWeSlpumaw&s';
                        }}
                    />
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '16px', right: '16px', background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#0f172a' }}>close</span>
                    </button>
                    {course.career_field && (
                        <span style={{
                            position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(255, 255, 255, 0.95)',
                            padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '700',
                            color: '#2a7eff', textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                            {course.career_field}
                        </span>
                    )}
                </div>

                <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            {course.estimated_time && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    {course.estimated_time}
                                </div>
                            )}
                            {course.price_range && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                                    {course.price_range.replace(/\$/g, '').trim().includes('₹') ? course.price_range.replace(/\$/g, '').trim() : `₹ ${course.price_range.replace(/\$/g, '').trim()}`}
                                </div>
                            )}
                            {course.skill_level && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    {course.skill_level}
                                </div>
                            )}
                        </div>

                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', lineHeight: '1.3' }}>
                            {course.title}
                        </h2>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>About this course</h3>
                            <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6' }}>
                                {course.description || 'Master professional skills with expert-led training and real-world projects. Connect with top industry mentors to guide your learning journey and accelerate your career growth.'}
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            onClose();
                            onSearchMentors(course.course_id || course.id);
                        }}
                        style={{
                            width: '100%', background: '#0f172a', color: '#ffffff', border: 'none',
                            padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '600',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.15)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        Search for Mentor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsModal;
