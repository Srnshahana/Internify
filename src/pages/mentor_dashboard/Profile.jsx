import { useState } from 'react'
import '../../App.css'

const mentorProfileData = {
  name: 'Alex Johnson',
  role: 'Mobile App Mentor',
  title: 'Senior Software Engineer · React & Systems Design',
  location: 'Remote · Worldwide',
  profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  bio: 'I help early-career engineers and freshers ship real projects, build confidence in system design, and crack product-company interviews. With over 8 years of experience in building scalable applications, I specialize in React, Node.js, and mobile app development. My teaching style focuses on hands-on learning, real-world projects, and personalized feedback.',
  experienceYears: 8,
  menteesCoached: 120,
  averageRating: 4.8,
  totalReviews: 45,
  offersFrom: ['Google', 'Stripe', 'Swiggy'],
}

const expertise = [
  { name: 'Flutter', level: 'Expert', years: 5 },
  { name: 'React', level: 'Expert', years: 6 },
  { name: 'Node.js', level: 'Advanced', years: 5 },
  { name: 'MERN Stack', level: 'Expert', years: 6 },
  { name: 'UX Design', level: 'Intermediate', years: 3 },
  { name: 'System Design', level: 'Expert', years: 7 },
  { name: 'TypeScript', level: 'Advanced', years: 4 },
  { name: 'MongoDB', level: 'Advanced', years: 5 },
]

const education = [
  {
    id: 1,
    degree: 'Master of Science in Computer Science',
    institution: 'Stanford University',
    location: 'Stanford, CA',
    year: '2014 - 2016',
    gpa: '3.8/4.0',
    description: 'Specialized in Distributed Systems and Machine Learning',
  },
  {
    id: 2,
    degree: 'Bachelor of Engineering in Computer Science',
    institution: 'MIT',
    location: 'Cambridge, MA',
    year: '2010 - 2014',
    gpa: '3.9/4.0',
    description: 'Graduated Summa Cum Laude',
  },
]

const certifications = [
  {
    id: 1,
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issueDate: '2020',
    credentialId: 'AWS-CSA-2020-12345',
  },
  {
    id: 2,
    name: 'Google Cloud Professional Architect',
    issuer: 'Google Cloud',
    issueDate: '2021',
    credentialId: 'GCP-PA-2021-67890',
  },
  {
    id: 3,
    name: 'React Advanced Patterns Certification',
    issuer: 'Meta (Facebook)',
    issueDate: '2022',
    credentialId: 'META-REACT-2022-ABC',
  },
]

const workExperience = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    duration: '2021 - Present',
    type: 'Full-time',
    description: 'Leading a team of 5 engineers building payment infrastructure. Architected scalable microservices handling 10M+ transactions daily. Mentored junior developers and conducted technical interviews.',
    achievements: [
      'Reduced API response time by 40% through optimization',
      'Led migration to microservices architecture',
      'Mentored 15+ junior engineers',
    ],
  },
  {
    id: 2,
    title: 'Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    duration: '2018 - 2021',
    type: 'Full-time',
    description: 'Developed and maintained core features for Google Cloud Platform. Worked on distributed systems handling petabytes of data. Collaborated with cross-functional teams on product launches.',
    achievements: [
      'Launched 3 major features used by 1M+ users',
      'Improved system reliability to 99.99% uptime',
      'Received "Excellence in Engineering" award',
    ],
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'Swiggy',
    location: 'Bangalore, India',
    duration: '2016 - 2018',
    type: 'Full-time',
    description: 'Built and maintained food delivery platform using React and Node.js. Developed real-time order tracking system. Optimized database queries improving performance by 50%.',
    achievements: [
      'Built order tracking system serving 5M+ users',
      'Reduced page load time by 60%',
      'Implemented real-time notifications system',
    ],
  },
]

const coursesOffered = [
  {
    id: 1,
    title: 'React Advanced Patterns',
    category: 'Programming',
    level: 'Advanced',
    students: 45,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: 2,
    title: 'UI/UX Design Principles',
    category: 'Design',
    level: 'Beginner',
    students: 32,
    rating: 4.6,
    status: 'Active',
  },
  {
    id: 3,
    title: 'DSA Mastery',
    category: 'Programming',
    level: 'Intermediate',
    students: 58,
    rating: 4.9,
    status: 'Active',
  },
  {
    id: 4,
    title: 'System Design Fundamentals',
    category: 'Programming',
    level: 'Advanced',
    students: 28,
    rating: 4.7,
    status: 'Active',
  },
]

