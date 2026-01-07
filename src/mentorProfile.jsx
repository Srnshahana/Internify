import { useEffect } from 'react'
import { getCourseById } from './Data.jsx'
import './App.css'
import { CertificateIcon, ProfileIcon, CalendarIcon } from './components/Icons.jsx'

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
    <div className="dashboard-page profile-page-linkedin">
      <div className="profile-cover-section">
        <button className="back-button-floating-simple" onClick={onBack}>
          ← Back
        </button>
        <div className="profile-cover-photo"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar-large">
              <img src={mentor.image || 'https://via.placeholder.com/150'} alt={mentor.name} className="mentor-profile-img" />
            </div>
          </div>
          <div className="profile-header-info">
            <div className="profile-header-top">
              <div>
                <h1>{mentor.name} {mentor.assured && <span className="verified-check">✓</span>}</h1>
                <p className="profile-role">{mentor.role} {mentor.company && `at ${mentor.company}`}</p>
                <p className="profile-location">{mentor.location || 'Online'} • {mentor.hourlyRate ? `$${mentor.hourlyRate}/hr` : '$50/hr'}</p>
              </div>
              <div className="profile-actions">
                <button className="edit-profile-btn primary-btn" onClick={() => onBookSession && onBookSession()}>
                  Book Session
                </button>
                <button className="edit-profile-btn">Message</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="profile-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="profile-stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>About</h2>
        </div>
        <p className="profile-bio-text">
          {mentor.bio || mentor.focus || `Experienced ${mentor.role} passionate about mentoring via Internify.`}
        </p>
        <div className="mentor-skills-list-profile">
          {mentor.skills?.map((skill, idx) => (
            <span key={idx} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      {/* Work Experience */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Work Experience</h2>
        </div>
        <div className="experience-timeline">
          <div className="experience-timeline-item">
            <div className="timeline-icon"></div>
            <div className="timeline-content">
              <h3>{mentor.role}</h3>
              <p className="experience-company-name">{mentor.company}</p>
              <p className="experience-meta">
                <span className="experience-period">Present</span>
              </p>
              <p className="experience-description">
                Leading teams and mentoring junior developers. Specialized in {mentor.focus}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mentorship Programs (Courses) */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Mentorship Programs</h2>
        </div>
        <div className="courses-enrolled-scroll">
          {mentorCourses.map((course) => (
            <div key={course.id} className="course-card-home">
              <div className="course-image-home">
                <img src={course.image} alt={course.name} />
              </div>
              <h3 className="course-name-home">{course.name}</h3>
              <p className="course-category-home">{course.category}</p>
              <div className="course-progress-info-home" style={{ marginTop: 'auto' }}>
                <span className="course-progress-text-home">{course.level} • {course.duration} Weeks</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Testimonials</h2>
        </div>
        <div className="testimonials-grid-profile">
          {testimonials.map((t, i) => (
            <div key={i} className="profile-testimonial-item">
              <div className="testimonial-rating-stars">{'★'.repeat(Math.round(t.rating))}</div>
              <p>"{t.quote}"</p>
              <div className="testimonial-user">— {t.name}, <span>{t.title}</span></div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
