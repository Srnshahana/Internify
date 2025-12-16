import { useEffect } from 'react'
import { getCourseById } from './Data.jsx'
import './App.css'

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
            quote:
              'The sessions were super clear and structured. I finally shipped my first real project with confidence.',
            name: 'Previous mentee',
            title: 'Mobile app developer',
          },
          {
            rating: 5,
            quote:
              'Great mix of theory and hands-on guidance. Weekly feedback kept me accountable and moving.',
            name: 'Design mentee',
            title: 'Junior product designer',
          },
          {
            rating: 4.5,
            quote:
              'Helped me move from confusion to a clear roadmap. The mock interviews were a game changer.',
            name: 'Career switcher',
            title: 'Software engineer in transition',
          },
        ]

  return (
    <div className="page mentor-profile-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="mentor-profile-container">
        {/* Main Content Column - single column like inspo */}
        <div className="mentor-profile-main">
          {/* Header Section */}
          <section className="mentor-header-section">
            <div className="mentor-header-content">
              <div className="mentor-photo-large">
                <img
                  src={mentor.image || 'https://via.placeholder.com/200'}
                  alt={mentor.name}
                />
              </div>
              <div className="mentor-header-info">
                <h1>{mentor.name}</h1>
                <p className="mentor-job-title">{mentor.role} {mentor.company ? `at ${mentor.company}` : ''}</p>
                <div className="mentor-rating-header">
                  <span className="rating-large">
                    {renderStars ? renderStars(mentor.rating) : '★★★★★'}
                  </span>
                  <span className="rating-text">{mentor.rating}</span>
                </div>
                <p className="mentor-bio">
                  {mentor.bio || mentor.focus}
                </p>
                <div className="mentor-focus-tags">
                  {mentor.skills?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="focus-tag">{skill}</span>
                  ))}
                </div>
                <div className="mentor-header-actions">
                  <div className="hourly-rate">
                    <span className="rate-label">Hourly Rate:</span>
                    <span className="rate-value">${mentor.hourlyRate || '[Hourly Rate]'}/hr</span>
                  </div>
                  <button
                    className="primary book-session-btn"
                    onClick={() => onBookSession && onBookSession()}
                  >
                    Request trial session
                  </button>
                  <button className="secondary free-consult-btn">Send message</button>
                </div>
              </div>
            </div>
          </section>

          {/* Course provided Section */}
          <section className="mentor-section">
            <h2 className="section-title">Course provided</h2>
            <div className="courses-mentor-grid">
              {mentorCourses.length > 0 ? (
                mentorCourses.map((course) => (
                  <div className="course-mentor-card" key={course.id}>
                    <h3>{course.name}</h3>
                    <p className="course-mentor-detail">{course.description}</p>
                    <div className="course-mentor-meta">
                      <span className="course-duration">{course.duration} weeks</span>
                      <span className="course-level">{course.level}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No courses available</p>
              )}
            </div>
          </section>

          {/* Work Experience Section */}
          <section className="mentor-section">
            <h2 className="section-title">Work experience</h2>
            <div className="experience-list">
              <div className="experience-item">
                <div className="experience-header">
                  <h3>{mentor.role}</h3>
                  <span className="experience-period">Present</span>
                </div>
                <p className="experience-company">{mentor.company}</p>
                <p className="experience-description">
                  {mentor.experience} years of experience in {mentor.focus}. {mentor.bio}
                </p>
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section className="mentor-section">
            <h2 className="section-title">Education</h2>
            <div className="education-list">
              {mentor.education && mentor.education.length > 0 ? (
                mentor.education.map((edu, idx) => (
                  <div key={idx} className="education-item">
                    <h3>{edu.degree}</h3>
                    <p className="education-institution">{edu.institution}</p>
                    <p className="education-period">{edu.year}</p>
                  </div>
                ))
              ) : (
                <div className="education-item">
                  <h3>[Degree Name]</h3>
                  <p className="education-institution">[University Name]</p>
                  <p className="education-period">[Graduation Year]</p>
                </div>
              )}
            </div>
          </section>

          {/* Testimonials & Feedback Section */}
          <section className="mentor-section">
            <h2 className="section-title">Testimonials & feedback</h2>
            <div className="testimonials-list testimonial-slider">
              {testimonials.map((item, idx) => (
                <div key={idx} className="testimonial-card">
                  <div className="testimonial-rating">
                    {renderStars ? renderStars(item.rating) : '★★★★★'}
                  </div>
                  <blockquote className="testimonial-quote">
                    “{item.quote}”
                  </blockquote>
                  <div className="testimonial-author">
                    <strong>{item.name}</strong>
                    {item.title && <span className="testimonial-title">{item.title}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

