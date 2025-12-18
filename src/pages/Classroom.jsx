import { useState, useEffect, useRef } from 'react'
import '../App.css'
import LiveClassroom from '../liveClassroom.jsx'
import { homeProgressData } from '../Data.jsx'

function Classroom({ onLiveClassroomChange }) {
  const [activeCourseIndex, setActiveCourseIndex] = useState(0)
  const [activeCourse, setActiveCourse] = useState(null)
  const [bottomSheetPosition, setBottomSheetPosition] = useState('half') // 'half' or 'full'
  const [activeTab, setActiveTab] = useState('Classes')
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const carouselRef = useRef(null)
  const bottomSheetRef = useRef(null)

  // Inform dashboard when live classroom is active so the main app bar is hidden
  useEffect(() => {
    if (onLiveClassroomChange) {
      onLiveClassroomChange(!!activeCourse)
    }
  }, [activeCourse, onLiveClassroomChange])

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    return Array(5).fill(0).map((_, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
  }

  // Progress graph data (same as Home dashboard)
  const progressData = homeProgressData
  const maxValue = 100
  const chartHeight = 200
  const chartWidth = 500
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const graphWidth = chartWidth - padding.left - padding.right
  const graphHeight = chartHeight - padding.top - padding.bottom

  const enrolledCourses = [
    {
      id: 1,
      title: 'React Advanced Patterns',
      mentor: 'James Smith',
      mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      progress: 65,
      nextSession: 'Tomorrow, 2:00 PM',
      assignmentsCount: 3,
      category: 'Programming',
      level: 'Advanced',
      type: 'Live',
      rating: 4.0,
      description: 'Master advanced React patterns including hooks, context, and performance optimization. Build scalable applications with industry best practices.',
      classes: [
        { id: 1, title: 'Introduction to Advanced Patterns', duration: '45 min', type: 'Video', completed: true },
        { id: 2, title: 'Custom Hooks Deep Dive', duration: '60 min', type: 'Live', completed: true },
        { id: 3, title: 'Context API & State Management', duration: '50 min', type: 'Video', completed: false },
        { id: 4, title: 'Performance Optimization', duration: '55 min', type: 'Live', completed: false },
      ],
      resources: [
        { id: 1, title: 'React Patterns Guide', type: 'PDF', size: '2.4 MB' },
        { id: 2, title: 'Code Examples Repository', type: 'Link', url: 'https://github.com' },
        { id: 3, title: 'Design System Components', type: 'Figma', url: 'https://figma.com' },
      ],
      assignments: [
        { id: 1, title: 'Build Custom Hook Library', dueDate: '2024-01-15', status: 'Pending' },
        { id: 2, title: 'Optimize React App Performance', dueDate: '2024-01-20', status: 'In Progress' },
        { id: 3, title: 'Context API Implementation', dueDate: '2024-01-25', status: 'Pending' },
      ],
      doubts: [
        { id: 1, question: 'How to optimize re-renders?', status: 'Answered', date: '2024-01-10' },
        { id: 2, question: 'Best practices for custom hooks?', status: 'Pending', date: '2024-01-12' },
      ],
    },
    {
      id: 2,
      title: 'UI/UX Design Principles',
      mentor: 'Michael Torres',
      mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      progress: 40,
      nextSession: 'Friday, 10:00 AM',
      assignmentsCount: 2,
      category: 'Design',
      level: 'Beginner',
      type: 'Hybrid',
      rating: 4.5,
      description: 'Learn user-centered design principles, create stunning interfaces, and build a portfolio that gets you hired.',
      classes: [
        { id: 1, title: 'Design Fundamentals', duration: '40 min', type: 'Video', completed: true },
        { id: 2, title: 'User Research Methods', duration: '50 min', type: 'Live', completed: false },
      ],
      resources: [
        { id: 1, title: 'Design System Guide', type: 'PDF', size: '1.8 MB' },
      ],
      assignments: [
        { id: 1, title: 'Create Design System', dueDate: '2024-01-18', status: 'In Progress' },
      ],
      doubts: [],
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      mentor: 'Emily Johnson',
      mentorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      progress: 80,
      nextSession: 'Today, 4:00 PM',
      assignmentsCount: 1,
      category: 'Data',
      level: 'Intermediate',
      type: 'Recorded',
      rating: 4.8,
      description: 'Transform data into insights using Python, SQL, and machine learning. Work with real datasets.',
      classes: [
        { id: 1, title: 'Python Basics', duration: '60 min', type: 'Video', completed: true },
        { id: 2, title: 'Data Analysis with Pandas', duration: '55 min', type: 'Video', completed: true },
        { id: 3, title: 'Machine Learning Intro', duration: '65 min', type: 'Video', completed: true },
        { id: 4, title: 'Project: Data Pipeline', duration: '70 min', type: 'Live', completed: false },
      ],
      resources: [
        { id: 1, title: 'Python Cheat Sheet', type: 'PDF', size: '1.2 MB' },
        { id: 2, title: 'Dataset Files', type: 'ZIP', size: '45 MB' },
      ],
      assignments: [
        { id: 1, title: 'Build Data Pipeline', dueDate: '2024-01-22', status: 'Pending' },
      ],
      doubts: [
        { id: 1, question: 'Pandas performance tips?', status: 'Answered', date: '2024-01-08' },
      ],
    },
  ]

  const currentCourse = enrolledCourses[activeCourseIndex]

  const handleCarouselScroll = (e) => {
    const container = e.target
    const cardWidth = container.offsetWidth
    const scrollLeft = container.scrollLeft
    const newIndex = Math.round(scrollLeft / cardWidth)
    if (newIndex !== activeCourseIndex && newIndex >= 0 && newIndex < enrolledCourses.length) {
      setActiveCourseIndex(newIndex)
    }
  }

  const scrollToCard = (index) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    scrollToCard(activeCourseIndex)
  }, [activeCourseIndex])

  // Bottom sheet swipe handlers
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    const deltaY = startY - currentY
    const threshold = 100

    if (deltaY > threshold && bottomSheetPosition === 'half') {
      // Swipe up - expand to full
      setBottomSheetPosition('full')
    } else if (deltaY < -threshold && bottomSheetPosition === 'full') {
      // Swipe down - collapse to half
      setBottomSheetPosition('half')
    }

    setIsDragging(false)
    setStartY(0)
    setCurrentY(0)
  }

  // Mouse handlers for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartY(e.clientY)
    setCurrentY(e.clientY)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setCurrentY(e.clientY)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    const deltaY = startY - currentY
    const threshold = 100

    if (deltaY > threshold && bottomSheetPosition === 'half') {
      setBottomSheetPosition('full')
    } else if (deltaY < -threshold && bottomSheetPosition === 'full') {
      setBottomSheetPosition('half')
    }

    setIsDragging(false)
    setStartY(0)
    setCurrentY(0)
  }

  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e) => handleMouseMove(e)
      const handleMouseUpGlobal = () => handleMouseUp()
      document.addEventListener('mousemove', handleMouseMoveGlobal)
      document.addEventListener('mouseup', handleMouseUpGlobal)
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal)
        document.removeEventListener('mouseup', handleMouseUpGlobal)
      }
    }
  }, [isDragging, startY, currentY, bottomSheetPosition])

  if (activeCourse) {
    return <LiveClassroom course={activeCourse} onBack={() => setActiveCourse(null)} />
  }

  return (
    <div className="classroom-page-container">
      {/* Top Half - Carousel */}
      <div className="classroom-carousel-section">
        <div className="classroom-carousel-header">
          <h2>Your classrooms</h2>
        </div>
        <div
          className="classroom-carousel"
          ref={carouselRef}
          onScroll={handleCarouselScroll}
        >
          {enrolledCourses.map((course, index) => (
            <div
              key={course.id}
              className={`classroom-carousel-card ${index === activeCourseIndex ? 'active' : ''}`}
              onClick={() => {
                // Navigate directly to live classroom
                setActiveCourse(course)
              }}
            >
              <div className="carousel-card-content">
                <div className="carousel-header-section">
                  <div className="carousel-mentor-photo">
                    <img src={course.mentorImage} alt={course.mentor} />
                  </div>
                  <div className="carousel-header-info">
                    <p className="carousel-mentor-name">{course.mentor}</p>
                    <p className="carousel-mentor-role">Mobile Application developer</p>
                  </div>
                </div>
                <div className="carousel-details-section">
                  <h3 className="carousel-course-title">{course.title}</h3>
                  <div className="carousel-rating">
                    <span className="carousel-stars">{renderStars(course.rating || 4.0)}</span>
                  </div>
                  <div className="carousel-course-meta">
                    <span className="carousel-category">{course.category}</span>
                    <span className="carousel-level">{course.level}</span>
                  </div>
                  <div className="carousel-session-info">
                    <span className="carousel-session-label">Next Session:</span>
                    <span className="carousel-session-time">{course.nextSession}</span>
                  </div>
                  <div className={`carousel-type-tag ${course.type.toLowerCase()}`}>{course.type}</div>
                </div>
                <div className="carousel-progress-container">
                  <div className="carousel-progress-bar">
                    <div
                      className="carousel-progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="carousel-progress-text">{course.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Dots */}
        <div className="carousel-dots">
          {enrolledCourses.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === activeCourseIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveCourseIndex(index)
                scrollToCard(index)
              }}
              aria-label={`Go to course ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Half - Details Panel */}
      <div
        className={`classroom-bottom-sheet ${bottomSheetPosition} ${isDragging ? 'dragging' : ''}`}
        ref={bottomSheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          transform: isDragging ? `translateY(${Math.min(0, startY - currentY)}px)` : undefined,
        }}
      >
        <div className="bottom-sheet-content">
          {/* Mentor Details Section - Always visible in half view */}
          {bottomSheetPosition === 'half' && (
            <div className="mentor-details-section">
              <h3>Mentor details</h3>
              <div className="mentor-details-card">
                <p className="mentor-details-bio">
                  With 8 years of experience in the tech industry, I've built a reputation as a results-driven developer and a dedicated mentor. I specialize in transforming complex problems into clean, scalable solutions while guiding teams and individuals toward real growth. My career is defined by consist..........
                </p>
                <a href="#" className="view-profile-link">view profile &gt;</a>
              </div>
            </div>
          )}

          {/* Session Ongoing Section - Always visible in half view */}
          {bottomSheetPosition === 'half' && (
            <div className="session-ongoing-section">
              <h3>Session ongoing</h3>
              <div className="session-card">
                <p>Section 8: Data Fetching, Sync Logic & Error Resilience</p>
              </div>
              <a href="#" className="view-all-sections">view all sections &gt;</a>
            </div>
          )}

          {/* Swipe Instruction */}
          {bottomSheetPosition === 'half' && (
            <div className="swipe-instruction">
              <p>Swipe up for complete classroom information.</p>
            </div>
          )}

          {/* Full Screen Content - Detailed View */}
          {bottomSheetPosition === 'full' && (
            <>
              {/* Mentor details with profile link */}
              <div className="full-mentor-section">
                <h3>Mentor details</h3>
                <div className="mentor-details-card full">
                  <img
                    src={currentCourse.mentorImage}
                    alt={currentCourse.mentor}
                    className="mentor-details-photo"
                  />
                  <h4>{currentCourse.mentor}</h4>
                  <p className="mentor-role-full">Mobile Application developer</p>
                  <div className="mentor-rating-row">
                    <span className="carousel-stars">{renderStars(currentCourse.rating || 4)}</span>
                  </div>
                  <a href="#" className="view-profile-link">
                    view profile &gt;
                  </a>
                </div>
              </div>

              {/* Session details */}
              <div className="full-session-section">
                <h3>Session ongoing</h3>
                <div className="session-list">
                  {currentCourse.classes.map((cls) => (
                    <div key={cls.id} className="session-pill">
                      <span>{cls.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress graph */}
              <div className="classroom-progress-section">
                <h3>Progress</h3>
                <div className="classroom-progress-card">
                  <svg
                    className="progress-chart-svg"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="classroomProgressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((value) => {
                      const y = padding.top + graphHeight - (value / maxValue) * graphHeight
                      return (
                        <line
                          key={`grid-${value}`}
                          x1={padding.left}
                          y1={y}
                          x2={padding.left + graphWidth}
                          y2={y}
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="2 4"
                          opacity="0.1"
                        />
                      )
                    })}

                    {/* Y-axis labels */}
                    {[0, 25, 50, 75, 100].map((value) => {
                      const y = padding.top + graphHeight - (value / maxValue) * graphHeight
                      return (
                        <text
                          key={`label-${value}`}
                          x={padding.left - 12}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="10"
                          fill="currentColor"
                          opacity="0.5"
                          fontWeight="400"
                        >
                          {value}%
                        </text>
                      )
                    })}

                    {/* Progress line + area */}
                    {(() => {
                      const points = progressData.map((d, i) => {
                        const x = padding.left + (i / (progressData.length - 1)) * graphWidth
                        const y = padding.top + graphHeight - (d.completion / maxValue) * graphHeight
                        return { x, y, value: d.completion }
                      })

                      const areaPath = `M ${points[0].x},${padding.top + graphHeight} ${points
                        .map((p) => `L ${p.x},${p.y}`)
                        .join(' ')} L ${
                        points[points.length - 1].x
                      },${padding.top + graphHeight} Z`
                      const linePath = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`

                      return (
                        <g>
                          <path d={areaPath} fill="url(#classroomProgressGradient)" className="progress-area" />
                          <path
                            d={linePath}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="progress-line"
                            opacity="0.8"
                          />
                          {points.map((point, i) => (
                            <circle
                              key={`point-${i}`}
                              cx={point.x}
                              cy={point.y}
                              r="3"
                              fill="currentColor"
                              className="progress-point"
                              opacity="0.9"
                            />
                          ))}
                        </g>
                      )
                    })()}

                    {/* X-axis labels */}
                    {progressData.map((d, i) => {
                      const x = padding.left + (i / (progressData.length - 1)) * graphWidth
                      return (
                        <text
                          key={`xlabel-${i}`}
                          x={x}
                          y={chartHeight - padding.bottom + 18}
                          textAnchor="middle"
                          fontSize="10"
                          fill="currentColor"
                          opacity="0.5"
                          fontWeight="400"
                        >
                          {d.week}
                        </text>
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Study materials */}
              <div className="classroom-materials-section">
                <h3>Study materials</h3>
                <div className="resources-list">
                  {currentCourse.resources.map((resource) => (
                    <div key={resource.id} className="resource-item">
                      <div className="resource-icon">{resource.type}</div>
                      <div className="resource-info">
                        <h4>{resource.title}</h4>
                        <p>{resource.size || resource.url}</p>
                      </div>
                      <button className="resource-action-btn">Open</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment sessions */}
              <div className="classroom-assessment-section">
                <h3>Assessment sessions</h3>
                <div className="assignments-list">
                  {currentCourse.assignments.map((assignment) => (
                    <div key={assignment.id} className="assignment-item">
                      <div className="assignment-info">
                        <h4>{assignment.title}</h4>
                        <p>Due: {assignment.dueDate}</p>
                      </div>
                      <span
                        className={`assignment-status ${assignment.status.toLowerCase().replace(' ', '-')}`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="classroom-feedback-section">
                <h3>Feedback</h3>
                <div className="feedback-stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" className="feedback-star">
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  className="feedback-textarea"
                  placeholder="Enter feedback"
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Bottom CTA button - Only visible when bottom sheet is full */}
          {bottomSheetPosition === 'full' && (
            <div className="classroom-bottom-cta">
              <button
                type="button"
                className="enter-classroom-btn"
                onClick={() => setActiveCourse(currentCourse)}
              >
                Enter classroom
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Classroom

