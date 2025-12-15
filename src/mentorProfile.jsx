import { useEffect } from 'react'
import { getCourseById } from './Data.jsx'
import './App.css'

export default function MentorProfile({ mentor, onBack, renderStars, courses = [] }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!mentor) return null

  const mentorCourses = mentor.courses
    ? mentor.courses.map((courseId) => getCourseById(courseId)).filter(Boolean)
    : courses.slice(0, 3)

  return (
    <div className="page mentor-profile-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="mentor-profile-container">
        {/* Main Content Column */}
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
                  <button className="primary book-session-btn">Book Session</button>
                  <button className="secondary free-consult-btn">Free Consultation</button>
                </div>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section className="mentor-section">
            <h2 className="section-title">Experience</h2>
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

          {/* Courses I Mentor Section */}
          <section className="mentor-section">
            <h2 className="section-title">Courses I Mentor</h2>
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
                    <div className="course-skills">
                      {course.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="course-skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No courses available</p>
              )}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mentor-section">
            <h2 className="section-title">What My Mentees Say</h2>
            <div className="testimonials-list">
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  {renderStars ? renderStars('[0-5 Star Rating]') : '★★★★★'}
                </div>
                <blockquote className="testimonial-quote">
                  "[Testimonial Quote] This mentor has been incredibly helpful in guiding me through
                  my career journey. Their expertise and patience have made a significant impact on
                  my professional growth."
                </blockquote>
                <div className="testimonial-author">
                  <strong>[Mentee Name]</strong>
                  <span className="testimonial-title">[Mentee Title]</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  {renderStars ? renderStars('[0-5 Star Rating]') : '★★★★★'}
                </div>
                <blockquote className="testimonial-quote">
                  "[Testimonial Quote] Working with this mentor has transformed my understanding of
                  the field. The practical insights and real-world examples have been invaluable."
                </blockquote>
                <div className="testimonial-author">
                  <strong>[Mentee Name]</strong>
                  <span className="testimonial-title">[Mentee Title]</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  {renderStars ? renderStars('[0-5 Star Rating]') : '★★★★★'}
                </div>
                <blockquote className="testimonial-quote">
                  "[Testimonial Quote] I highly recommend this mentor to anyone looking to advance
                  their career. Their teaching style is clear, engaging, and results-driven."
                </blockquote>
                <div className="testimonial-author">
                  <strong>[Mentee Name]</strong>
                  <span className="testimonial-title">[Mentee Title]</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Right Sidebar */}
        <aside className="mentor-profile-sidebar">
          {/* Skills & Expertise */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Skills & Expertise</h3>
            <div className="skills-list">
              {mentor.skills && mentor.skills.length > 0 ? (
                mentor.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))
              ) : (
                <>
                  <span className="skill-tag">[Skill Tag]</span>
                  <span className="skill-tag">[Skill Tag]</span>
                  <span className="skill-tag">[Skill Tag]</span>
                </>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Certifications</h3>
            <ul className="certifications-list">
              {mentor.certifications && mentor.certifications.length > 0 ? (
                mentor.certifications.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))
              ) : (
                <li>[Certification Name]</li>
              )}
            </ul>
          </div>

          {/* Connect Links */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Connect</h3>
            <ul className="connect-links-list">
              <li>
                <a href="#" className="connect-link">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="connect-link">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="connect-link">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="connect-link">
                  Portfolio
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

