
import supabase from './supabaseClient'
import { useEffect, useMemo, useState } from 'react'
import { searchCourses, searchMentors, getMentorsByCourse } from './Data.jsx'
import './App.css'





export default function Explore({
  mentors,
  courses = [],
  onBack,
  renderStars,
  initialQuery,
  onMentorClick,
  onBookSession,
}) {
  const [activeTab, setActiveTab] = useState('mentors')
  const [term, setTerm] = useState(initialQuery || '')
  const [query, setQuery] = useState(initialQuery || '')
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [apiCourses, setApiCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
    setTerm(initialQuery || '')
    setQuery(initialQuery || '')
  }, [initialQuery])

  const fetchCourses = async () => {
    console.log('--------------------------------------')
    setLoading(true)
    const { data, error } = await supabase
      .from('Courses')          // your table name
      .select('*')
      .order('title', { ascending: true })

    if (error) {
      console.error('Error fetching courses:', error)
      setApiCourses([])
    } else {
      setApiCourses(data || [])
      console.log('Fetched courses:', data)
    }
    setLoading(false)
  }

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

  // Use API courses if available, otherwise fall back to prop courses
  const coursesToUse = apiCourses.length > 0 ? apiCourses : courses

  const filteredCourses = useMemo(() => {
    if (!query) return coursesToUse
    // If using API courses, filter them directly
    if (apiCourses.length > 0) {
      const lowerQuery = query.toLowerCase()
      return coursesToUse.filter((course) => {
        const title = (course.title || course.name || '').toLowerCase()
        const category = (course.category || '').toLowerCase()
        const description = (course.description || '').toLowerCase()
        return title.includes(lowerQuery) || category.includes(lowerQuery) || description.includes(lowerQuery)
      })
    }
    return searchCourses(query)
  }, [coursesToUse, query, apiCourses])

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
          <span>Showing mentors for: {coursesToUse.find((c) => c.id === selectedCourseId)?.name || coursesToUse.find((c) => c.id === selectedCourseId)?.title}</span>
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
          Search
        </button>
      </div>
      {activeTab === 'courses' ? (
        // console.log(course.Image),
        <div className="explore-courses-grid">
          {loading ? (
            <div className="loading-state">
              <p>Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="no-results">
              <p>No courses found.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
             
              <div
                className="explore-course-card"
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="explore-course-image">
                  <img
                    src={
                      course.image
                    }
                    alt={course.name || course.title || 'Course image'}
                    onError={(e) => {
                      e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBdt2bdOr6yNUso2UGqXJRcNpnjWeSlpumaw&s';
                    }}
                  />
                </div>
                <div className="explore-course-content">
                  <div className="explore-course-header">
                    <h3>{course.name || course.title}</h3>
                    <span className="explore-course-category">{course.category}</span>
                  </div>
                  <p className="explore-course-description">{course.description}</p>
                  <div className="explore-course-meta">
                    {course.duration && <><span>{course.duration} weeks</span><span>|</span></>}
                    {course.level && <><span>{course.level}</span><span>|</span></>}
                    {course.rating && <span>{course.rating} rating</span>}
                  </div>
                  {course.skills && course.skills.length > 0 && (
                    <div className="explore-course-skills">
                      {course.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="explore-skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="explore-course-footer">
                    {course.price && <span className="explore-course-price">${course.price}</span>}
                    <button className="tiny">View Mentors</button>
                  </div>
                </div>
              </div>
            ))
          )}
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
                    <button
                      className="tiny book-session-btn"
                      onClick={() => onBookSession && onBookSession()}
                    >
                      Book your free session
                    </button>
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

