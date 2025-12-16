import { useState } from 'react'
import '../App.css'
import { studentProfileData } from '../Data.jsx'
import { getCourseById } from '../Data.jsx'
import { CertificateIcon } from '../components/Icons.jsx'

function Profile() {
  const [isEditing, setIsEditing] = useState(false)

  const stats = [
    { label: 'Courses Completed', value: '2' },
    { label: 'Courses In Progress', value: '2' },
    { label: 'Mentorship Sessions', value: '45' },
    { label: 'Certificates', value: '5' },
  ]

  return (
    <div className="dashboard-page profile-page-linkedin">
      {/* Profile Header with Cover Photo */}
      <div className="profile-cover-section">
        <div className="profile-cover-photo"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar-large">
              {studentProfileData.avatar}
            </div>
          </div>
          <div className="profile-header-info">
            <h1>{studentProfileData.name}</h1>
            <p className="profile-role">{studentProfileData.role}</p>
            <p className="profile-location">{studentProfileData.location}</p>
            <button className="edit-profile-btn" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Save' : 'Edit Profile'}
            </button>
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
          {isEditing && <button className="section-edit-btn">Edit</button>}
        </div>
        <p className="profile-bio-text">{studentProfileData.bio}</p>
      </div>

      {/* Internships Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Internships</h2>
          {isEditing && <button className="section-edit-btn">Add internship</button>}
        </div>
        <div className="experience-timeline">
          {studentProfileData.internships && studentProfileData.internships.length > 0 ? (
            studentProfileData.internships.map((internship) => (
              <div key={internship.id} className="experience-timeline-item">
                <div className="timeline-icon"></div>
                <div className="timeline-content">
                  <h3>{internship.title}</h3>
                  <p className="experience-company-name">{internship.company}</p>
                  <p className="experience-meta">
                    <span className="experience-type-badge" data-type="internship">
                      Internship
                    </span>
                    <span className="experience-period">
                      {internship.startDate} - {internship.endDate}
                    </span>
                    <span className="experience-location">{internship.location}</span>
                  </p>
                  <p className="experience-description">{internship.description}</p>
                  {internship.skills && internship.skills.length > 0 && (
                    <div className="experience-skills">
                      {internship.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state-text">No internships added yet</p>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Projects</h2>
          {isEditing && <button className="section-edit-btn">Add project</button>}
        </div>
        <div className="experience-timeline">
          {studentProfileData.projects && studentProfileData.projects.length > 0 ? (
            studentProfileData.projects.map((project) => (
              <div key={project.id} className="experience-timeline-item">
                <div className="timeline-icon project-icon"></div>
                <div className="timeline-content">
                  <h3>{project.title}</h3>
                  <p className="experience-company-name">{project.type}</p>
                  <p className="experience-meta">
                    <span className="experience-type-badge" data-type="project">
                      Project
                    </span>
                    <span className="experience-period">
                      {project.startDate} - {project.endDate}
                    </span>
                  </p>
                  <p className="experience-description">{project.description}</p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="experience-skills">
                      {project.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state-text">No projects added yet</p>
          )}
        </div>
      </div>

      {/* Education Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Education</h2>
          {isEditing && <button className="section-edit-btn">Add education</button>}
        </div>
        <div className="education-timeline">
          {studentProfileData.education.map((edu) => (
            <div key={edu.id} className="education-timeline-item">
              <div className="timeline-icon education-icon"></div>
              <div className="timeline-content">
                <h3>{edu.degree}</h3>
                <p className="education-institution-name">{edu.institution}</p>
                <p className="education-meta">
                  <span className="education-period">
                    {edu.startYear} - {edu.endYear}
                  </span>
                  {edu.gpa && <span className="education-gpa">GPA: {edu.gpa}</span>}
                </p>
                {edu.description && (
                  <p className="education-description">{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Enrolled Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Courses Enrolled</h2>
          {isEditing && <button className="section-edit-btn">Browse courses</button>}
        </div>
        <div className="courses-enrolled-scroll">
          {studentProfileData.enrolledCourses.map((course) => {
            const courseDetails = getCourseById(course.id)
            return (
              <div key={course.id} className="course-card-home">
                <div className="course-image-home">
                  <img src={course.image} alt={course.name} />
                </div>
                <h3 className="course-name-home">{course.name}</h3>
                <p className="course-category-home">{course.category}</p>
                <div className="course-progress-section-home">
                  <div className="course-progress-bar-home">
                    <div 
                      className="course-progress-fill-home" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="course-progress-info-home">
                    <span className="course-progress-text-home">{course.progress}% Complete</span>
                  </div>
                </div>
                <span className="course-status-badge-home" data-status={course.status.toLowerCase()}>
                  {course.status}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Certificates Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Licenses & Certifications</h2>
          {isEditing && <button className="section-edit-btn">Add certification</button>}
        </div>
        <div className="certificates-scroll">
          {studentProfileData.certificates.map((cert) => (
            <div key={cert.id} className="certificate-document">
              <div className="certificate-header">
                <div className="certificate-icon">
                  <CertificateIcon />
                </div>
                <div className="certificate-badge">Verified</div>
              </div>
              <div className="certificate-body">
                <h3 className="certificate-title">{cert.name}</h3>
                <div className="certificate-divider"></div>
                <p className="certificate-issuer-label">Issued by</p>
                <p className="certificate-issuer-name">{cert.issuer}</p>
                <div className="certificate-footer">
                  <div className="certificate-date-info">
                    <span className="certificate-date-label">Issued</span>
                    <span className="certificate-date-value">{cert.issueDate}</span>
                  </div>
                  <div className="certificate-id-info">
                    <span className="certificate-id-label">Credential ID</span>
                    <span className="certificate-id-value">{cert.credentialId}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
