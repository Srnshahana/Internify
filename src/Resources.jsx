import { useState } from 'react'
import './App.css'

const renderStars = (rating) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} style={{ color: '#fbbf24' }}>★</span>
    )
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" style={{ color: '#fbbf24' }}>☆</span>
    )
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} style={{ color: '#d1d5db' }}>★</span>
    )
  }

  return stars
}

const categories = [
  { id: 'programming', name: 'Programming', icon: '💻', count: 12 },
  { id: 'design', name: 'Design', icon: '🎨', count: 8 },
  { id: 'data', name: 'Data Science', icon: '📊', count: 6 },
  { id: 'marketing', name: 'Marketing', icon: '📢', count: 5 },
  { id: 'business', name: 'Business', icon: '💼', count: 7 },
  { id: 'ai', name: 'AI & ML', icon: '🤖', count: 4 },
]

const resourcesByCategory = {
  programming: [
    {
      id: 1,
      title: 'React Advanced Patterns',
      description: 'Complete guide to React patterns, hooks, and best practices',
      materials: [
        { id: 1, name: 'React Patterns Guide.pdf', type: 'PDF', size: '2.4 MB', url: '#' },
        { id: 2, name: 'Custom Hooks Examples.pdf', type: 'PDF', size: '1.8 MB', url: '#' },
        { id: 3, name: 'Performance Optimization.pdf', type: 'PDF', size: '3.2 MB', url: '#' },
      ],
    },
    {
      id: 2,
      title: 'Node.js Backend Development',
      description: 'Building scalable backend applications with Node.js',
      materials: [
        { id: 1, name: 'Node.js Fundamentals.pdf', type: 'PDF', size: '4.1 MB', url: '#' },
        { id: 2, name: 'Express.js Guide.pdf', type: 'PDF', size: '2.9 MB', url: '#' },
        { id: 3, name: 'Database Integration.pdf', type: 'PDF', size: '3.5 MB', url: '#' },
      ],
    },
    {
      id: 3,
      title: 'JavaScript Fundamentals',
      description: 'Master JavaScript from basics to advanced concepts',
      materials: [
        { id: 1, name: 'JS Basics Guide.pdf', type: 'PDF', size: '2.1 MB', url: '#' },
        { id: 2, name: 'ES6+ Features.pdf', type: 'PDF', size: '1.9 MB', url: '#' },
      ],
    },
  ],
  design: [
    {
      id: 4,
      title: 'UI/UX Design Principles',
      description: 'Learn user-centered design and create stunning interfaces',
      materials: [
        { id: 1, name: 'Design Fundamentals.pdf', type: 'PDF', size: '3.8 MB', url: '#' },
        { id: 2, name: 'Figma Workflow Guide.pdf', type: 'PDF', size: '2.6 MB', url: '#' },
        { id: 3, name: 'User Research Methods.pdf', type: 'PDF', size: '2.2 MB', url: '#' },
      ],
    },
    {
      id: 5,
      title: 'Design Systems',
      description: 'Building consistent and scalable design systems',
      materials: [
        { id: 1, name: 'Design System Guide.pdf', type: 'PDF', size: '4.5 MB', url: '#' },
        { id: 2, name: 'Component Library.pdf', type: 'PDF', size: '3.1 MB', url: '#' },
      ],
    },
  ],
  data: [
    {
      id: 6,
      title: 'Data Science Fundamentals',
      description: 'Introduction to data analysis and visualization',
      materials: [
        { id: 1, name: 'Python for Data Science.pdf', type: 'PDF', size: '5.2 MB', url: '#' },
        { id: 2, name: 'Pandas Tutorial.pdf', type: 'PDF', size: '3.4 MB', url: '#' },
        { id: 3, name: 'Data Visualization.pdf', type: 'PDF', size: '2.8 MB', url: '#' },
      ],
    },
  ],
  marketing: [
    {
      id: 7,
      title: 'Digital Marketing Strategy',
      description: 'Social media, SEO, and content marketing essentials',
      materials: [
        { id: 1, name: 'SEO Fundamentals.pdf', type: 'PDF', size: '2.7 MB', url: '#' },
        { id: 2, name: 'Social Media Guide.pdf', type: 'PDF', size: '2.1 MB', url: '#' },
      ],
    },
  ],
  business: [
    {
      id: 8,
      title: 'Product Management',
      description: 'Product strategy, roadmapping, and agile methodologies',
      materials: [
        { id: 1, name: 'Product Strategy.pdf', type: 'PDF', size: '3.6 MB', url: '#' },
        { id: 2, name: 'Agile Methodologies.pdf', type: 'PDF', size: '2.4 MB', url: '#' },
      ],
    },
  ],
  ai: [
    {
      id: 9,
      title: 'Machine Learning Basics',
      description: 'Introduction to ML algorithms and neural networks',
      materials: [
        { id: 1, name: 'ML Fundamentals.pdf', type: 'PDF', size: '4.8 MB', url: '#' },
        { id: 2, name: 'Neural Networks Guide.pdf', type: 'PDF', size: '3.9 MB', url: '#' },
      ],
    },
  ],
}

