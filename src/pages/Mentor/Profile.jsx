import { useState, useRef } from 'react'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import { SettingsIcon, LogoutIcon } from '../../components/Icons.jsx'

const useDragScroll = () => {
  const ref = useRef(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e) => {
    isDown.current = true
    ref.current.classList.add('is-dragging')
    startX.current = e.pageX - ref.current.offsetLeft
    scrollLeft.current = ref.current.scrollLeft
  }
  const onMouseLeave = () => {
    isDown.current = false
    ref.current?.classList.remove('is-dragging')
  }
  const onMouseUp = () => {
    isDown.current = false
    ref.current?.classList.remove('is-dragging')
  }
  const onMouseMove = (e) => {
    if (!isDown.current) return
    e.preventDefault()
    const x = e.pageX - ref.current.offsetLeft
    const walk = (x - startX.current) * 2
    ref.current.scrollLeft = scrollLeft.current - walk
  }

  const scroll = (direction) => {
    if (ref.current) {
      const amount = direction === 'left' ? -320 : 320
      ref.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return { ref, events: { onMouseDown, onMouseLeave, onMouseUp, onMouseMove }, scroll }
}

function MentorProfile({ onLogout }) {
  const { userProfile, enrolledCourses: taughtCourses, loading } = useDashboardData()
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const coursesDrag = useDragScroll()

  if (loading) {
    return (
      <div className="profile-page-elegant" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#0ea5e9', fontWeight: '500' }}>Loading profile...</p>
      </div>
    )
  }

  // Calculate unique courses taught for the "Courses Offered" section
  const uniqueTaughtCourses = taughtCourses ? Array.from(new Map(taughtCourses.map(c => [c.course_id, c])).values()) : []

  const mentorDisplayData = {
    name: userProfile?.name || userProfile?.full_name || 'Expert Mentor',
    role: Array.isArray(userProfile?.category) ? userProfile.category[0] : (userProfile?.category || 'Mentor'),
    title: userProfile?.title || 'Professional Educator & Industry Expert',
    location: userProfile?.address || 'Worldwide',
    profilePicture: userProfile?.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: userProfile?.about || 'Experienced professional dedicated to helping students and mentees achieve their full potential through personalized guidance and real-world project experience.',
    experienceYears: userProfile?.experience_years || 8,
    menteesCoached: taughtCourses?.length || 0,
    averageRating: userProfile?.rating || 4.8,
    totalReviews: userProfile?.testimonial?.length || 45,
    offersFrom: userProfile?.offers_from || ['Google', 'Stripe', 'Swiggy'],
    education: userProfile?.education || [],
    experience: userProfile?.experience || [],
    expertise: userProfile?.experties_in || [],
    testimonials: userProfile?.testimonial || []
  }

  const renderStars = (rating) => {
    const validRating = Math.min(5, Math.max(0, rating)) // Cap at 5 for UI stars
    const full = Math.floor(validRating)
    const half = validRating - full >= 0.5
    return Array(5).fill(0).map((_, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
  }

  const stats = [
    { label: 'Exp. Years', value: `${mentorDisplayData.experienceYears}+` },
    { label: 'Mentees', value: `${mentorDisplayData.menteesCoached}+` },
    { label: 'Rating', value: mentorDisplayData.averageRating },
    { label: 'Courses', value: uniqueTaughtCourses.length },
  ]

  const mockReviews = [
    { id: 1, studentName: 'Sherin', studentRole: 'Software Engineer', rating: 5, date: '2024-02-15', comment: 'Alex is an amazing mentor! The sessions were super clear and structured. I finally shipped my first real project with confidence. Highly recommend!' },
    { id: 2, studentName: 'Rahul', studentRole: 'Frontend Developer', rating: 5, date: '2024-02-10', comment: 'Great mix of theory and hands-on guidance. Weekly feedback kept me accountable and moving. The code reviews were incredibly helpful.' },
    { id: 3, studentName: 'Fatima', studentRole: 'UI/UX Designer', rating: 4.5, date: '2024-02-05', comment: 'Helped me move from confusion to a clear roadmap. The mock interviews were a game changer. Very patient and understanding mentor.' },
  ]

  const reviewsToDisplay = mentorDisplayData.testimonials.length > 0
    ? mentorDisplayData.testimonials.map((t, idx) => ({
      id: idx,
      studentName: t.name || t.studentName || 'Learner',
      studentRole: t.role || t.studentRole || 'Student',
      rating: t.rating || 5,
      date: t.date || 'Project Completion',
      comment: t.comment || t.text || ''
    }))
    : mockReviews

  return (
    <div className="profile-page-elegant">
      {/* Profile Cover - Rectangular, no border radius */}
      <div className="profile-cover-elegant"></div>

      <div className="profile-content-wrapper">

        {/* LinkedIn-style Intro Card */}
        <div className="profile-intro-card">
          <div className="profile-intro-header">
            <div className="profile-avatar-linkedin" style={{ background: '#f1f5f9', position: 'relative' }}>
              {mentorDisplayData.profilePicture ? (
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '50%' }}>
                  <img
                    src={mentorDisplayData.profilePicture}
                    alt={mentorDisplayData.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                  <span style={{ fontSize: '32px', fontWeight: '700', color: '#0ea5e9' }}>
                    {mentorDisplayData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}

              {(userProfile?.is_verified || userProfile?.is_platformAssured) && (
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  background: '#0ea5e9',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} title="Verified Mentor">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              )}
            </div>
            <div className="profile-edit-btn-group" style={{
              display: 'flex',
              gap: '8px',
              position: 'absolute',
              top: '24px',
              right: '25px',
              zIndex: 10
            }}>
              <button
                className="profile-edit-btn-icon"
                onClick={() => setIsEditing(!isEditing)}
                title="Edit Profile"
                style={{ position: 'relative', top: 'auto', right: 'auto' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  className="profile-edit-btn-icon"
                  onClick={() => setShowSettings(!showSettings)}
                  style={{
                    backgroundColor: showSettings ? '#f3f4f6' : 'transparent',
                    position: 'relative',
                    top: 'auto',
                    right: 'auto'
                  }}
                  title="Settings"
                >
                  <SettingsIcon />
                </button>

                {showSettings && (
                  <div className="settings-dropdown-menu" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    padding: '8px',
                    minWidth: '150px',
                    zIndex: 100,
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <button
                      onClick={() => {
                        if (onLogout) onLogout()
                        else {
                          localStorage.clear()
                          window.location.href = '/'
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        color: '#ef4444',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <LogoutIcon size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-intro-info">
            <div className="profile-main-details">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 className="profile-name-linkedin">{mentorDisplayData.name}</h1>
                {userProfile?.is_platformAssured && (
                  <span style={{ fontSize: '10px', background: '#f0f9ff', color: '#0ea5e9', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', border: '1px solid #e0f2fe' }}>ASSURED</span>
                )}
              </div>
              <p className="profile-headline-tech">
                {mentorDisplayData.role} <span>|</span> {mentorDisplayData.title}
              </p>

              <div className="profile-location-linkedin">
                <span className="location-text">
                  {mentorDisplayData.location}
                </span>
                <span className="bullet-separator">•</span>
                <span className="contact-info-link" style={{ color: '#0ea5e9', cursor: 'pointer' }} onClick={() => window.location.href = `mailto:${userProfile?.email || ''}`}>Contact info</span>
              </div>

              <div className="profile-connections-linkedin">
                <span className="connection-count" style={{ color: '#0ea5e9', fontWeight: '600' }}>
                  {mentorDisplayData.totalReviews} reviews • {mentorDisplayData.menteesCoached}+ pupils
                </span>
              </div>
            </div>

            <div className="profile-actions-linkedin">
              <button className="btn-linkedin-primary" style={{ background: '#0ea5e9' }}>Edit Profile</button>
              <button className="btn-linkedin-secondary">Manage Courses</button>
              <button className="btn-linkedin-tertiary">More</button>
            </div>
          </div>
        </div>

        {/* Analytics/Stats Section */}
        <div className="profile-section-card">
          <div className="profile-section-header-linkedin">
            <h2 className="section-title-linkedin">Analytics</h2>
            <span className="private-eye-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              Private to you
            </span>
          </div>
          <div className="profile-stats-linkedin">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item-linkedin">
                <div className="stat-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20V10"></path>
                    <path d="M18 20V4"></path>
                    <path d="M6 20v-4"></path>
                  </svg>
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
            {mentorDisplayData.bio}
          </p>
        </div>

        {/* Expertise Section */}
        {mentorDisplayData.expertise.length > 0 && (
          <div className="profile-section-card">
            <div className="profile-section-header-linkedin">
              <h2 className="section-title-linkedin">Expertise</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              {mentorDisplayData.expertise.map((skill, idx) => (
                <span key={idx} className="soft-skill-pill" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #e0f2fe', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {mentorDisplayData.experience.length > 0 && (
          <div className="profile-section-card">
            <div className="profile-section-header-linkedin">
              <h2 className="section-title-linkedin">Experience</h2>
            </div>
            <div className="timeline-linkedin" style={{ marginTop: '12px' }}>
              {mentorDisplayData.experience.map((exp, idx) => (
                <div key={idx} className="timeline-item-linkedin">
                  <div className="timeline-logo-linkedin">
                    <div className="company-logo-placeholder" style={{ background: '#f8fafc', color: '#64748b' }}>
                      {(exp.company || 'C').charAt(0)}
                    </div>
                  </div>
                  <div className="timeline-content-linkedin">
                    <h3 className="timeline-role-linkedin">{exp.role || exp.title}</h3>
                    <p className="timeline-company-linkedin">{exp.company}</p>
                    <p className="timeline-date-linkedin">
                      {exp.start_date} — {exp.end_date || 'Present'}
                    </p>
                    {exp.description && <p className="timeline-desc-linkedin">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {mentorDisplayData.education.length > 0 && (
          <div className="profile-section-card">
            <div className="profile-section-header-linkedin">
              <h2 className="section-title-linkedin">Education</h2>
            </div>
            <div className="timeline-linkedin" style={{ marginTop: '12px' }}>
              {mentorDisplayData.education.map((edu, idx) => (
                <div key={idx} className="timeline-item-linkedin">
                  <div className="timeline-logo-linkedin">
                    <div className="company-logo-placeholder" style={{ background: '#fff7ed', color: '#c2410c' }}>
                      {(edu.institution || 'U').charAt(0)}
                    </div>
                  </div>
                  <div className="timeline-content-linkedin">
                    <h3 className="timeline-role-linkedin">{edu.degree}</h3>
                    <p className="timeline-company-linkedin">{edu.institution}</p>
                    <p className="timeline-date-linkedin">
                      {edu.start_year} — {edu.end_year || 'Present'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Offered Section (Carousel) */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Courses Offered</h2>
          </div>
          <div className="carousel-container">
            <button
              className="carousel-nav-btn prev"
              onClick={() => coursesDrag.scroll('left')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div
              className="draggable-carousel"
              ref={coursesDrag.ref}
              {...coursesDrag.events}
            >
              {uniqueTaughtCourses.length > 0 ? (
                uniqueTaughtCourses.map((course) => (
                  <div key={course.id} className="carousel-slide">
                    <div className="program-card">
                      <div className="program-card-image-wrapper">
                        <img src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt={course.title} className="program-card-image" draggable="false" />
                        <div className="program-card-gradient-overlay"></div>
                      </div>
                      <div className="program-card-content">
                        <h3 className="program-card-title">{course.title}</h3>
                        <div className="program-card-mentor">
                          {/* Display role or category instead of mentor name since they ARE the mentor */}
                          <span>{course.category || 'Professional Course'}</span>
                        </div>
                        <div className="program-card-meta">
                          <span className="program-card-rating">
                            ⭐ {course.rating || 4.8}
                          </span>
                          <span className="program-card-level">{course.level || 'Expert'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', color: '#64748b' }}>No courses listed yet.</div>
              )}
            </div>
            <button
              className="carousel-nav-btn next"
              onClick={() => coursesDrag.scroll('right')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="profile-section-card">
          <div className="profile-section-header-linkedin">
            <h2 className="section-title-linkedin">Reviews & Feedback</h2>
          </div>
          <div className="reviews-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reviewsToDisplay.map((review) => (
              <div key={review.id} className="review-card" style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#0ea5e9' }}>
                      {review.studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{review.studentName}</h4>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>{review.studentRole}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#fbbf24' }}>{renderStars(review.rating)}</div>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>{review.date}</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default MentorProfile


