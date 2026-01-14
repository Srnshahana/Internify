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

  const stats = [
    { label: 'Exp. Years', value: `${mentorProfileData.experienceYears}+` },
    { label: 'Mentees', value: `${mentorProfileData.menteesCoached}+` },
    { label: 'Avg Rating', value: mentorProfileData.averageRating },
    { label: 'Courses', value: coursesOffered.length },
  ]

  return (
    <div className="profile-page-elegant">
      {/* Profile Cover - Rectangular, no border radius */}
      <div className="profile-cover-elegant"></div>

      <div className="profile-content-wrapper">

        {/* LinkedIn-style Intro Card */}
        <div className="profile-intro-card">
          <div className="profile-intro-header">
            <div className="profile-avatar-linkedin" style={{ background: '#f1f5f9', overflow: 'hidden' }}>
              {mentorProfileData.profilePicture ? (
                <img
                  src={mentorProfileData.profilePicture}
                  alt={mentorProfileData.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '32px', fontWeight: '700', color: '#0ea5e9' }}>
                  {mentorProfileData.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
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
              <h1 className="profile-name-linkedin">{mentorProfileData.name}</h1>
              <p className="profile-headline-tech">
                {mentorProfileData.role} <span>|</span> {mentorProfileData.title}
              </p>

              <div className="profile-location-linkedin">
                <span className="location-text">
                  {mentorProfileData.location}
                </span>
                <span className="bullet-separator">•</span>
                <span className="contact-info-link" style={{ color: '#0ea5e9', cursor: 'pointer' }}>Contact info</span>
              </div>

              <div className="profile-connections-linkedin">
                <span className="connection-count" style={{ color: '#0ea5e9', fontWeight: '600' }}>
                  {mentorProfileData.totalReviews} reviews • 500+ pupils
                </span>
              </div>
            </div>

            <div className="profile-actions-linkedin">
              <button className="btn-linkedin-primary" style={{ background: '#0ea5e9' }}>Edit Profile</button>
              <button className="btn-linkedin-secondary">Manage Courses</button>
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
          </div>
          <p className="profile-bio-linkedin" style={{ lineHeight: '1.6', color: '#475569' }}>
            {mentorProfileData.bio}
          </p>
        </div>

        {/* Experience Section */}
        <div className="profile-section-card">
          <div className="profile-section-header-linkedin">
            <h2 className="section-title-linkedin">Experience</h2>
          </div>
          <div className="timeline-linkedin">
            {workExperience.map((exp) => (
              <div key={exp.id} className="timeline-item-linkedin">
                <div className="timeline-logo-linkedin">
                  <div className="company-logo-placeholder">
                    {exp.company.charAt(0)}
                  </div>
                </div>
                <div className="timeline-content-linkedin">
                  <h3 className="timeline-role-linkedin">{exp.title}</h3>
                  <p className="timeline-company-linkedin">{exp.company}</p>
                  <p className="timeline-date-linkedin">
                    {exp.duration}
                  </p>
                  <p className="timeline-location-linkedin">{exp.location}</p>
                  <p className="timeline-desc-linkedin">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Offered Section (Matching Enrolled Courses style) */}
        <div className="profile-section-elegant">
          <div className="profile-section-header-elegant">
            <h2 className="profile-section-title-elegant">Courses Offered</h2>
          </div>
          <div className="courses-grid-elegant" style={{ marginTop: '20px' }}>
            {coursesOffered.map((course) => (
              <div key={course.id} className="course-card-elegant">
                <div className="course-image-wrapper-elegant">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" alt={course.title} className="course-image-elegant" />
                  <div className="course-status-pill-elegant" style={{ backgroundColor: '#0ca5e9' }}>
                    {course.students} Students
                  </div>
                </div>
                <div className="course-content-elegant">
                  <div className="course-header-elegant">
                    <span className="course-category-elegant">{course.category}</span>
                    <div className="course-rating-box">
                      <span className="star-icon">★</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="course-title-elegant">{course.title}</h3>
                  <p className="course-mentor-elegant">{course.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="profile-section-card">
          <div className="profile-section-header-linkedin">
            <h2 className="section-title-linkedin">Reviews & Feedback</h2>
          </div>
          <div className="reviews-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reviews.map((review) => (
              <div key={review.id} className="review-card" style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#0ea5e9' }}>
                      {review.studentName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{review.studentName}</h4>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>{review.studentRole}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#fbbf24' }}>{renderStars(review.rating)}</div>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>{review.date}</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default MentorProfile

