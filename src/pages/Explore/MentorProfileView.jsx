import { useEffect, useState } from 'react'
import '../../App.css'
import { getCourseById } from '../../data/staticData.js'

export default function MentorProfile({ mentor, onBack, renderStars, courses = [], onBookSession }) {
  const [activeTab, setActiveTab] = useState('about')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!mentor) return null

  // Support both image and profileImage for backward compatibility
  const profileImg = mentor.profileImage || mentor.image || 'https://via.placeholder.com/150'
  const isVerified = mentor.isVerified || mentor.assured || false
  const isPlatformAssured = mentor.platformAssured || false

  const stats = [
    { label: 'Experience', value: `${mentor.experienceYears || mentor.experience || 5}y+` },
    { label: 'Rating', value: mentor.rating || '5.0' },
    { label: 'Mentees', value: '120+' },
    { label: 'Reviews', value: `${mentor.testimonials?.length || 24}` },
  ]

  const mentorCourses = mentor.coursesOffered || mentor.courses || []
  const skills = mentor.skills || []
  const expertise = mentor.expertise || []
  const education = mentor.education || []
  const experience = mentor.experience || []
  const testimonials = mentor.testimonials || []

  return (
    <div className="profile-page-elegant">
      {/* Profile Cover */}
      <div className="profile-cover-elegant">
        <button className="back-button-floating-premium" onClick={onBack} style={{ top: '20px', left: '20px', position: 'absolute', zIndex: 10 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="profile-content-wrapper">
        {/* LinkedIn-style Intro Card */}
        <div className="profile-intro-card">
          <div className="profile-intro-header">
            <div className="profile-avatar-linkedin" style={{ background: '#f1f5f9', overflow: 'hidden' }}>
              <img
                src={profileImg}
                alt={mentor.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=320&q=80' }}
              />
            </div>
          </div>

          <div className="profile-intro-info">
            <div className="profile-main-details">
              <div className="profile-name-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 className="profile-name-linkedin">{mentor.name || 'Mentor'}</h1>
                {isVerified && (
                  <span className="verified-badge-soft" title="Verified Mentor" style={{ width: '20px', height: '20px', position: 'static' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  </span>
                )}
                {isPlatformAssured && (
                  <span className="assured-badge-premium" title="Platform Assured" style={{ background: '#0ea5e9', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>
                    ASSURED
                  </span>
                )}
              </div>
              <p className="profile-headline-tech">
                {mentor.role || 'Expert Mentor'} {mentor.company && <span>|</span>} {mentor.company}
              </p>

              <div className="profile-location-linkedin">
                <span className="location-text">
                  {mentor.location || 'Remote'}
                </span>
                <span className="bullet-separator">•</span>
                <span className="category-text" style={{ color: '#0ea5e9' }}>{mentor.category}</span>
              </div>

              <div className="profile-connections-linkedin">
                <span className="connection-count" style={{ color: '#0ea5e9', fontWeight: '600' }}>
                  {mentor.rating || '5.0'} Rating • {testimonials.length} reviews • 500+ pupils
                </span>
              </div>
            </div>

            <div className="profile-actions-linkedin">
              <button className="btn-linkedin-primary" style={{ background: '#0ea5e9' }} onClick={() => onBookSession && onBookSession()}>Book Session</button>
              <button className="btn-linkedin-secondary">Send Message</button>
              <button className="btn-linkedin-tertiary">More</button>
            </div>
          </div>
        </div>

        {/* Professional Stats Section */}
        <div className="profile-section-card">
          <div className="profile-section-header-linkedin">
            <h2 className="section-title-linkedin">Professional Snapshot</h2>
          </div>
          <div className="profile-stats-linkedin">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item-linkedin">
                <div className="stat-icon-wrapper" style={{ color: '#0ea5e9' }}>
                  {stat.label === 'Experience' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>}
                  {stat.label === 'Rating' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>}
                  {stat.label === 'Mentees' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                  {stat.label === 'Reviews' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
                </div>
                <div className="stat-text-content">
                  <span className="stat-value-linkedin">{stat.value}</span>
                  <span className="stat-label-linkedin">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="profile-section-card">
          <div className="profile-section-header-linkedin">
            <h2 className="section-title-linkedin">About</h2>
          </div>
          <p className="profile-bio-linkedin" style={{ lineHeight: '1.6', color: '#475569' }}>
            {mentor.bio || `Experienced ${mentor.role} dedicated to helping students bridge the gap between learning and career success.`}
          </p>
          {(skills.length > 0 || expertise.length > 0) && (
            <div className="skills-grid-premium" style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[...new Set([...skills, ...expertise])].map((skill, idx) => (
                <span key={idx} className="skill-pill-premium" style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '16px', fontSize: '13px' }}>
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="profile-section-card">
            <div className="profile-section-header-linkedin">
              <h2 className="section-title-linkedin">Experience</h2>
            </div>
            <div className="timeline-linkedin">
              {experience.map((exp, idx) => (
                <div key={idx} className="timeline-item-linkedin">
                  <div className="timeline-logo-linkedin">
                    <div className="company-logo-placeholder" style={{ background: '#0ea5e9', color: 'white' }}>
                      {(exp.company || exp.organization || 'E').charAt(0)}
                    </div>
                  </div>
                  <div className="timeline-content-linkedin">
                    <h3 className="timeline-role-linkedin">{exp.title || exp.role || exp.job_title}</h3>
                    <p className="timeline-company-linkedin">{exp.company || exp.organization || exp.employer}</p>
                    <p className="timeline-date-linkedin">
                      {exp.duration || `${exp.startDate} - ${exp.endDate || 'Present'}`}
                    </p>
                    <p className="timeline-location-linkedin">{exp.location}</p>
                    <p className="timeline-desc-linkedin">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <div className="profile-section-card">
            <div className="profile-section-header-linkedin">
              <h2 className="section-title-linkedin">Education</h2>
            </div>
            <div className="timeline-linkedin">
              {education.map((edu, idx) => (
                <div key={idx} className="timeline-item-linkedin">
                  <div className="timeline-logo-linkedin">
                    <div className="company-logo-placeholder" style={{ background: '#64748b', color: 'white' }}>
                      {(edu.institution || 'U').charAt(0)}
                    </div>
                  </div>
                  <div className="timeline-content-linkedin">
                    <h3 className="timeline-role-linkedin">{edu.degree}</h3>
                    <p className="timeline-company-linkedin">{edu.institution}</p>
                    <p className="timeline-date-linkedin">{edu.year || `${edu.startYear} - ${edu.endYear}`}</p>
                    {edu.gpa && <p className="timeline-location-linkedin">GPA: {edu.gpa}</p>}
                    <p className="timeline-desc-linkedin">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Offered Section */}
        {mentorCourses.length > 0 && (
          <div className="profile-section-elegant">
            <div className="profile-section-header-elegant" style={{ marginBottom: '20px' }}>
              <h2 className="profile-section-title-elegant">Courses Offered</h2>
            </div>
            <div className="courses-grid-elegant" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {mentorCourses.map((courseIdOrObj) => {
                const course = typeof courseIdOrObj === 'number' ? getCourseById(courseIdOrObj) : courseIdOrObj
                if (!course) return null
                return (
                  <div key={course.id} className="course-card-elegant">
                    <div className="course-image-wrapper-elegant">
                      <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'} alt={course.title || course.name} className="course-image-elegant" />
                      <div className="course-status-pill-elegant" style={{ backgroundColor: '#0ea5e9' }}>
                        {course.students || '45+'} Students
                      </div>
                    </div>
                    <div className="course-content-elegant">
                      <div className="course-header-elegant">
                        <span className="course-category-elegant">{course.category || course.career_field}</span>
                        <div className="course-rating-box">
                          <span className="star-icon">★</span>
                          <span>{course.rating || '4.8'}</span>
                        </div>
                      </div>
                      <h3 className="course-title-elegant">{course.title || course.name}</h3>
                      <p className="course-mentor-elegant">{course.level || course.skill_level}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {testimonials.length > 0 && (
          <div className="profile-section-card">
            <div className="profile-section-header-linkedin">
              <h2 className="section-title-linkedin">Reviews & Feedback</h2>
            </div>
            <div className="reviews-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {testimonials.map((review, idx) => (
                <div key={idx} className="review-card" style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                  <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#0ea5e9' }}>
                        {(review.studentName || review.name || 'S').charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{review.studentName || review.name}</h4>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>{review.studentRole || review.title}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#fbbf24' }}>{renderStars ? renderStars(review.rating || 5) : '★★★★★'}</div>
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>{review.date || 'Recent'}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{review.comment || review.quote}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
