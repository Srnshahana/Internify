import { useState, useRef, useEffect } from 'react'
import '../App.css'
import dashboardIllustration from '../assets/dashboard.svg'
import dashboardIllustrationDark from '../assets/dashboard-darktheme.svg'
import careerIllustration from '../assets/career.svg'
import {
  homeMentorShowcase,
  homeSkillsIcons,
  homeMarketCourses,
  homeProgressData,
  homeUpcomingSessions,
} from '../Data.jsx'

function Home({ onNavigate }) {
  const mentors = homeMentorShowcase
  const skills = homeSkillsIcons
  const courses = homeMarketCourses

  // Multi-line progress data for the graph (last 8 weeks)
  const progressData = homeProgressData

  // Upcoming sessions data
  const upcomingSessions = homeUpcomingSessions

  const metrics = [
    { name: 'Overall Progress', color: 'var(--text-primary)', dataKey: 'completion' },
  ]

  const [currentSessionIndex, setCurrentSessionIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const sessionsContainerRef = useRef(null)

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
    
    const diff = startY - currentY
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSessionIndex < upcomingSessions.length - 1) {
        // Swipe up - next card
        setCurrentSessionIndex(prev => prev + 1)
      } else if (diff < 0 && currentSessionIndex > 0) {
        // Swipe down - previous card
        setCurrentSessionIndex(prev => prev - 1)
      }
    }

    setIsDragging(false)
    setStartY(0)
    setCurrentY(0)
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartY(e.clientY)
    setCurrentY(e.clientY)
  }

  useEffect(() => {
    const handleMouseMoveEvent = (e) => {
      if (!isDragging) return
      setCurrentY(e.clientY)
    }

    const handleMouseUpEvent = () => {
      if (!isDragging) return
      
      const diff = startY - currentY
      const threshold = 50

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentSessionIndex < upcomingSessions.length - 1) {
          setCurrentSessionIndex(prev => prev + 1)
        } else if (diff < 0 && currentSessionIndex > 0) {
          setCurrentSessionIndex(prev => prev - 1)
        }
      }

      setIsDragging(false)
      setStartY(0)
      setCurrentY(0)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveEvent)
      document.addEventListener('mouseup', handleMouseUpEvent)
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveEvent)
        document.removeEventListener('mouseup', handleMouseUpEvent)
      }
    }
  }, [isDragging, startY, currentY, currentSessionIndex, upcomingSessions.length])

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#facc15' : '#d1d5db' }}>★</span>
    ))
  }

  // Calculate max value for scaling (0-100)
  const maxValue = 100
  const chartHeight = 200
  const chartWidth = 1000 // Increased for better full-width scaling
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const graphWidth = chartWidth - padding.left - padding.right
  const graphHeight = chartHeight - padding.top - padding.bottom

  return (
    <div className="dashboard-page">
      {/* Welcome Hero Section */}
      <div className="home-hero">
        <div className="hero-illustration">
          <img 
            src={dashboardIllustration}
            alt="Person working"
            className="hero-illustration-img hero-illustration-img-light"
          />
          <img 
            src={dashboardIllustrationDark}
            alt="Person working dark theme"
            className="hero-illustration-img hero-illustration-img-dark"
          />
        </div>
        <div className="hero-content">
          <h1 className="welcome-title">
            <span className="welcome-hi">Hi</span>
            <span className="welcome-name">Sherin</span>
          </h1>
          <p className="welcome-tagline">Your skill Your pace Your career</p>
          <p className="welcome-subtagline">Time to make your career journey exciting</p>
        </div>
      </div>

      {/* Upcoming Sessions Section */}
      <div className="dashboard-section">
        <div className="section-header-with-button">
          <h2 className="section-title">Upcoming Sessions</h2>
          <button className="view-all-btn" onClick={() => onNavigate && onNavigate('Calendar')}>
            View all
          </button>
        </div>
        <div 
          className="sessions-stack-container"
          ref={sessionsContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {upcomingSessions.map((session, index) => {
            const isActive = index === currentSessionIndex
            const isNext = index === currentSessionIndex + 1
            const isPrev = index === currentSessionIndex - 1
            const offset = index - currentSessionIndex
            const dragOffset = isDragging ? (currentY - startY) / 10 : 0
            
            let zIndex = upcomingSessions.length - Math.abs(offset)
            let translateY = offset * 20 + (isActive ? dragOffset : 0)
            let scale = 1 - Math.abs(offset) * 0.05
            // Progressive opacity: cards behind are more visible (lighter)
            // Active card: opacity 1, next/prev: 0.9, further back: 0.8, 0.7, etc.
            let opacity = Math.max(0.6, 1 - Math.abs(offset) * 0.15)
            
            // Progressive background: cards behind get progressively lighter
            // Active: #000000, Next/Prev: #1a1a1a, Further: #2a2a2a, #3a3a3a, etc.
            const backgroundColors = ['#000000', '#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a']
            const backgroundColor = backgroundColors[Math.min(Math.abs(offset), backgroundColors.length - 1)]

            return (
              <div
                key={session.id}
                className={`session-card ${isActive ? 'active' : ''} ${isNext ? 'next' : ''} ${isPrev ? 'prev' : ''}`}
                style={{
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  backgroundColor: backgroundColor,
                  cursor: isActive ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                }}
                onClick={() => !isActive && setCurrentSessionIndex(index)}
              >
                <div className="session-card-content">
                  <div className="session-time-section">
                    <div className="session-clock-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className="session-time">
                      <span className="session-time-value">{session.time}</span>
                      <span className="session-time-period">{session.period}</span>
                    </div>
                  </div>
                  <div className="session-divider"></div>
                  <div className="session-details">
                    <p className="session-location">{session.location}</p>
                    <p className="session-course">{session.course}</p>
                    <p className="session-mentor">{session.mentor}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="sessions-indicators">
          {upcomingSessions.map((_, index) => (
            <button
              key={index}
              className={`session-indicator ${index === currentSessionIndex ? 'active' : ''}`}
              onClick={() => setCurrentSessionIndex(index)}
              aria-label={`Go to session ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mentor Recommendation Section */}
      <div className="dashboard-section">
        <div className="section-header-with-button">
          <h2 className="section-title">Mentor recomentation</h2>
          <button className="view-all-btn" onClick={() => onNavigate && onNavigate('Explore')}>
            View more
          </button>
        </div>
        <div className="mentor-cards-scroll">
          {mentors.slice(0, 9).map((mentor, index) => (
            <div key={index} className="mentor-card-home">
              <div className="mentor-avatar-home">
                <img src={mentor.image} alt={mentor.name} />
              </div>
              <h3 className="mentor-name-home">{mentor.name}</h3>
              <p className="mentor-experience">{mentor.experience}</p>
              <p className="mentor-role-home">{mentor.role}</p>
              <div className="mentor-rating-home">
                {renderStars(mentor.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Guidance CTA */}
      <div className="career-guidance-card">
        <div className="guidance-content">
          <h3 className="guidance-title">Can't decide on your career?</h3>
          <p className="guidance-subtitle">Take guidance from professional</p>
          <button className="primary">Take your first step</button>
        </div>
        <div className="guidance-illustration">
          <img 
            src={careerIllustration}
            alt="Career guidance"
            className="guidance-illustration-img"
          />
        </div>
      </div>

      {/* Latest Skills Section */}
      <div className="dashboard-section">
        <h2 className="section-title">Latest Skills</h2>
        <div className="skills-icons-grid">
          <div className="skills-icons-track">
            {/* First set of skills */}
            {skills.map((skill, index) => (
              <div key={`skill-1-${index}`} className="skill-icon-item">
                <div className="skill-icon-large">
                  <img src={skill.icon} alt={skill.name} />
                </div>
                <p className="skill-name">{skill.name}</p>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {skills.map((skill, index) => (
              <div key={`skill-2-${index}`} className="skill-icon-item">
                <div className="skill-icon-large">
                  <img src={skill.icon} alt={skill.name} />
                </div>
                <p className="skill-name">{skill.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <span className="action-text">Referance meterials</span>
          <span className="action-arrow">→</span>
        </div>
        <div className="action-card">
          <span className="action-text">get certification</span>
          <span className="action-arrow">→</span>
        </div>
      </div>

      {/* Course Recommendation Section */}
      <div className="dashboard-section">
        <div className="section-header-with-button">
          <h2 className="section-title">course recomentation</h2>
          <button className="view-all-btn" onClick={() => onNavigate && onNavigate('Explore')}>
            View more
          </button>
        </div>
        <div className="course-cards-scroll">
          {courses.slice(0, 9).map((course, index) => (
            <div key={index} className="course-card-home">
              <div className="course-icon-large">
                <img src={course.icon} alt={course.name} />
              </div>
              <div className="course-content-home">
                <h3 className="course-title-home">{course.name}</h3>
                <p className="course-market">{course.marketStanding}</p>
                <p className="course-description-home">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Progress Graph Section - Moved to End */}
      <div className="dashboard-section progress-graph-section">
        <div className="section-header-with-button">
          <h2 className="section-title">Your Learning Progress</h2>
          <button className="view-all-btn" onClick={() => onNavigate && onNavigate('Classroom')}>
            View details
          </button>
        </div>
        <div className="progress-graph-wrapper">
          <div className="progress-chart-container">
            <svg className="progress-chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              
              {/* Grid lines - subtle */}
              {[0, 25, 50, 75, 100].map((value) => {
                const y = padding.top + graphHeight - (value / maxValue) * graphHeight
                return (
                  <line
                    key={`grid-${value}`}
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + graphWidth}
                    y2={y}
                    stroke="#d1d5db"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                    opacity="0.3"
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
                    fill="#9ca3af"
                    opacity="0.8"
                    fontWeight="400"
                  >
                    {value}%
                  </text>
                )
              })}
              
              {/* Single progress line */}
              {(() => {
                const points = progressData.map((d, i) => {
                  const x = padding.left + (i / (progressData.length - 1)) * graphWidth
                  const y = padding.top + graphHeight - (d.completion / maxValue) * graphHeight
                  return { x, y, value: d.completion }
                })
                
                const areaPath = `M ${points[0].x},${padding.top + graphHeight} ${points.map(p => `L ${p.x},${p.y}`).join(' ')} L ${points[points.length - 1].x},${padding.top + graphHeight} Z`
                const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
                
                return (
                  <g>
                    {/* Subtle area fill */}
                    <path
                      d={areaPath}
                      fill="url(#progressGradient)"
                      className="progress-area"
                    />
                    {/* Clean line */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="progress-line"
                      opacity="0.8"
                    />
                    {/* Minimal data points */}
                    {points.map((point, i) => (
                      <circle
                        key={`point-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r="3"
                        fill="#6b7280"
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
                    fill="#9ca3af"
                    opacity="0.8"
                    fontWeight="400"
                  >
                    {d.week}
                  </text>
                )
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
