import { useMemo, useState } from 'react'
import { courses, mentors, searchCourses, searchMentors, getMentorsByCourse, getCategories } from '../Data.jsx'
import { ExploreIcon, ProgrammingIcon, DesignIcon, DataIcon, MarketingIcon, CloudIcon, BusinessIcon, AIIcon, WritingIcon, SecurityIcon } from '../components/Icons.jsx'
import '../App.css'

// Category icon mapping
const getCategoryIcon = (category) => {
  const iconMap = {
    'Programming': ProgrammingIcon,
    'Design': DesignIcon,
    'Data': DataIcon,
    'Marketing': MarketingIcon,
    'Cloud': CloudIcon,
    'Business': BusinessIcon,
    'AI': AIIcon,
    'Writing': WritingIcon,
    'Security': SecurityIcon,
  }
  return iconMap[category] || BusinessIcon
}

function Explore() {
  const [activeTab, setActiveTab] = useState('mentors')
  const [term, setTerm] = useState('')
  const [query, setQuery] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [showCategories, setShowCategories] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId)
    setActiveTab('mentors')
    setQuery('')
    setTerm('')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'courses') {
      setSelectedCourseId(null)
    }
  }

  const filteredMentors = useMemo(() => {
    let result = mentors

    if (selectedCourseId) {
      result = getMentorsByCourse(selectedCourseId)
    }

    if (selectedCategories.length > 0) {
      // Only mentors who have at least one course in the selected categories
      result = result.filter((mentor) =>
        mentor.courses.some((cid) => {
          const course = courses.find((c) => c.id === cid)
          return course && selectedCategories.includes(course.category)
        })
      )
    }

    if (query) {
      result = searchMentors(query).filter((mentor) =>
        result.some((m) => m.id === mentor.id)
      )
    }

    return result
  }, [query, selectedCourseId, selectedCategories])

  const filteredCourses = useMemo(() => {
    let result = courses

    if (selectedCategories.length > 0) {
      result = result.filter((course) => selectedCategories.includes(course.category))
    }

    if (query) {
      const searched = searchCourses(query)
      // Intersect category-filtered result with search result
      result = searched.filter((course) => result.some((r) => r.id === course.id))
    }

    return result
  }, [query, selectedCategories])

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    const stars = Array(5).fill('☆').map((star, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
    return stars
  }

  const categories = getCategories()
  const categoryCounts = categories.map(category => {
    const categoryCourses = courses.filter(c => c.category === category)
    const categoryMentors = mentors.filter(m => 
      m.courses.some(cid => courses.find(c => c.id === cid && c.category === category))
    )
    return {
      name: category,
      count: categoryCourses.length + categoryMentors.length,
      firstCourseId: categoryCourses.length > 0 ? categoryCourses[0].id : null,
      Icon: getCategoryIcon(category)
    }
  })

  return (
    <div className="dashboard-page">
      <div className="explore-header">
        <div>
          {/* <p className="eyebrow">Browse</p> */}
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

      <div className="explore-search">
        <input
          placeholder={activeTab === 'courses' ? 'Search courses by name, category, or skills' : 'Search mentors by name, role, or focus'}
          value={term}
          onChange={(e) => {
            setTerm(e.target.value)
            setQuery(e.target.value.trim())
          }}
          onFocus={() => setShowCategories(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setShowCategories(false)
              setQuery(term.trim())
            }
          }}
        />
        <button
          className="mini search-go"
          onClick={() => {
            setShowCategories(false)
            setQuery(term.trim())
          }}
        >
          <ExploreIcon className="search-icon" />
        </button>
      </div>

      {/* Browse by Category options (shown while focusing the search field) */}
      {showCategories && (
        <div className="dashboard-section browse-category-section">
          <div className="category-scroll-container">
            <div className="category-scroll">
              {categoryCounts.map((category) => {
                const IconComponent = category.Icon
                const isSelected = selectedCategories.includes(category.name)
                return (
                  <div 
                    key={category.name} 
                    className={`category-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      // Toggle visual selection (multi-select)
                      setSelectedCategories((prev) =>
                        prev.includes(category.name)
                          ? prev.filter((c) => c !== category.name)
                          : [...prev, category.name]
                      )
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="category-icon">
                      <IconComponent />
                    </div>
                    <h3>{category.name}({category.count})</h3>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selected categories summary */}
      {selectedCategories.length > 0 && (
        <div className="course-filter-badge">
          <span>
            Selected categories: {selectedCategories.join(', ')}
          </span>
          <button
            className="clear-filter-btn"
            onClick={() => setSelectedCategories([])}
          >
            ✕
          </button>
        </div>
      )}

      {selectedCourseId && (
        <div className="course-filter-badge">
          <span>Showing mentors for: {courses.find((c) => c.id === selectedCourseId)?.name}</span>
          <button className="clear-filter-btn" onClick={() => setSelectedCourseId(null)}>
            ✕
          </button>
        </div>
      )}

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
                  <span>|</span>
                  <span>{course.level}</span>
                  <span>|</span>
                  <span>{course.rating} rating</span>
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
                key={`explore-${mentor.id}`}
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
                    <button className="tiny book-session-btn" onClick={() => onNavigate && onNavigate('Login')}>Book your free session</button>
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

export default Explore
