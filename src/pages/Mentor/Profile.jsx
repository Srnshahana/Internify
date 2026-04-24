import { useState, useRef, useEffect } from 'react'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import { SettingsIcon, LogoutIcon } from '../../components/Icons.jsx'
import supabase from '../../supabaseClient.js'

const useDragScroll = () => {
  const ref = useRef(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e) => {
    isDown.current = true
    ref.current?.classList.add('is-dragging')
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

  return { ref, events: { onMouseDown, onMouseLeave, onMouseUp, onMouseMove }, scroll, onMouseDown, onMouseLeave, onMouseUp, onMouseMove }
}

function MentorProfile({ onLogout }) {
  const { userProfile, providedCourses, mentorshipEnrollments: taughtCourses, loading } = useDashboardData()
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [courseSessions, setCourseSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const coursesDrag = useDragScroll()

  const handleCourseClick = async (course) => {
    console.log('Mentor Profile: Course Card Clicked:', course)
    setSelectedCourse(course)
    setShowCourseModal(true)
    
    const cid = course.course_id || course.id;
    if (!cid) return;

    setLoadingSessions(true)
    try {
      const { data, error } = await supabase
        .from('course_sessions')
        .select('*')
        .eq('course_id', cid)
        .order('order_index', { ascending: true })

      if (error) throw error
      setCourseSessions(data || [])
    } catch (err) {
      console.error('Error fetching sessions:', err)
    } finally {
      setLoadingSessions(false)
    }
  }

  const handleCloseModal = () => {
    setShowCourseModal(false)
    setSelectedCourse(null)
    setCourseSessions([])
  }

  if (loading) {
    return (
      <div className="profile-page-elegant" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#0ea5e9', fontWeight: '500' }}>Loading profile...</p>
      </div>
    )
  }

  const safeUserProfile = userProfile || {}
  const safeTestimonials = Array.isArray(safeUserProfile.testimonial) ? safeUserProfile.testimonial : []

  const mentorDisplayData = {
    name: safeUserProfile.name || safeUserProfile.full_name || 'Expert Mentor',
    role: Array.isArray(safeUserProfile.category) ? safeUserProfile.category[0] : (safeUserProfile.category || 'Mentor'),
    title: safeUserProfile.title || 'Professional Educator & Industry Expert',
    location: safeUserProfile.address || 'Worldwide',
    profilePicture: safeUserProfile.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: safeUserProfile.about || 'Experienced professional dedicated to helping students and mentees achieve their full potential through personalized guidance and real-world project experience.',
    experienceYears: safeUserProfile.experience_years || 8,
    menteesCoached: (taughtCourses || []).length,
    averageRating: safeUserProfile.rating || 4.8,
    totalReviews: safeTestimonials.length || 45,
    education: Array.isArray(safeUserProfile.education) ? safeUserProfile.education : [],
    experience: Array.isArray(safeUserProfile.experience) ? safeUserProfile.experience : [],
    expertise: Array.isArray(safeUserProfile.experties_in) ? safeUserProfile.experties_in : (Array.isArray(safeUserProfile.expertise) ? safeUserProfile.expertise : []),
    testimonials: safeTestimonials
  }

  const uniqueTaughtCourses = providedCourses || []

  const renderStars = (rating) => {
    const validRating = Math.min(5, Math.max(0, rating)) || 0;
    const full = Math.floor(validRating)
    const half = validRating - full >= 0.5
    return Array(5).fill(0).map((_, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
  }

  const stats = [
    { label: 'Experience', value: `${mentorDisplayData.experienceYears}y+` },
    { label: 'Rating', value: mentorDisplayData.averageRating },
    { label: 'Mentees', value: `${mentorDisplayData.menteesCoached}+` },
    { label: 'Reviews', value: mentorDisplayData.totalReviews },
  ]

  const mockReviews = [
    { id: 1, studentName: 'Sherin', studentRole: 'Software Engineer', rating: 5, date: '2024-02-15', comment: 'Alex is an amazing mentor! The sessions were super clear and structured. I finally shipped my first real project with confidence. Highly recommend!' },
    { id: 2, studentName: 'Rahul', studentRole: 'Frontend Developer', rating: 5, date: '2024-02-10', comment: 'Great mix of theory and hands-on guidance. Weekly feedback kept me accountable and moving. The code reviews were incredibly helpful.' },
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
      {/* PREMIUM Course Detail Modal */}
      {showCourseModal && selectedCourse && (
        <div className="mentor-profile-modal-overlay" onClick={handleCloseModal}>
          <div className="mentor-profile-modal-container" onClick={e => e.stopPropagation()}>
            <button className="mentor-modal-close" onClick={handleCloseModal}>×</button>
            <div className="mentor-modal-hero">
              <img src={selectedCourse.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt={selectedCourse.title} />
              <div className="mentor-modal-hero-overlay">
                <h2 className="mentor-modal-title">{selectedCourse.title}</h2>
                <div className="mentor-modal-subtitle">
                  <span className="modal-category-tag">{selectedCourse.category || 'Professional Course'}</span>
                  <span>{selectedCourse.level || 'Expert'} Level</span>
                </div>
              </div>
            </div>
            <div className="mentor-modal-body">
              <div className="mentor-modal-stats-grid">
                <div className="mentor-modal-stat-card">
                  <span className="mentor-modal-stat-label">Rating</span>
                  <span className="mentor-modal-stat-value">★ {selectedCourse.rating || 4.8}</span>
                </div>
                <div className="mentor-modal-stat-card">
                  <span className="mentor-modal-stat-label">Mentees</span>
                  <span className="mentor-modal-stat-value">{selectedCourse.students || 0}+</span>
                </div>
                <div className="mentor-modal-stat-card">
                  <span className="mentor-modal-stat-label">Duration</span>
                  <span className="mentor-modal-stat-value">{selectedCourse.duration || 'Flexible'}</span>
                </div>
                <div className="mentor-modal-stat-card">
                  <span className="mentor-modal-stat-label">Fee</span>
                  <span className="mentor-modal-stat-value">₹{selectedCourse.course_fee || 'TBD'}</span>
                </div>
              </div>
              <div className="mentor-modal-provide-card">
                <h3 className="mentor-modal-section-title">What I will provide</h3>
                <p className="mentor-modal-provide-text">
                  {selectedCourse.course_provide || 'No custom description provided yet.'}
                </p>
              </div>
              <div className="mentor-modal-curriculum">
                <h3 className="mentor-modal-section-title">Course Curriculum</h3>
                {loadingSessions ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#0ea5e9' }}>Loading...</div>
                ) : courseSessions.length > 0 ? (
                  <div className="mentor-modal-sessions-list">
                    {courseSessions.map((session, sidx) => (
                      <div key={session.id || sidx} className="mentor-modal-session-item">
                        <div className="mentor-modal-session-number">{sidx + 1}</div>
                        <div className="mentor-modal-session-info">
                          <h4>{session.title}</h4>
                          <p>{session.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No curriculum listed.</p>
                )}
              </div>
              <div className="mentor-modal-footer">
                <button className="mentor-modal-btn-done" onClick={handleCloseModal}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cover Section */}
      <div className="profile-cover-elegant"></div>

      <div className="profile-content-wrapper">
        {/* Intro Card */}
        <div className="profile-intro-card">
          <div className="profile-intro-header">
            <div className="profile-avatar-linkedin">
              <img src={mentorDisplayData.profilePicture} alt={mentorDisplayData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button className="profile-edit-btn-icon" onClick={() => setIsEditing(!isEditing)} title="Edit Profile">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
          </div>

          <div className="profile-intro-info">
            <div className="profile-main-details">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 className="profile-name-linkedin">{mentorDisplayData.name}</h1>
                {userProfile?.is_verified && (
                  <span style={{ color: '#0ea5e9', display: 'flex' }} title="Verified Mentor">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  </span>
                )}
              </div>
              <p className="profile-headline-tech">{mentorDisplayData.title}</p>
              <div className="profile-location-linkedin">
                <span>{mentorDisplayData.location}</span>
                <span className="bullet-separator">•</span>
                <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{mentorDisplayData.role}</span>
              </div>
              <div className="profile-connections-linkedin">
                <span>★ {mentorDisplayData.averageRating} Rating • {mentorDisplayData.totalReviews} Reviews • {mentorDisplayData.menteesCoached} Mentees</span>
              </div>
            </div>

            <div className="profile-actions-linkedin" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button 
                className="btn-linkedin-primary" 
                onClick={() => setIsEditing(!isEditing)}
                style={{ background: isEditing ? '#004182' : '#0a66c2' }}
              >
                Manage Profile
              </button>
              <div style={{ position: 'relative' }}>
                <button className="btn-linkedin-secondary" onClick={() => setShowSettings(!showSettings)}>Options</button>
                {showSettings && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', border: '1px solid #ebebeb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, width: '180px' }}>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = '/' }}
                      style={{ width: '100%', padding: '12px', textAlign: 'left', border: 'none', background: 'transparent', color: '#ef4444', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Logout Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Snapshot */}
        <div className="profile-section-card">
          <div className="profile-section-header-linkedin">
            <h2 className="section-title-linkedin">Professional Snapshot</h2>
          </div>
          <div className="profile-stats-linkedin">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item-linkedin">
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
          <p className="profile-bio-linkedin">{mentorDisplayData.bio}</p>
          {mentorDisplayData.expertise.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '10px' }}>Expertise</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {mentorDisplayData.expertise.map((skill, idx) => (
                  <span key={idx} style={{ background: '#f1f5f9', color: '#1e293b', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', border: '1px solid #e2e8f0' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Experience</h2>
          </div>
          <div className="timeline-elegant">
            {mentorDisplayData.experience.length > 0 ? mentorDisplayData.experience.map((exp, idx) => (
              <div key={idx} className="timeline-item-elegant">
                <div className="timeline-icon-elegant" style={{ background: '#0ea5e9' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div className="timeline-content-elegant">
                  <h3 className="timeline-title-elegant">{exp.role || exp.title}</h3>
                  <p className="timeline-subtitle-elegant">{exp.company || exp.organization}</p>
                  <div className="timeline-meta-elegant">
                    <span className="timeline-period-elegant">{exp.duration || `${exp.start_date} - ${exp.end_date || 'Present'}`}</span>
                  </div>
                </div>
              </div>
            )) : <p>No experience listed.</p>}
          </div>
        </div>

        {/* Education Section */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Education</h2>
          </div>
          <div className="timeline-elegant">
            {mentorDisplayData.education.length > 0 ? mentorDisplayData.education.map((edu, idx) => (
              <div key={idx} className="timeline-item-elegant">
                <div className="timeline-icon-elegant" style={{ background: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                </div>
                <div className="timeline-content-elegant">
                  <h3 className="timeline-title-elegant">{edu.degree || edu.type}</h3>
                  <p className="timeline-subtitle-elegant">{edu.institution || edu.university}</p>
                  <div className="timeline-meta-elegant">
                    <span className="timeline-period-elegant">{edu.year || `${edu.start_year}-${edu.end_year}`}</span>
                  </div>
                </div>
              </div>
            )) : <p>No education listed.</p>}
          </div>
        </div>

        {/* Mentorship Programs (Courses) */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Mentorship Programs</h2>
          </div>
          <div className="carousel-container" style={{ position: 'relative' }}>
            <button className="carousel-nav-btn prev" onClick={() => coursesDrag.scroll('left')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div 
              className="draggable-carousel" 
              ref={coursesDrag.ref}
              onMouseDown={coursesDrag.onMouseDown}
              onMouseLeave={coursesDrag.onMouseLeave}
              onMouseUp={coursesDrag.onMouseUp}
              onMouseMove={coursesDrag.onMouseMove}
            >
              {uniqueTaughtCourses.length > 0 ? uniqueTaughtCourses.map((course) => (
                <div key={course.id} className="carousel-slide" onClick={() => handleCourseClick(course)} style={{ cursor: 'pointer' }}>
                  <div className="course-card-elegant">
                    <div className="course-image-elegant">
                      <img src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt={course.title} />
                    </div>
                    <div className="course-body-elegant">
                      <div className="course-header-elegant">
                        <span className="course-category-elegant">{course.category || 'Professional'}</span>
                        <div className="course-rating-box">
                          <span className="star-icon">★</span>
                          <span>{course.rating || 4.8}</span>
                        </div>
                      </div>
                      <h3 className="course-name-elegant">{course.title}</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {course.course_provide || 'Premium mentorship program.'}
                      </p>
                      <div className="course-footer-elegant">
                        <span className="course-status-badge-elegant">{course.students || 0} Learners</span>
                        <span className="course-level-elegant">{course.level || 'Expert'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : <div style={{ padding: '20px', color: '#64748b' }}>No programs listed yet.</div>}
            </div>
            <button className="carousel-nav-btn next" onClick={() => coursesDrag.scroll('right')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="profile-section-elegant" style={{ marginBottom: '60px' }}>
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Student Testimonials</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            {reviewsToDisplay.map((review) => (
              <div key={review.id} style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0ea5e9' }}>
                      {review.studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>{review.studentName}</h4>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>{review.studentRole}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#fbbf24', fontSize: '12px' }}>{renderStars(review.rating)}</div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{review.date}</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', fontStyle: 'italic' }}>"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorProfile
