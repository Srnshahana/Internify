import { useEffect } from 'react'
import { getCourseById } from '../../data/staticData.js'
import '../../App.css'
import { CertificateIcon, ProfileIcon, CalendarIcon } from '../../components/Icons.jsx'

export default function MentorProfile({ mentor, onBack, renderStars, courses = [], onBookSession }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!mentor) return null

  const mentorCourses = mentor.courses
    ? mentor.courses.map((courseId) => getCourseById(courseId)).filter(Boolean)
    : courses.slice(0, 3)

  const testimonials =
    mentor.testimonials && mentor.testimonials.length > 0
      ? mentor.testimonials
      : [
        {
          rating: 5,
          quote: 'The sessions were super clear and structured. I finally shipped my first real project with confidence.',
          name: 'Previous mentee',
          title: 'Mobile app developer',
        },
        {
          rating: 5,
          quote: 'Great mix of theory and hands-on guidance. Weekly feedback kept me accountable and moving.',
          name: 'Design mentee',
          title: 'Junior product designer',
        },
      ]

  const stats = [
    { label: 'Rating', value: mentor.rating || '5.0' },
    { label: 'Reviews', value: mentor.reviews || '24' },
    { label: 'Experience', value: `${mentor.experience || 5} Yrs` },
    { label: 'Students', value: '120+' },
  ]

  return (
    <div className="dashboard-page profile-page-premium">
      <div className="profile-container-inner">
        {/* Cover & Header Section */}
        <div className="profile-header-card">
          <button className="back-button-floating-premium" onClick={onBack}>
            ← Back to Explore
          </button>
          <div className="profile-cover-gradient"></div>
          <div className="profile-header-main">
            <div className="profile-avatar-wrapper">
              <img src={mentor.image || 'https://via.placeholder.com/150'} alt={mentor.name} className="mentor-avatar-img" />
            </div>
            <div className="profile-header-text">
              <div className="profile-name-row">
                <h1>{mentor.name}</h1>
                {mentor.assured && <span className="verified-badge">✓</span>}
              </div>
              <p className="profile-headline">{mentor.role} {mentor.company && `at ${mentor.company}`}</p>
              <div className="profile-meta-tags">
                <span className="meta-tag">{mentor.location || 'Remote'}</span>
                <span className="meta-tag">{mentor.hourlyRate ? `$${mentor.hourlyRate}/hr` : '$50/hr'}</span>
              </div>
            </div>
            <div className="profile-main-actions">
              <button className="btn-action-primary" onClick={() => onBookSession && onBookSession()}>Book Private Session</button>
              <button className="btn-action-secondary">Send Message</button>
            </div>
          </div>
        </div>

        {/* Multi-column Grid */}
        <div className="profile-grid-layout">
          {/* Main Column */}
          <div className="profile-main-column">
            {/* About Section */}
            <section className="profile-section-premium">
              <h2 className="section-title-premium">About</h2>
              <p className="profile-bio-text">
                {mentor.bio || mentor.focus || `Experienced ${mentor.role} passionate about mentoring the next generation of talent through Internify.`}
              </p>
              <div className="skills-grid-premium">
                {mentor.skills?.map((skill, idx) => (
                  <span key={idx} className="skill-pill-premium">{skill}</span>
                ))}
              </div>
            </section>

            {/* Experience Section */}
            <section className="profile-section-premium">
              <h2 className="section-title-premium">Experience</h2>
              <div className="experience-list-premium">
                <div className="exp-item-premium">
                  <div className="exp-dot"></div>
                  <div className="exp-content">
                    <h3>{mentor.role}</h3>
                    <p className="exp-company">{mentor.company}</p>
                    <p className="exp-period">Present</p>
                    <p className="exp-desc">Driving innovation and excellence in {mentor.focus || 'modern tech stacks'}.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="profile-section-premium">
              <h2 className="section-title-premium">Testimonials</h2>
              <div className="testimonials-scroll-premium">
                {testimonials.map((t, i) => (
                  <div key={i} className="testimonial-card-premium">
                    <div className="testimonial-rating">{'★'.repeat(Math.round(t.rating))}</div>
                    <p className="testimonial-quote">"{t.quote}"</p>
                    <div className="testimonial-author">— {t.name}, <span>{t.title}</span></div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="profile-sidebar-column">
            {/* Quick Stats Card */}
            <div className="sidebar-card-premium stats-sidebar">
              <h3>Professional Stats</h3>
              <div className="sidebar-stats-list">
                {stats.map((stat) => (
                  <div key={stat.label} className="sidebar-stat-item">
                    <span className="sidebar-stat-value">{stat.value}</span>
                    <span className="sidebar-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentorship Programs Card */}
            <div className="sidebar-card-premium programs-sidebar">
              <h3>Programs</h3>
              <div className="sidebar-programs-list">
                {mentorCourses.map((course) => (
                  <div key={course.id} className="sidebar-program-item">
                    <img src={course.image} alt={course.name} />
                    <div className="program-item-info">
                      <h4>{course.name}</h4>
                      <p>{course.level} • {course.duration}w</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