function Resources({ onBack, mentors = [], onBookSession, onMentorClick }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)

  // Get recommended mentors (first 4 mentors for display)
  const recommendedMentors = mentors.slice(0, 4)

  const handleBookSession = (mentor, e) => {
    e?.stopPropagation()
    if (onBookSession) {
      onBookSession(mentor)
    } else {
      alert(`Booking 1-hour doubt clarification session with ${mentor.name}...\n\nIn a real application, this would open a booking form.`)
    }
  }

  const handleMentorClick = (mentor) => {
    if (onMentorClick) {
      onMentorClick(mentor)
    }
  }

  const currentCourses = selectedCategory ? resourcesByCategory[selectedCategory] || [] : []
  const currentCategory = categories.find(c => c.id === selectedCategory)

  // Get mentors relevant to the course based on category
  const getMentorsForCourse = (course, categoryId) => {
    if (!mentors.length) return []
    
    // Map category to relevant skills
    const categorySkillMap = {
      programming: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Full-stack', 'Backend', 'Frontend'],
      design: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping'],
      data: ['Python', 'Data Science', 'Machine Learning', 'SQL', 'Analytics', 'Statistics'],
      marketing: ['Digital Marketing', 'SEO', 'Content Strategy', 'Growth', 'Marketing'],
      business: ['Product Management', 'Business', 'Strategy', 'Management'],
      ai: ['Machine Learning', 'AI', 'Python', 'Data Science', 'Neural Networks']
    }

    const relevantSkills = categorySkillMap[categoryId] || []
    
    // Filter mentors whose skills match the category
    const relevantMentors = mentors.filter(mentor => 
      mentor.skills?.some(skill => 
        relevantSkills.some(catSkill => 
          skill.toLowerCase().includes(catSkill.toLowerCase()) || 
          catSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    )

    // Return top 4 relevant mentors, or fallback to first 4 if none match
    return relevantMentors.length > 0 ? relevantMentors.slice(0, 4) : mentors.slice(0, 4)
  }

  const handleDownload = (material) => {
    // In a real app, this would download the file
    console.log('Downloading:', material.name)
    // For demo, we can open in new tab or trigger download
    if (material.url && material.url !== '#') {
      window.open(material.url, '_blank')
    } else {
      alert(`Downloading ${material.name}...\n\nIn a real application, this would download the PDF file.`)
    }
  }

  if (selectedCourse) {
    const course = currentCourses.find(c => c.id === selectedCourse)
    if (!course) {
      setSelectedCourse(null)
      return null
    }

    // Get relevant mentors for this course
    const courseMentors = getMentorsForCourse(course, selectedCategory)

    return (
      <div className="page resources-page">
        <button className="back-button" onClick={() => setSelectedCourse(null)}>
          ← Back
        </button>

        <div className="resources-header">
          <div>
            <p className="eyebrow">Free Study Materials</p>
            <h1>{course.title}</h1>
            <p className="lead">{course.description}</p>
          </div>
        </div>

        <div className="resources-content">
          <div className="materials-section">
            <h2 className="section-title">Study Materials</h2>
            <p className="section-subtitle">Download free PDF study materials for this course</p>
            
            <div className="materials-list">
              {course.materials.map((material) => (
                <div key={material.id} className="material-card">
                  <div className="material-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div className="material-info">
                    <h3 className="material-name">{material.name}</h3>
                    <div className="material-meta">
                      <span className="material-type">{material.type}</span>
                      <span className="material-size">{material.size}</span>
                    </div>
                  </div>
                  <button 
                    className="download-btn"
                    onClick={() => handleDownload(material)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download
                  </button>
                </div>
              ))}
            </div>

            {/* Scroll Indicator for Mentor Recommendations */}
            {courseMentors.length > 0 && (
              <div className="scroll-indicator-mentors">
                <div className="scroll-indicator-content">
                  <p className="scroll-indicator-text">Need help? Get mentor recommendations below</p>
                  <div className="scroll-indicator-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="resources-sidebar">
            <div className="info-card">
              <h3>About Free Resources</h3>
              <p>These study materials are provided free of charge to help you learn and grow. Download and use them for your personal learning journey.</p>
            </div>
            <div className="info-card">
              <h3>Want More?</h3>
              <p>Enroll in our full courses to get access to live sessions, assignments, mentor feedback, and certificates.</p>
              <button className="primary" onClick={onBack}>
                Explore Courses
              </button>
            </div>
          </div>
        </div>

        {/* Mentor Recommendations for Course */}
        {courseMentors.length > 0 && (
          <section className="course-mentor-recommendations">
            <div className="course-mentor-recommendations-header">
              <div>
                <p className="eyebrow">Need Help with This Course?</p>
                <h2>Get Doubt Clarification from Expert Mentors</h2>
                <p className="lead">
                  Book a 1-hour session with experienced mentors who specialize in {currentCategory?.name.toLowerCase()} to clarify your doubts and get personalized guidance.
                </p>
              </div>
            </div>

            <div className="course-mentor-recommendations-grid">
              {courseMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="course-mentor-recommendation-card"
                  onClick={() => handleMentorClick(mentor)}
                >
                  <div className="course-mentor-recommendation-avatar">
                    <img src={mentor.image} alt={mentor.name} />
                    {mentor.assured && (
                      <span className="assured-badge-small">✓</span>
                    )}
                  </div>
                  <div className="course-mentor-recommendation-info">
                    <h3 className="course-mentor-recommendation-name">{mentor.name}</h3>
                    <p className="course-mentor-recommendation-role">{mentor.role}</p>
                    <p className="course-mentor-recommendation-company">{mentor.company}</p>
                    <div className="course-mentor-recommendation-rating">
                      <span className="rating-stars">{renderStars(mentor.rating)}</span>
                      <span className="rating-value">{mentor.rating}</span>
                    </div>
                    <div className="course-mentor-recommendation-skills">
                      {mentor.skills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="course-mentor-recommendation-pricing">
                      <span className="hourly-rate">${mentor.hourlyRate || 75}</span>
                      <span className="hourly-label">/ hour</span>
                    </div>
                    <button
                      className="book-session-btn"
                      onClick={(e) => handleBookSession(mentor, e)}
                    >
                      Book 1-Hour Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  if (selectedCategory) {
    return (
      <div className="page resources-page">
        <button className="back-button" onClick={() => setSelectedCategory(null)}>
          ← Back to Categories
        </button>

        <div className="resources-header">
          <div>
            <p className="eyebrow">Free Resources</p>
            <h1>{currentCategory?.name} Resources</h1>
            <p className="lead">Browse free study materials for {currentCategory?.name.toLowerCase()} courses</p>
          </div>
        </div>

        <div className="resources-courses-grid">
          {currentCourses.length > 0 ? (
            currentCourses.map((course) => (
              <div
                key={course.id}
                className="resource-course-card"
                onClick={() => setSelectedCourse(course.id)}
              >
                <div className="resource-course-header">
                  <h3 className="resource-course-title">{course.title}</h3>
                  <span className="resource-count-badge">{course.materials.length} materials</span>
                </div>
                <p className="resource-course-description">{course.description}</p>
                <div className="resource-course-footer">
                  <span className="resource-materials-count">
                    {course.materials.length} PDF{course.materials.length !== 1 ? 's' : ''} available
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No resources available for this category yet.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="page resources-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="resources-header">
        <div>
          <p className="eyebrow">Free Learning Resources</p>
          <h1>Study Materials Library</h1>
          <p className="lead">
            Access free PDF study materials for various courses. Download and learn at your own pace.
          </p>
        </div>
      </div>

      <div className="resources-categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="resource-category-card"
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="category-icon-large">{category.icon}</div>
            <h3 className="category-name">{category.name}</h3>
            <p className="category-count">{category.count} courses available</p>
            <div className="category-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Mentor Recommendations Section */}
      {recommendedMentors.length > 0 && (
        <section className="mentor-recommendations-section">
          <div className="mentor-recommendations-header">
            <div>
              <p className="eyebrow">Need Help?</p>
              <h2>Get Doubt Clarification from Expert Mentors</h2>
              <p className="lead">
                Book a 1-hour session with experienced mentors to clarify your doubts and get personalized guidance.
              </p>
            </div>
          </div>

          <div className="mentor-recommendations-grid">
            {recommendedMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="mentor-recommendation-card"
                onClick={() => handleMentorClick(mentor)}
              >
                <div className="mentor-recommendation-avatar">
                  <img src={mentor.image} alt={mentor.name} />
                  {mentor.assured && (
                    <span className="assured-badge-small">✓</span>
                  )}
                </div>
                <div className="mentor-recommendation-info">
                  <h3 className="mentor-recommendation-name">{mentor.name}</h3>
                  <p className="mentor-recommendation-role">{mentor.role}</p>
                  <p className="mentor-recommendation-company">{mentor.company}</p>
                  <div className="mentor-recommendation-rating">
                    <span className="rating-stars">{renderStars(mentor.rating)}</span>
                    <span className="rating-value">{mentor.rating}</span>
                  </div>
                  <div className="mentor-recommendation-skills">
                    {mentor.skills?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  <div className="mentor-recommendation-pricing">
                    <span className="hourly-rate">${mentor.hourlyRate || 75}</span>
                    <span className="hourly-label">/ hour</span>
                  </div>
                  <button
                    className="book-session-btn"
                    onClick={(e) => handleBookSession(mentor, e)}
                  >
                    Book 1-Hour Session
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mentor-recommendations-footer">
            <p>Need help choosing a mentor? <a href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }}>Browse all mentors</a></p>
          </div>
        </section>
      )}
    </div>
  )
}

export default Resources