const reviews = [
  {
    id: 1,
    studentName: 'Sherin',
    studentRole: 'Software Engineer',
    rating: 5,
    date: '2024-02-15',
    comment: 'Alex is an amazing mentor! The sessions were super clear and structured. I finally shipped my first real project with confidence. Highly recommend!',
  },
  {
    id: 2,
    studentName: 'Rahul',
    studentRole: 'Frontend Developer',
    rating: 5,
    date: '2024-02-10',
    comment: 'Great mix of theory and hands-on guidance. Weekly feedback kept me accountable and moving. The code reviews were incredibly helpful.',
  },
  {
    id: 3,
    studentName: 'Fatima',
    studentRole: 'UI/UX Designer',
    rating: 4.5,
    date: '2024-02-05',
    comment: 'Helped me move from confusion to a clear roadmap. The mock interviews were a game changer. Very patient and understanding mentor.',
  },
  {
    id: 4,
    studentName: 'Priya',
    studentRole: 'Full Stack Developer',
    rating: 5,
    date: '2024-01-28',
    comment: 'Best mentor I\'ve had! The system design sessions were eye-opening. Alex explains complex concepts in a simple way. Worth every session!',
  },
  {
    id: 5,
    studentName: 'Amit',
    studentRole: 'Mobile App Developer',
    rating: 4.8,
    date: '2024-01-20',
    comment: 'Excellent teaching style. The React patterns course was comprehensive and practical. I learned so much in just a few weeks.',
  },
]

const availability = [
  { day: 'Monday', slots: '6:00 PM – 9:00 PM IST' },
  { day: 'Wednesday', slots: '6:00 PM – 9:00 PM IST' },
  { day: 'Saturday', slots: '10:00 AM – 1:00 PM IST' },
  { day: 'Sunday', slots: '2:00 PM – 5:00 PM IST' },
]

const contactInfo = {
  email: 'alex.johnson@internify.com',
  linkedin: 'linkedin.com/in/alexjohnson',
  github: 'github.com/alexjohnson',
  website: 'alexjohnson.dev',
}

