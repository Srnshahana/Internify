import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'
import { getCourseById } from '../../data/staticData.js'
import supabase from '../../supabaseClient.js'
import { getStoredAuthData } from '../../utils/auth.js'

export default function MentorProfile({ mentor: propMentor, onBack, renderStars, courses = [] }) {
  const navigate = useNavigate()
  const [mentorData, setMentorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [coursesIndex, setCoursesIndex] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  useEffect(() => {
    // Self-healing: Check for inconsistent auth state
    const validateSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const authId = localStorage.getItem('auth_id')

      // If Supabase has a session but our app doesn't have auth_id, it's a mismatch
      // Force logout to clean slate
      if (session && !authId) {
        console.warn('⚠️ Auth Mismatch detected: Session exists but auth_id missing. Forcing cleanup.')
        await supabase.auth.signOut()
        localStorage.removeItem('sb-zupzvpepzkjeaelxczlz-auth-token')
        // We don't navigate here to avoid jarring redirects on simple view, 
        // but the next interaction will correctly see "no session"
      }
    }
    validateSession()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    // Always fetch latest full details from API to ensure all sections (Expx, Edu, etc.) are populated
    fetchMentorDetails()
  }, [propMentor])

  async function fetchMentorDetails() {
    try {
      setLoading(true);
      const targetId = propMentor?.mentor_id
      const { data, error } = await supabase
        .from('mentors_details')
        .select(`
          mentor_id,
          name,
          about,
          profile_image,
          is_verified,
          experties_in,
          category,
          education,
          skills,
          experience,
          testimonial,
          id,
          is_platformAssured,
          address,
          coursesOffered,
          rating
        `)
        .eq('mentor_id', targetId)
        .single();

      if (error) {
        console.error('Supabase mentor fetch error:', error);
        setLoading(false)
        return;
      }


      // Fetch course details if coursesOffered has values
      let coursesData = [];
      if (data.coursesOffered && data.coursesOffered.length > 0) {
        const courseIds = data.coursesOffered.map((id) => Number(id));
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .in('course_id', courseIds);

        if (coursesError) {
          console.error('Supabase courses fetch error:', coursesError);
        } else {
          coursesData = courses;
        }
      }

      // Normalize data for UI
      const normalized = {
        id: data.mentor_id || data.id || propMentor?.mentor_id || propMentor?.id,
        name: data.name || propMentor?.name || "Expert Mentor",
        about: data.about || "",
        expertise: data.experties_in || [],
        category: Array.isArray(data.category) ? data.category[0] : (data.category || ""),
        skills: (data.skills || []).map(s => typeof s === 'string' ? s : (s.name || s.skill_name || "")),
        location: data.address || "Remote",
        profileImage: data.profile_image || "https://via.placeholder.com/150",
        isVerified: data.is_verified || false,
        platformVerified: data.is_platformAssured || false,
        rating: data.rating || 5.0,
        education: (data.education || []).map(edu => ({
          degree: edu.degree || "",
          institution: edu.institution || "",
          year: edu.year || (edu.start_year ? `${edu.start_year} - ${edu.end_year || 'Present'}` : ""),
          description: edu.description || ""
        })),
        experience: (data.experience || []).map(exp => ({
          title: exp.role || exp.title || "",
          company: exp.company || "",
          duration: exp.duration || (exp.start_date ? `${exp.start_date} - ${exp.end_date || 'Present'}` : ""),
          location: exp.location || "",
          description: exp.description || ""
        })),
        testimonials: (data.testimonial || []).map(t => ({
          name: t.from || t.name || "Student",
          quote: t.text || t.comment || t.quote || "",
          rating: t.rating || 5,
          title: t.title || "Student",
          date: t.date || "Recent"
        })),
        courses_offered: coursesData.map(c => ({
          id: c.course_id || c.id,
          title: c.title || c.name || "",
          category: c.category || "",
          rating: c.rating || 4.8,
          students: c.students || 50,
          image: c.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
          level: c.skill_level || c.level || ""
        }))
      }

      setMentorData(normalized)
      setLoading(false)
    } catch (err) {
      console.error('Unexpected error fetching mentor details:', err);
      setLoading(false)
    }
  }

  if (loading) return <div className="loading-container" style={{ padding: '100px', textAlign: 'center' }}>Loading mentor profile...</div>
  if (!mentorData) return <div className="error-container" style={{ padding: '100px', textAlign: 'center' }}>Mentor not found</div>

  const mentor = mentorData
  const stats = [
    { label: 'Experience', value: mentor.experience?.length > 0 ? `${mentor.experience.length * 3}+y` : "5y+" },
    { label: 'Rating', value: mentor.rating ? mentor.rating.toFixed(1) : "4.9" },
    { label: 'Mentees', value: '1,200+' },
    { label: 'Reviews', value: `${mentor.testimonials?.length || 0}` },
  ]

  const handleNextCourse = () => {
    if (coursesIndex < mentor.courses_offered.length - 2) {
      setCoursesIndex(coursesIndex + 1)
    }
  }

  const handlePrevCourse = () => {
    if (coursesIndex > 0) {
      setCoursesIndex(coursesIndex - 1)
    }
  }

  // Touch Handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNextCourse()
    }
    if (isRightSwipe) {
      handlePrevCourse()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  const handleCloseModal = () => {
    setShowCourseModal(false)
    setSelectedCourse(null)
  }

  const handleCourseClick = (course) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
  }

  return (
    <div className="profile-page-elegant">
      {/* Course Detail Modal */}
      {showCourseModal && selectedCourse && (
        <div className="course-modal-overlay" onClick={handleCloseModal}>
          <div className="course-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            <div className="modal-course-image">
              <img src={selectedCourse.image} alt={selectedCourse.title} />
              <div className="modal-image-overlay">
                <span className="modal-category-tag">{selectedCourse.category}</span>
              </div>
            </div>
            <div className="modal-course-body">
              <h2 className="modal-course-title">{selectedCourse.title}</h2>
              <div className="modal-course-stats">
                <div className="modal-stat">
                  <span className="stat-label">Rating</span>
                  <div className="stat-value-row">
                    <span className="star-icon">★</span>
                    <span className="stat-value">{selectedCourse.rating}</span>
                  </div>
                </div>
                <div className="modal-stat">
                  <span className="stat-label">Students</span>
                  <span className="stat-value">{selectedCourse.students}+</span>
                </div>
                <div className="modal-stat">
                  <span className="stat-label">Level</span>
                  <span className="stat-value">{selectedCourse.level}</span>
                </div>
                {selectedCourse.duration && (
                  <div className="modal-stat">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">{selectedCourse.duration} Weeks</span>
                  </div>
                )}
              </div>
              <div className="modal-description-section">
                <h3>About this course</h3>
                <p>Master the principles of {selectedCourse.title} with expert guidance from {mentor.name}. This course covers fundamental concepts and advanced techniques to help you excel in your career.</p>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-buy-course"
                  onClick={async () => {
                    const mId = mentor.id;
                    const cId = selectedCourse.id;
                    const course = {
                      ...selectedCourse,
                      course_id: cId,
                      mentor_id: mId,
                    };

                    console.log('Booking course:', course)

                    // Check if user is logged in
                    const { data: { session } } = await supabase.auth.getSession()
                    const authId = localStorage.getItem('auth_id')

                    console.log('DEBUG: Session Check:', session)
                    console.log('DEBUG: Auth ID Check:', authId)

                    if (!session || !authId) {
                      // Not logged in - save course data and redirect to login
                      console.log('User not logged in (no session or no auth_id) - saving course to sessionStorage')
                      sessionStorage.setItem('pendingCourse', JSON.stringify(course))
                      navigate('/login', { state: { returnTo: '/payment' } })
                    } else {
                      // Already logged in - go directly to payment
                      console.log('User logged in - navigating to payment')
                      navigate('/payment', { state: { course } })
                    }
                  }}
                >
                  Buy or Start Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Cover - Rectangular to match Student Profile */}
      <div className="profile-cover-elegant">
        <button
          className="back-button-floating-premium"
          onClick={onBack}
          style={{ top: '20px', left: '20px', position: 'absolute', zIndex: 10 }}
        >
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
                src={mentor.profileImage}
                alt={mentor.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=320&q=80' }}
              />
            </div>
          </div>

          <div className="profile-intro-info">
            <div className="profile-main-details">
              <div className="profile-name-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 className="profile-name-linkedin">{mentor.name}</h1>
                {mentor.isVerified && (
                  <span className="verified-badge-soft" title="Verified Mentor" style={{ width: '20px', height: '20px', position: 'static', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  </span>
                )}
                {mentor.platformVerified && (
                  <span className="assured-badge-premium" title="Platform Verified" style={{ background: '#0ea5e9', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>
                    ASSURED
                  </span>
                )}
              </div>

              <p className="profile-headline-tech">
                {mentor.experience?.[0]?.title}
                {mentor.experience?.[0]?.company && <span> | {mentor.experience[0].company}</span>}
                {mentor.expertise?.length > 0 && <span> | Specialist in {mentor.expertise.slice(0, 2).join(' & ')}</span>}
              </p>

              <div className="profile-location-linkedin">
                <span className="location-text">{mentor.location}</span>
                <span className="bullet-separator">•</span>
                <span className="category-text" style={{ color: '#0ea5e9', fontWeight: '500' }}>{mentor.category}</span>
              </div>

              <div className="profile-connections-linkedin">
                <span className="connection-count" style={{ color: '#64748b' }}>
                  {mentor.rating ? mentor.rating.toFixed(1) : "4.9"} Rating • {mentor.testimonials?.length || 0} Reviews • 1,200+ Pupils
                </span>
              </div>
            </div>

            <div className="profile-actions-linkedin">
              <button className="btn-linkedin-primary" onClick={() => onBookSession && onBookSession()}>Book Session</button>
              <button className="btn-linkedin-secondary">Send Message</button>
              <button className="btn-linkedin-tertiary">More</button>
            </div>
          </div>
        </div>

        {/* Analytics Section - Matches Student Profile Style */}
        <div className="profile-section-card">
          <div className="profile-section-header-linkedin">
            <h2 className="section-title-linkedin">Professional Snapshot</h2>
          </div>
          <div className="profile-stats-linkedin">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item-linkedin">
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
          <p className="profile-bio-linkedin" style={{ color: '#475569', lineHeight: '1.6' }}>
            {mentor.about}
          </p>
          {mentor.skills?.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '10px' }}>Top Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {mentor.skills.map((skill, idx) => (
                  <span key={idx} className="skill-pill-premium" style={{ background: '#f1f5f9', color: '#1e293b', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', border: '1px solid #e2e8f0' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Experience Section - Elegant Style */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Experience</h2>
          </div>
          <div className="timeline-elegant">
            {mentor.experience?.length > 0 ? mentor.experience.map((exp, idx) => (
              <div key={idx} className="timeline-item-elegant">
                <div className="timeline-icon-elegant" style={{ background: '#0ea5e9' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div className="timeline-content-elegant">
                  <h3 className="timeline-title-elegant">{exp.title}</h3>
                  <p className="timeline-subtitle-elegant">{exp.company}</p>
                  <div className="timeline-meta-elegant">
                    <span className="timeline-period-elegant">{exp.duration}</span>
                    {exp.location && <span className="timeline-period-elegant"> • {exp.location}</span>}
                  </div>
                  {exp.description && <p className="timeline-description-elegant" style={{ marginTop: '8px' }}>{exp.description}</p>}
                </div>
              </div>
            )) : <p className="empty-state-elegant">No experience details available</p>}
          </div>
        </div>

        {/* Education Section */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Education</h2>
          </div>
          <div className="timeline-elegant">
            {mentor.education?.length > 0 ? mentor.education.map((edu, idx) => (
              <div key={idx} className="timeline-item-elegant">
                <div className="timeline-icon-elegant" style={{ background: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                </div>
                <div className="timeline-content-elegant">
                  <h3 className="timeline-title-elegant">{edu.degree}</h3>
                  <p className="timeline-subtitle-elegant">{edu.institution}</p>
                  <div className="timeline-meta-elegant">
                    <span className="timeline-period-elegant">{edu.year}</span>
                  </div>
                  {edu.description && <p className="timeline-description-elegant" style={{ marginTop: '8px' }}>{edu.description}</p>}
                </div>
              </div>
            )) : <p className="empty-state-elegant">No education details available</p>}
          </div>
        </div>

        {/* Courses Offered Section - Carousel Fix */}
        {mentor.courses_offered?.length > 0 && (
          <div className="profile-section-elegant">
            <div className="profile-section-header-elegant">
              <h2 className="profile-section-title-elegant">Courses Offered</h2>
            </div>

            <div
              className="carousel-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ position: 'relative', touchAction: 'pan-y' }}
            >
              {mentor.courses_offered.length > 2 && (
                <>
                  <button
                    className="carousel-nav-btn prev"
                    onClick={handlePrevCourse}
                    disabled={coursesIndex === 0}
                    style={{ zIndex: 20 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  <button
                    className="carousel-nav-btn next"
                    onClick={handleNextCourse}
                    disabled={coursesIndex >= mentor.courses_offered.length - 2}
                    style={{ zIndex: 20 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </>
              )}

              <div className="carousel-wrapper" style={{
                transform: `translateX(-${coursesIndex * 51}%)`,
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                gap: '20px'
              }}>
                {mentor.courses_offered.map((course) => (
                  <div
                    key={course.id}
                    className="carousel-slide"
                    style={{ minWidth: mentor.courses_offered.length > 1 ? 'calc(50% - 10px)' : '100%', cursor: 'pointer' }}
                    onClick={() => handleCourseClick(course)}
                  >
                    <div className="course-card-elegant" style={{ margin: 0, height: '100%' }}>
                      <div className="course-image-elegant" style={{ height: '180px' }}>
                        <img
                          src={course.image}
                          alt={course.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="course-body-elegant" style={{ padding: '16px' }}>
                        <div className="course-header-elegant" style={{ marginBottom: '8px' }}>
                          <span className="course-category-elegant">{course.category}</span>
                          <div className="course-rating-box">
                            <span className="star-icon">★</span>
                            <span>{course.rating}</span>
                          </div>
                        </div>
                        <h3 className="course-name-elegant" style={{ fontSize: '16px' }}>{course.title}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <span className="course-status-badge-elegant" data-status="enrolled" style={{ fontSize: '12px' }}>
                            {course.students} Mentees
                          </span>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>{course.level}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {mentor.testimonials?.length > 0 && (
          <div className="profile-section-elegant">
            <div className="profile-section-header-elegant">
              <h2 className="profile-section-title-elegant">Reviews & Feedback</h2>
            </div>
            <div className="reviews-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mentor.testimonials.map((review, idx) => (
                <div key={idx} className="review-card" style={{ padding: '20px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '44px', height: '44px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#0ea5e9', border: '1px solid #e2e8f0' }}>
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>{review.name}</h4>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>{review.title}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#fbbf24', fontSize: '12px' }}>{renderStars ? renderStars(review.rating) : '★★★★★'}</div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{review.date}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', fontStyle: 'italic' }}>"{review.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
