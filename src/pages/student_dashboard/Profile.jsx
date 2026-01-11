import { useState } from 'react'
import '../../App.css'
import { studentProfileData } from '../../Data.jsx'
import { getCourseById } from '../../Data.jsx'
import { CertificateIcon } from '../../components/Icons.jsx'

function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [coursesIndex, setCoursesIndex] = useState(0)
  const [certificatesIndex, setCertificatesIndex] = useState(0)

  const stats = [
    { label: 'Courses Completed', value: '2' },
    { label: 'Courses In Progress', value: '2' },
    { label: 'Mentorship Sessions', value: '45' },
    { label: 'Certificates', value: '5' },
  ]

  return (
    <div className="profile-page-elegant">
      {/* Profile Cover & Header */}
      <div className="profile-cover-elegant"></div>

      <div className="profile-header-wrapper">
        <div className="profile-avatar-elegant">
          {studentProfileData.avatar}
        </div>

        <div className="profile-info-section">
          <h1 className="profile-name-elegant">{studentProfileData.name}</h1>
          <p className="profile-role-elegant">{studentProfileData.role}</p>
          <p className="profile-location-elegant">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {studentProfileData.location}
          </p>
          <button className="profile-btn-elegant" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="profile-stats-elegant">
        {stats.map((stat) => (
          <div key={stat.label} className="profile-stat-card-elegant">
            <div className="stat-value-elegant">{stat.value}</div>
            <div className="stat-label-elegant">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Sections */}
      <div className="profile-content-wrapper">

        {/* About Section */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">About</h2>
            {isEditing && <button className="section-edit-btn-elegant">Edit</button>}
          </div>
          <p className="profile-bio-elegant">{studentProfileData.bio}</p>
        </div>

        {/* Internships Section */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Internships</h2>
            {isEditing && <button className="section-edit-btn-elegant">Add internship</button>}
          </div>
          <div className="timeline-elegant">
            {studentProfileData.internships && studentProfileData.internships.length > 0 ? (
              studentProfileData.internships.map((internship) => (
                <div key={internship.id} className="timeline-item-elegant">
                  <div className="timeline-icon-elegant">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <div className="timeline-content-elegant">
                    <h3 className="timeline-title-elegant">{internship.title}</h3>
                    <p className="timeline-subtitle-elegant">{internship.company}</p>
                    <div className="timeline-meta-elegant">
                      <span className="timeline-badge-elegant badge-internship">Internship</span>
                      <span className="timeline-period-elegant">
                        {internship.startDate} - {internship.endDate}
                      </span>
                      <span className="timeline-location-elegant">{internship.location}</span>
                    </div>
                    <p className="timeline-description-elegant">{internship.description}</p>
                    {internship.skills && internship.skills.length > 0 && (
                      <div className="timeline-skills-elegant">
                        {internship.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag-elegant">{skill}</span>
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
            {studentProfileData.projects && studentProfileData.projects.length > 0 ? (
              studentProfileData.projects.map((project) => (
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
            {studentProfileData.education.map((edu) => (
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
                            style={{ width: `${course.progress}%` }}
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
    </div>
  )
}

export default Profile
