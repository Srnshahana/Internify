import React from 'react';
import '../App.css';
import { CertificateIcon } from './Icons.jsx';

const StudentProfileTemplate = ({ profileData, onClose }) => {
    if (!profileData) return null;

    // Helper function to ensure data is an array
    const ensureArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return [value];
    };

    const name = profileData.name || 'Student Name';
    const bio = profileData.bio || profileData.about || 'No bio available';
    const location = profileData.location || profileData.address || 'Location not specified';
    const profileImage = profileData.profile_image || profileData.image || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop";
    const email = profileData.email || 'Email not provided';
    const roles = profileData.career_fields || [profileData.role || 'Aspiring Developer'];
    const skills = profileData.skills || [];
    const education = ensureArray(profileData.education);
    const internships = ensureArray(profileData.internships);
    const certifications = ensureArray(profileData.certifications || profileData.certificates);

    return (
        <div className="profile-page-elegant" style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '800px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Profile Cover */}
            <div className="profile-cover-elegant" style={{ height: '150px', background: 'linear-gradient(to right, #3b82f6, #6366f1)' }}></div>

            <div className="profile-content-wrapper" style={{ padding: '0 24px 32px' }}>
                {/* Intro Card */}
                <div className="profile-intro-card" style={{ marginTop: '-60px', background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
                    <div className="profile-intro-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div className="profile-avatar-linkedin" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid white', overflow: 'hidden', background: 'white' }}>
                            <img src={profileImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <button
                            onClick={onClose}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="profile-intro-info" style={{ marginTop: '16px' }}>
                        <h1 className="profile-name-linkedin" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{name}</h1>
                        <p className="profile-headline-tech" style={{ color: '#475569', fontSize: '1.1rem', margin: '4px 0 0' }}>{roles.join(' | ')}</p>
                        <div className="profile-location-linkedin" style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            {location}
                            <span style={{ margin: '0 8px' }}>•</span>
                            <span style={{ color: '#3b82f6', fontWeight: 600 }}>{email}</span>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="profile-section-card" style={{ marginTop: '24px', background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                    <h2 className="section-title-linkedin" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>About</h2>
                    <p className="profile-bio-linkedin" style={{ color: '#334155', lineHeight: '1.6', margin: 0 }}>{bio}</p>
                </div>

                {/* Skills Section */}
                {skills.length > 0 && (
                    <div className="profile-section-card" style={{ marginTop: '24px', background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h2 className="section-title-linkedin" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>Skills</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {skills.map((skill, index) => (
                                <span key={index} style={{ background: '#f1f5f9', color: '#475569', padding: '6px 14px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 500 }}>{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience/Internships Section */}
                {internships.length > 0 && (
                    <div className="profile-section-card" style={{ marginTop: '24px', background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h2 className="section-title-linkedin" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Experience</h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {internships.map((job, index) => (
                                <div key={index} style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{job.title}</h3>
                                        <p style={{ margin: '2px 0 0', color: '#475569' }}>{job.company} • {job.location}</p>
                                        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>{job.startDate} - {job.endDate}</p>
                                        {job.description && <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5' }}>{job.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education Section */}
                {education.length > 0 && (
                    <div className="profile-section-card" style={{ marginTop: '24px', background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h2 className="section-title-linkedin" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Education</h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {education.map((edu, index) => (
                                <div key={index} style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{edu.institution || edu.school || edu.college}</h3>
                                        <p style={{ margin: '2px 0 0', color: '#475569' }}>{edu.degree}</p>
                                        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>{edu.startYear} - {edu.endYear || edu.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications Section */}
                {certifications.length > 0 && (
                    <div className="profile-section-card" style={{ marginTop: '24px', background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h2 className="section-title-linkedin" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Certifications</h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {certifications.map((cert, index) => (
                                <div key={index} style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', color: '#3b82f6' }}>
                                        <CertificateIcon />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{cert.name || cert.title}</h3>
                                        <p style={{ margin: '2px 0 0', color: '#475569' }}>{cert.issuer || cert.organization}</p>
                                        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Issued {cert.date || cert.issueDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfileTemplate;
