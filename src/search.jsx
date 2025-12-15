import { useEffect, useMemo, useState } from 'react'
import { searchCourses, searchMentors, getMentorsByCourse } from './Data.jsx'
import './App.css'

export default function Explore({ mentors, courses = [], onBack, renderStars, initialQuery, onMentorClick }) {
  const [activeTab, setActiveTab] = useState('mentors')
  const [term, setTerm] = useState(initialQuery || '')
  const [query, setQuery] = useState(initialQuery || '')
  const [selectedCourseId, setSelectedCourseId] = useState(null)

  useEffect(() => {
    setTerm(initialQuery || '')
    setQuery(initialQuery || '')
  }, [initialQuery])

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId)
    setActiveTab('mentors')
    setQuery('') // Clear search when switching to mentors
    setTerm('')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'courses') {
      setSelectedCourseId(null) // Clear course filter when switching to courses
    }
  }

  const filteredMentors = useMemo(() => {
    let result = mentors

    // Filter by selected course if a course is selected
    if (selectedCourseId) {
      result = getMentorsByCourse(selectedCourseId)
    }

    // Apply search query if present
    if (query) {
      result = searchMentors(query).filter((mentor) =>
        result.some((m) => m.id === mentor.id)
      )
    }

    return result
  }, [mentors, query, selectedCourseId])

  const filteredCourses = useMemo(() => {
    if (!query) return courses
    return searchCourses(query)
  }, [courses, query])

  return (
    <div className="page explore-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>
      <div className="explore-header">
        <div>
          <p className="eyebrow">Browse</p>
          <h1>Explore Courses & Mentors</h1>
          <p className="lead">
            Discover all courses and mentors. Pick anyone to start your learning journey.
          </p>
        </div>
      </div>

      <div className="explore-tabs">
        <button
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => handleTabChange('courses')}
        >
          Courses
        </button>
        <button
          className={`tab-button ${activeTab === 'mentors' ? 'active' : ''}`}
          onClick={() => handleTabChange('mentors')}
        >
          Mentors
        </button>
      </div>

      {selectedCourseId && (
        <div className="course-filter-badge">
          <span>Showing mentors for: {courses.find((c) => c.id === selectedCourseId)?.name}</span>
          <button className="clear-filter-btn" onClick={() => setSelectedCourseId(null)}>
            ✕
          </button>
        </div>
      )}

      <div className="explore-search">
        <input
          placeholder={activeTab === 'courses' ? 'Search courses by name, category, or skills' : 'Search mentors by name, role, or focus'}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setQuery(term.trim())
          }}
        />
        <button className="mini search-go" onClick={() => setQuery(term.trim())}>
          🔍
        </button>
      </div>

      {activeTab === 'courses' ? (
        <div className="explore-courses-grid">
          {filteredCourses.map((course) => (
            <div
              className="explore-course-card"
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="explore-course-image">
                <img src={course.image} alt={course.name} />
              </div>
              <div className="explore-course-content">
                <div className="explore-course-header">
                  <h3>{course.name}</h3>
                  <span className="explore-course-category">{course.category}</span>
                </div>
                <p className="explore-course-description">{course.description}</p>
                <div className="explore-course-meta">
                  <span>{course.duration} weeks</span>
                  <span>•</span>
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>⭐ {course.rating}</span>
                </div>
                <div className="explore-course-skills">
                  {course.skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="explore-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="explore-course-footer">
                  <span className="explore-course-price">${course.price}</span>
                  <button className="tiny">View Mentors</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="explore-grid">
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
            <div
              className="mentor-card"
              key={`explore-${mentor.id || mentor.name}`}
              onClick={() => onMentorClick && onMentorClick(mentor)}
              style={{ cursor: 'pointer' }}
            >
              <div className="mentor-card-top">
                <div className="avatar-img-left">
                  <img src={mentor.image} alt={mentor.name} />
                </div>
                <h4 className="mentor-name-right">{mentor.name}</h4>
              </div>
              <p className="meta-role">{mentor.role}, {mentor.company}</p>
              {mentor.assured && <span className="assured-pill">Platform assured</span>}
              <p className="mentor-text-small">{mentor.focus}</p>
              <div className="mentor-card-bottom">
                <span className="rating-outlined">
                  {renderStars(mentor.rating)}
                </span>
                <div className="mentor-actions">
                  <button className="tiny book-session-btn">Book your free session</button>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="no-results">
              <p>No mentors found for this course.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

