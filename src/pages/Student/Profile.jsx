import { useState, useEffect } from 'react'
import '../../App.css'
import { studentProfileData } from '../../data/staticData.js'
import { courses } from '../../data/staticData.js'
import { CertificateIcon } from '../../components/Icons.jsx'
import supabase from '../../supabaseClient.js'

function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [coursesIndex, setCoursesIndex] = useState(0)
  const [certificatesIndex, setCertificatesIndex] = useState(0)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Fetch student profile data from database
  useEffect(() => {
    console.log('Fetching profile data...')
    const fetchStudentProfile = async () => {
      try {
        setLoading(true)

        // Get authenticated student_id from localStorage
        const studentId = localStorage.getItem('auth_id')

        if (!studentId) {
          console.error('No student ID found in localStorage')
          setError('Please log in to view your profile')
          setLoading(false)
          return
        }

        // Query student_details table
        const { data, error: fetchError } = await supabase
          .from('student_details')
          .select('*')
          .eq('student_id', studentId)
          .maybeSingle()
        console.log('Student profile data:', data)
        if (fetchError) {
          console.error('Error fetching student profile:', fetchError)
          setError('Failed to load profile data')
          setLoading(false)
          return
        }

        if (!data) {
          console.log('No profile data found for student_id:', studentId)
          // Use static data as fallback
          setProfileData(studentProfileData)
          setLoading(false)
          return
        }

        console.log('Raw database data:', data)

        // Helper function to ensure data is an array
        const ensureArray = (value) => {
          if (!value) return []
          if (Array.isArray(value)) return value
          // If it's a single object, wrap it in an array
          return [value]
        }

        // Map database data to profile structure
        const mappedProfile = {
          student_id: data.student_id,
          name: data.name || 'Student Name',
          about: data.about || studentProfileData.about,
          address: data.address || 'Location not specified',
          profile_image: data.profile_image || studentProfileData.avatar,
          avatar: data.profile_image ? (
            <img src={data.profile_image} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : studentProfileData.avatar,
          location: data.address || 'Location not specified',
          skills: Array.isArray(data.skills) ? data.skills : [],

          // Handle education - can be object or array
          education: ensureArray(data.education).map((edu, index) => ({
            id: edu.id || index,
            degree: edu.degree || '',
            school: edu.college || edu.school || '',
            year: edu.year || '',
            description: edu.description || ''
          })),

          // Handle internships - can be object or array
          internships: ensureArray(data.internships).map((internship, index) => ({
            id: internship.id || index,
            title: internship.job_title || internship.title || '',
            company: internship.company || '',
            location: internship.location || '',
            startDate: internship.start_date || internship.startDate || '',
            endDate: internship.end_date || internship.endDate || '',
            description: internship.description || '',
            skills: internship.skills || []
          })),

          // Handle certifications - can be object or array
          certifications: ensureArray(data.certifications).map((cert, index) => ({
            id: cert.id || index,
            name: cert.name || cert.title || '',
            issuer: cert.issuer || cert.organization || '',
            date: cert.date || cert.issued_date || '',
            description: cert.description || ''
          })),

          // Handle projects - can be object or array
          projects: ensureArray(data.project).map((proj, index) => ({
            id: proj.id || index,
            title: proj.title || proj.name || '',
            description: proj.description || '',
            technologies: proj.technologies || proj.tech_stack || [],
            link: proj.link || proj.url || ''
          })),

          career_fields: Array.isArray(data.career_fields) ? data.career_fields : [],
        }

        console.log('Mapped profile data:', mappedProfile)
        setProfileData(mappedProfile)
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error fetching profile:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    fetchStudentProfile()
  }, [])

  // Use fetched profile data, fallback to static data
  const profile = profileData || studentProfileData

  if (loading) {
    return (
      <div className="profile-page-elegant" style={{ padding: '40px', textAlign: 'center' }}>
        <div>Loading profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page-elegant" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: '#ef4444' }}>{error}</div>
        <p style={{ marginTop: '16px', color: '#64748b' }}>Using default profile data</p>
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
            <button className="profile-edit-btn-icon" onClick={() => setIsEditing(!isEditing)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
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
              <button className="btn-linkedin-primary">Open to work</button>
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
              onClick={() => setCoursesIndex(Math.max(0, coursesIndex - 1))}
              disabled={coursesIndex === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="carousel-wrapper" style={{ transform: `translateX(-${coursesIndex * (100 / 3 + 2)}%)` }}>
              {studentProfileData.enrolledCourses.map((course) => (
                <div key={course.id} className="carousel-slide">
                  <div className="course-card-elegant">
                    <div className="course-image-elegant">
                      <img src={course.image} alt={course.name} />
                    </div>
                    <div className="course-body-elegant">
                      <h3 className="course-name-elegant">{course.name}</h3>
                      <p className="course-category-elegant">{course.category}</p>
                      <div className="course-progress-wrapper">
                        <div className="course-progress-bar-elegant">
                          <div
                            className="course-progress-fill-elegant"
                            style={{ width: `${course.progress}% ` }}
                          />
                        </div>
                        <span className="course-progress-text-elegant">{course.progress}% Complete</span>
                      </div>
                      <span className="course-status-badge-elegant" data-status={course.status.toLowerCase()}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-nav-btn next"
              onClick={() => setCoursesIndex(Math.min(studentProfileData.enrolledCourses.length - 3, coursesIndex + 1))}
              disabled={coursesIndex >= studentProfileData.enrolledCourses.length - 3}
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
              onClick={() => setCertificatesIndex(Math.max(0, certificatesIndex - 1))}
              disabled={certificatesIndex === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="carousel-wrapper" style={{ transform: `translateX(-${certificatesIndex * (100 / 3 + 2)}%)` }}>
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
              onClick={() => setCertificatesIndex(Math.min(studentProfileData.certificates.length - 3, certificatesIndex + 1))}
              disabled={certificatesIndex >= studentProfileData.certificates.length - 3}
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