function MentorProfile() {
  const [isEditing, setIsEditing] = useState(false)

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    return Array(5).fill(0).map((_, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
  }

  return (
    <div className="dashboard-page profile-page-linkedin">
      {/* Profile Header with Cover Photo */}
      <div className="profile-cover-section">
        <div className="profile-cover-photo mentor-cover"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar-large mentor-avatar">
              {mentorProfileData.profilePicture ? (
                <img 
                  src={mentorProfileData.profilePicture} 
                  alt={mentorProfileData.name}
                  className="profile-avatar-image"
                />
              ) : (
                <span>{mentorProfileData.name.split(' ').map(n => n[0]).join('')}</span>
              )}
            </div>
          </div>
          <div className="profile-header-info">
            <h1>{mentorProfileData.name}</h1>
            <p className="profile-role">{mentorProfileData.role}</p>
            <p className="profile-title">{mentorProfileData.title}</p>
            <p className="profile-location">{mentorProfileData.location}</p>
            <div className="profile-rating-header">
              <span className="rating-stars-large">{renderStars(mentorProfileData.averageRating)}</span>
              <span className="rating-value-large">{mentorProfileData.averageRating}</span>
              <span className="rating-count">({mentorProfileData.totalReviews} reviews)</span>
            </div>
            <button className="edit-profile-btn" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Save changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="stat-value">{mentorProfileData.experienceYears}+</div>
          <div className="stat-label">Years of experience</div>
        </div>
        <div className="profile-stat-card">
          <div className="stat-value">{mentorProfileData.menteesCoached}+</div>
          <div className="stat-label">Mentees coached</div>
        </div>
        <div className="profile-stat-card">
          <div className="stat-value">{coursesOffered.length}</div>
          <div className="stat-label">Courses offered</div>
        </div>
        <div className="profile-stat-card">
          <div className="stat-value">{mentorProfileData.averageRating}</div>
          <div className="stat-label">Average rating</div>
        </div>
      </div>

      {/* Bio / Summary Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>About</h2>
          {isEditing && <button className="section-edit-btn">Edit</button>}
        </div>
        <p className="profile-bio-text">{mentorProfileData.bio}</p>
      </div>

      {/* Expertise / Skills Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Expertise & Skills</h2>
          {isEditing && <button className="section-edit-btn">Edit</button>}
        </div>
        <div className="expertise-grid">
          {expertise.map((skill) => (
            <div key={skill.name} className="expertise-item">
              <div className="expertise-header">
                <h4 className="expertise-name">{skill.name}</h4>
                <span className={`expertise-level ${skill.level.toLowerCase()}`}>
                  {skill.level}
                </span>
              </div>
              <p className="expertise-years">{skill.years} years of experience</p>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Education</h2>
          {isEditing && <button className="section-edit-btn">Add education</button>}
        </div>
        <div className="education-timeline">
          {education.map((edu) => (
            <div key={edu.id} className="education-timeline-item">
              <div className="timeline-icon education-icon"></div>
              <div className="timeline-content">
                <h3 className="education-degree">{edu.degree}</h3>
                <p className="education-institution-name">{edu.institution}</p>
                <p className="education-meta">
                  <span className="education-period">{edu.year}</span>
                  <span className="education-location">{edu.location}</span>
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

      {/* Certifications Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Certifications</h2>
          {isEditing && <button className="section-edit-btn">Add certification</button>}
        </div>
        <div className="certifications-list">
          {certifications.map((cert) => (
            <div key={cert.id} className="certification-item">
              <div className="certification-icon">🏆</div>
              <div className="certification-content">
                <h4 className="certification-name">{cert.name}</h4>
                <p className="certification-issuer">{cert.issuer}</p>
                <p className="certification-meta">
                  <span>Issued: {cert.issueDate}</span>
                  {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Experience Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Work Experience</h2>
          {isEditing && <button className="section-edit-btn">Add experience</button>}
        </div>
        <div className="experience-timeline">
          {workExperience.map((exp) => (
            <div key={exp.id} className="experience-timeline-item">
              <div className="timeline-icon"></div>
              <div className="timeline-content">
                <h3 className="experience-title">{exp.title}</h3>
                <p className="experience-company-name">{exp.company}</p>
                <p className="experience-meta">
                  <span className="experience-type-badge" data-type="fulltime">
                    {exp.type}
                  </span>
                  <span className="experience-period">{exp.duration}</span>
                  <span className="experience-location">{exp.location}</span>
                </p>
                <p className="experience-description">{exp.description}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="experience-achievements">
                    <h4 className="achievements-title">Key Achievements:</h4>
                    <ul className="achievements-list">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Offered Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Courses Offered</h2>
          {isEditing && <button className="section-edit-btn">Manage courses</button>}
        </div>
        <div className="courses-offered-grid">
          {coursesOffered.map((course) => (
            <div key={course.id} className="course-offered-card">
              <div className="course-offered-header">
                <h4 className="course-offered-title">{course.title}</h4>
                <span className={`course-status-badge ${course.status.toLowerCase()}`}>
                  {course.status}
                </span>
              </div>
              <div className="course-offered-meta">
                <span className="course-category-badge">{course.category}</span>
                <span className="course-level-badge">{course.level}</span>
              </div>
              <div className="course-offered-stats">
                <div className="course-stat">
                  <span className="stat-label">Students:</span>
                  <span className="stat-value">{course.students}</span>
                </div>
                <div className="course-stat">
                  <span className="stat-label">Rating:</span>
                  <span className="stat-value">
                    {renderStars(course.rating)} {course.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Ratings & Reviews</h2>
          <div className="reviews-summary">
            <span className="rating-stars-large">{renderStars(mentorProfileData.averageRating)}</span>
            <span className="rating-value-large">{mentorProfileData.averageRating}</span>
            <span className="rating-count">Based on {mentorProfileData.totalReviews} reviews</span>
          </div>
        </div>
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-student-info">
                  <div className="review-student-avatar">
                    <span>{review.studentName.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="review-student-name">{review.studentName}</h4>
                    <p className="review-student-role">{review.studentRole}</p>
                  </div>
                </div>
                <div className="review-rating">
                  <span className="rating-stars">{renderStars(review.rating)}</span>
                  <span className="review-date">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Availability Section */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Contact & Availability</h2>
          {isEditing && <button className="section-edit-btn">Edit</button>}
        </div>
        
        <div className="contact-info-section">
          <h3 className="contact-section-title">Contact Information</h3>
          <div className="contact-info-grid">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <span className="contact-label">Email</span>
                <a href={`mailto:${contactInfo.email}`} className="contact-value">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">💼</span>
              <div>
                <span className="contact-label">LinkedIn</span>
                <a href={`https://${contactInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="contact-value">
                  {contactInfo.linkedin}
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">💻</span>
              <div>
                <span className="contact-label">GitHub</span>
                <a href={`https://${contactInfo.github}`} target="_blank" rel="noopener noreferrer" className="contact-value">
                  {contactInfo.github}
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <div>
                <span className="contact-label">Website</span>
                <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="contact-value">
                  {contactInfo.website}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="availability-section">
          <h3 className="contact-section-title">Weekly Availability</h3>
          <div className="availability-list">
            {availability.map((slot, idx) => (
              <div key={idx} className="availability-item">
                <span className="availability-day">{slot.day}</span>
                <span className="availability-time">{slot.slots}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary availability-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Schedule a Session
          </button>
        </div>
      </div>
    </div>
  )
}

export default MentorProfile

