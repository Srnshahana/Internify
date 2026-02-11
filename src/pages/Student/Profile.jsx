import { useState, useRef } from 'react'
import '../../App.css'
import { studentProfileData } from '../../data/staticData.js'
import { courses } from '../../data/staticData.js'
import { CertificateIcon, SettingsIcon, LogoutIcon } from '../../components/Icons.jsx'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'

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
    const walk = (x - startX.current) * 2 // Scroll speed multiplier
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

function Profile({ onLogout }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const coursesDrag = useDragScroll()
  const certDrag = useDragScroll()

  // Use global dashboard data from context
  const { studentProfile, enrolledCourses, loading } = useDashboardData()

  // Helper function to ensure data is an array
  const ensureArray = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    return [value]
  }

  // Map database data to profile structure (only if studentProfile exists)
  const mappedProfile = studentProfile ? {
    student_id: studentProfile.student_id,
    name: studentProfile.name || 'Student Name',
    about: studentProfile.about || studentProfileData.about,
    address: studentProfile.address || 'Location not specified',
    profile_image: studentProfile.profile_image || studentProfileData.avatar,
    avatar: studentProfile.profile_image ? (
      <img src={studentProfile.profile_image} alt={studentProfile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : studentProfileData.avatar,
    location: studentProfile.address || 'Location not specified',
    skills: Array.isArray(studentProfile.skills) ? studentProfile.skills : [],
    education: ensureArray(studentProfile.education).map((edu, index) => ({
      id: edu.id || index,
      degree: edu.degree || '',
      school: edu.college || edu.school || '',
      institution: edu.college || edu.school || '',
      year: edu.year || '',
      startYear: edu.start_year || '',
      endYear: edu.end_year || edu.year || '',
      gpa: edu.gpa || '',
      description: edu.description || ''
    })),
    internships: ensureArray(studentProfile.internships).map((internship, index) => ({
      id: internship.id || index,
      title: internship.job_title || internship.title || '',
      company: internship.company || '',
      location: internship.location || '',
      startDate: internship.start_date || internship.startDate || '',
      endDate: internship.end_date || internship.endDate || '',
      description: internship.description || '',
      skills: internship.skills || []
    })),
    certifications: ensureArray(studentProfile.certifications).map((cert, index) => ({
      id: cert.id || index,
      name: cert.name || cert.title || '',
      issuer: cert.issuer || cert.organization || '',
      date: cert.date || cert.issued_date || '',
      description: cert.description || ''
    })),
    projects: ensureArray(studentProfile.project).map((proj, index) => ({
      id: proj.id || index,
      title: proj.title || proj.name || '',
      description: proj.description || '',
      technologies: proj.technologies || proj.tech_stack || [],
      skills: proj.technologies || proj.tech_stack || [],
      link: proj.link || proj.url || ''
    })),
    career_fields: Array.isArray(studentProfile.career_fields) ? studentProfile.career_fields : [],
  } : null

  // Use fetched profile data, fallback to static data
  const profile = mappedProfile || studentProfileData

  if (loading) {
    return (
      <div className="profile-page-elegant" style={{ padding: '40px', textAlign: 'center' }}>
        <div>Loading profile...</div>
      </div>
    )
  }

  const stats = [
    { label: 'Courses Completed', value: '2' },
    { label: 'Courses In Progress', value: '2' },
    { label: 'Mentorship Sessions', value: '45' },
    { label: 'Certificates', value: profile.certifications?.length || '5' },
  ]

  return (
    <div className="profile-page-elegant">
      {/* Profile Cover - Rectangular, no border radius */}
      <div className="profile-cover-elegant"></div>

      <div className="profile-content-wrapper">

        {/* LinkedIn-style Intro Card */}
        <div className="profile-intro-card">
          <div className="profile-intro-header">
            <div className="profile-avatar-linkedin">
              {profile.avatar}
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
                      onClick={onLogout}
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
              <h1 className="profile-name-linkedin">{profile.name}</h1>
              <p className="profile-headline-tech">
                {profile.career_fields && profile.career_fields.length > 0
                  ? profile.career_fields.join(' | ')
                  : 'Flutter Developer | React Native Enthusiast | UI/UX Designer'
                }
              </p>

              <div className="profile-location-linkedin">
                <span className="location-text">
                  {profile.location}
                </span>
                <span className="bullet-separator">•</span>
                <span className="contact-info-link">Contact info</span>
              </div>

              <div className="profile-connections-linkedin">
                <span className="connection-count">500+ connections</span>
              </div>
            </div>

            <div className="profile-actions-linkedin">
              <button className="btn-linkedin-secondary">Add profile section</button>
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
            {isEditing && <button className="section-edit-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>}
          </div>
          <p className="profile-bio-linkedin">{studentProfileData.bio}</p>
        </div>

        {/* Internships Section */}
        <div className="profile-section-card">
          <div className="profile-section-header-linkedin">
            <h2 className="section-title-linkedin">Internships</h2>
            {isEditing && <button className="section-add-btn-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>}
          </div>
          <div className="timeline-linkedin">
            {profile.internships && profile.internships.length > 0 ? (
              profile.internships.map((internship) => (
                <div key={internship.id} className="timeline-item-linkedin">
                  <div className="timeline-logo-linkedin">
                    {/* Placeholder Company Logo */}
                    <div className="company-logo-placeholder">
                      {internship.company.charAt(0)}
                    </div>
                  </div>
                  <div className="timeline-content-linkedin">
                    <h3 className="timeline-role-linkedin">{internship.title}</h3>
                    <p className="timeline-company-linkedin">{internship.company}</p>
                    <p className="timeline-date-linkedin">
                      {internship.startDate} - {internship.endDate}
                    </p>
                    <p className="timeline-location-linkedin">{internship.location}</p>
                    <p className="timeline-desc-linkedin">{internship.description}</p>
                    {internship.skills && internship.skills.length > 0 && (
                      <div className="timeline-skills-linkedin">
                        <span className="skills-label">Skills: </span>
                        {internship.skills.map((skill, idx) => (
                          <span key={idx} className="skill-text-linkedin">{skill}{idx < internship.skills.length - 1 ? ' · ' : ''}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state-elegant">No internships added yet</p>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Projects</h2>
            {isEditing && <button className="section-edit-btn-elegant">Add project</button>}
          </div>
          <div className="timeline-elegant">
            {profile.projects && profile.projects.length > 0 ? (
              profile.projects.map((project) => (
                <div key={project.id} className="timeline-item-elegant">
                  <div className="timeline-icon-elegant">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className="timeline-content-elegant">
                    <h3 className="timeline-title-elegant">{project.title}</h3>
                    <p className="timeline-subtitle-elegant">{project.type}</p>
                    <div className="timeline-meta-elegant">
                      <span className="timeline-badge-elegant badge-project">Project</span>
                      <span className="timeline-period-elegant">
                        {project.startDate} - {project.endDate}
                      </span>
                    </div>
                    <p className="timeline-description-elegant">{project.description}</p>
                    {project.skills && project.skills.length > 0 && (
                      <div className="timeline-skills-elegant">
                        {project.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag-elegant">{skill}</span>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link-elegant">
                        View Project →
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state-elegant">No projects added yet</p>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Education</h2>
            {isEditing && <button className="section-edit-btn-elegant">Add education</button>}
          </div>
          <div className="timeline-elegant">
            {profile.education.map((edu) => (
              <div key={edu.id} className="timeline-item-elegant">
                <div className="timeline-icon-elegant">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <div className="timeline-content-elegant">
                  <h3 className="timeline-title-elegant">{edu.degree}</h3>
                  <p className="timeline-subtitle-elegant">{edu.institution}</p>
                  <div className="timeline-meta-elegant">
                    <span className="timeline-period-elegant">
                      {edu.startYear} - {edu.endYear}
                    </span>
                    {edu.gpa && <span className="timeline-period-elegant">GPA: {edu.gpa}</span>}
                  </div>
                  {edu.description && (
                    <p className="timeline-description-elegant">{edu.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Enrolled Section */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Courses Enrolled</h2>
            {isEditing && <button className="section-edit-btn-elegant">Browse courses</button>}
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
              {enrolledCourses && enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <div key={course.id} className="carousel-slide">
                    <div className="program-card">
                      <div className="program-card-image-wrapper">
                        <img src={course.image} alt={course.title} className="program-card-image" draggable="false" />
                      </div>
                      <div className="program-card-content">
                        <h3 className="program-card-title">{course.title}</h3>
                        <div className="program-card-mentor">
                          <span>{course.mentor || 'Expert Mentor'}</span>
                        </div>
                        <div className="program-card-meta">
                          <span className="program-card-rating">
                            ⭐ {course.rating || 4.8}
                          </span>
                          <span className="program-card-level">{course.level || 'Beginner'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                studentProfileData.enrolledCourses.map((course) => (
                  <div key={course.id} className="carousel-slide">
                    <div className="program-card">
                      <div className="program-card-image-wrapper">
                        <img src={course.image} alt={course.name} className="program-card-image" draggable="false" />
                      </div>
                      <div className="program-card-content">
                        <h3 className="program-card-title">{course.name}</h3>
                        <div className="program-card-mentor">
                          <span>Expert Mentor</span>
                        </div>
                        <div className="program-card-meta">
                          <span className="program-card-rating">
                            ⭐ 4.8
                          </span>
                          <span className="program-card-level">Beginner</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
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

        {/* Certificates Section */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Licenses & Certifications</h2>
            {isEditing && <button className="section-edit-btn-elegant">Add certification</button>}
          </div>
          <div className="carousel-container">
            <button
              className="carousel-nav-btn prev"
              onClick={() => certDrag.scroll('left')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div
              className="draggable-carousel"
              ref={certDrag.ref}
              {...certDrag.events}
            >
              {studentProfileData.certificates.map((cert) => (
                <div key={cert.id} className="carousel-slide">
                  <div className="certificate-card-elegant">
                    <div className="certificate-header-elegant">
                      <div className="certificate-icon-elegant">
                        <CertificateIcon />
                      </div>
                      <div className="certificate-verified-badge">Verified</div>
                    </div>
                    <h3 className="certificate-title-elegant">{cert.name}</h3>
                    <div className="certificate-divider"></div>
                    <p className="certificate-issuer-label">Issued by</p>
                    <p className="certificate-issuer-name">{cert.issuer}</p>
                    <div className="certificate-footer-elegant">
                      <div className="certificate-info-row">
                        <span className="certificate-label">Issued</span>
                        <span className="certificate-value">{cert.issueDate}</span>
                      </div>
                      <div className="certificate-info-row">
                        <span className="certificate-label">Credential ID</span>
                        <span className="certificate-value">{cert.credentialId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-nav-btn next"
              onClick={() => certDrag.scroll('right')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div >
  )
}

export default Profile
