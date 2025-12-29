
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
  isLoading = false,
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
      .from('courses')          // your table name
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

  // Helper function to extract mentor data (handles both API and static structures)
  const getMentorData = (mentor) => {
    // Check if it's API structure (has mentor_id or profile_image)
    const isApiStructure = mentor.mentor_id !== undefined || mentor.profile_image !== undefined
    
    if (isApiStructure) {
      // Extract experience years from experience array
      let experienceYears = 0
      if (mentor.experience && Array.isArray(mentor.experience) && mentor.experience.length > 0) {
        const firstExp = mentor.experience[0]
        experienceYears = firstExp?.years || firstExp?.years_of_experience || firstExp?.duration || 0
        // If experience is an object with years property
        if (typeof firstExp === 'object' && firstExp.years) {
          experienceYears = firstExp.years
        }
      }
      
      // Extract skill names from skills array (skills might be objects with name property)
      const skillNames = mentor.skills && Array.isArray(mentor.skills)
        ? mentor.skills.map(skill => {
            if (typeof skill === 'string') return skill
            return skill.name || skill.skill_name || skill.title || ''
          }).filter(Boolean)
        : []
      
      // Get expertise areas (experties_in is an array of strings)
      const expertise = mentor.experties_in || []
      
      // Get name - check multiple possible fields
      const name = mentor.name || mentor.full_name || mentor.first_name || mentor.username || 'Mentor'
      
      // Get role/company from experience array
      const currentExp = mentor.experience && Array.isArray(mentor.experience) && mentor.experience.length > 0
        ? mentor.experience[0]
        : null
      const role = currentExp?.role || currentExp?.job_title || currentExp?.position || mentor.role || ''
      const company = currentExp?.company || currentExp?.organization || currentExp?.employer || mentor.company || ''
      
      // Get category (might be array or string)
      const categoryDisplay = Array.isArray(mentor.category) 
        ? mentor.category.join(', ') 
        : mentor.category || ''
      
      return {
        id: mentor.mentor_id || mentor.id,
        mentor_id: mentor.mentor_id || mentor.id,
        name,
        role,
        company,
        image: mentor.profile_image || mentor.image,
        bio: mentor.bio ? mentor.bio.replace(/[""]/g, '').trim() : '',
        focus: expertise.length > 0 ? expertise.join(', ') : mentor.focus || '',
        expertise: expertise,
        skills: skillNames.length > 0 ? skillNames : expertise, // Use expertise if skills array is empty
        category: categoryDisplay,
        assured: mentor.is_verified || mentor.assured || false,
        experience: experienceYears,
        rating: mentor.rating || mentor.avg_rating || 0,
        education: mentor.education || [],
        testimonials: mentor.testimonial || mentor.testimonials || [],
        // Keep original for backward compatibility
        ...mentor
      }
    }
    
    // Static structure - return as is
    return mentor
  }

  const filteredMentors = useMemo(() => {
    let result = mentors

    // Check if we're using API mentors (has mentor_id or profile_image)
    const isUsingApiMentors = mentors.length > 0 && (mentors[0]?.mentor_id !== undefined || mentors[0]?.profile_image !== undefined)

    // Filter by selected course if a course is selected
    if (selectedCourseId) {
      if (isUsingApiMentors) {
        // For API mentors, filter by course association (if courses are linked)
        result = result.filter(mentor => {
          // Check if mentor has courses array or course_ids
          const mentorCourses = mentor.courses || mentor.course_ids || []
          return mentorCourses.includes(selectedCourseId) || 
                 mentorCourses.some(courseId => (courseId.course_id || courseId) === selectedCourseId)
        })
      } else {
        result = getMentorsByCourse(selectedCourseId)
      }
    }

    // Apply search query if present
    if (query) {
      const lowerQuery = query.toLowerCase()
      if (isUsingApiMentors) {
        // Search API mentors
        result = result.filter((mentor) => {
          const mentorData = getMentorData(mentor)
          const name = (mentorData.name || '').toLowerCase()
          const role = (mentorData.role || '').toLowerCase()
          const company = (mentorData.company || '').toLowerCase()
          const bio = (mentorData.bio || '').toLowerCase()
          const expertise = (mentorData.expertise || []).join(' ').toLowerCase()
          const skills = (mentorData.skills || []).join(' ').toLowerCase()
          const category = (mentorData.category || '').toLowerCase()
          
          return name.includes(lowerQuery) ||
                 role.includes(lowerQuery) ||
                 company.includes(lowerQuery) ||
                 bio.includes(lowerQuery) ||
                 expertise.includes(lowerQuery) ||
                 skills.includes(lowerQuery) ||
                 category.includes(lowerQuery)
        })
      } else {
        // Use static search function
        result = searchMentors(query).filter((mentor) =>
          result.some((m) => m.id === mentor.id)
        )
      }
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
        const category = (course.category || course.career_field || '').toLowerCase()
        const description = (course.description || '').toLowerCase()
        const careerField = (course.career_field || '').toLowerCase()
        const skillLevel = (course.skill_level || '').toLowerCase()
        return title.includes(lowerQuery) || 
               category.includes(lowerQuery) || 
               description.includes(lowerQuery) ||
               careerField.includes(lowerQuery) ||
               skillLevel.includes(lowerQuery)
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
          <span>Showing mentors for: {coursesToUse.find((c) => c.id === selectedCourseId)?.title || coursesToUse.find((c) => c.id === selectedCourseId)?.name}</span>
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
                    src={course.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBdt2bdOr6yNUso2UGqXJRcNpnjWeSlpumaw&s'}
                    alt={course.title || 'Course image'}
                    onError={(e) => {
                      e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBdt2bdOr6yNUso2UGqXJRcNpnjWeSlpumaw&s';
                    }}
                  />
                </div>
                <div className="explore-course-content">
                  <div className="explore-course-header">
                    <h3>{course.title}</h3>
                    <span className="explore-course-category">{course.category || course.career_field}</span>
                  </div>
                  <p className="explore-course-description">{course.description}</p>
                  <div className="explore-course-meta">
                    {course.estimated_time && <><span>{course.estimated_time}</span><span>|</span></>}
                    {course.max_time && <><span>Max: {course.max_time}</span><span>|</span></>}
                    {course.skill_level && <span>{course.skill_level}</span>}
                  </div>
                  {course.prerequisites && (
                    <div className="explore-course-prerequisites">
                      <span className="prerequisites-label">Prerequisites:</span>
                      <span className="prerequisites-text">{course.prerequisites}</span>
                    </div>
                  )}
                  {course.career_field && course.career_field !== course.category && (
                    <div className="explore-course-career-field">
                      <span className="career-field-tag">{course.career_field}</span>
                    </div>
                  )}
                  <div className="explore-course-footer">
                    {course.price && (
                      <span className="explore-course-price">
                        ₹{typeof course.price === 'number' ? course.price.toLocaleString('en-IN') : course.price}
                      </span>
                    )}
                    <button className="tiny">View Mentors</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="explore-grid">
          {isLoading ? (
            <div className="loading-state">
              <p>Loading mentors...</p>
            </div>
          ) : filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => {
              const mentorData = getMentorData(mentor)
              const mentorId = mentorData.mentor_id || mentorData.id
              
              // Ensure skills are strings, not objects
              const allSkills = (mentorData.skills || mentorData.expertise || [])
              const skillsAsStrings = allSkills.map(skill => {
                if (typeof skill === 'string') return skill
                if (typeof skill === 'object' && skill !== null) {
                  return skill.name || skill.skill_name || skill.title || String(skill)
                }
                return String(skill)
              }).filter(Boolean)
              
              const topSkills = skillsAsStrings.slice(0, 3)
              const totalSkillsCount = skillsAsStrings.length
              
              return (
                <div
                  className="mentor-card"
                  key={`explore-${mentorId || mentorData.name}`}
                  onClick={() => onMentorClick && onMentorClick(mentorData)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mentor-card-top">
                    <div className="avatar-img-left">
                      <img 
                        src={mentorData.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=320&q=80'} 
                        alt={mentorData.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=320&q=80'
                        }}
                      />
                    </div>
                    <div className="mentor-name-section">
                      <h4 className="mentor-name-right">{mentorData.name}</h4>
                      {mentorData.assured && <span className="assured-pill-small">✓ Verified</span>}
                    </div>
                  </div>
                  <p className="meta-role">
                    {mentorData.role}
                    {mentorData.company && `, ${mentorData.company}`}
                  </p>
                  
                  {/* Experience and Rating Row */}
                  {mentorData.experience > 0 && (
                    <div className="mentor-meta-row">
                      <span className="mentor-experience">
                        {mentorData.experience}+ years
                      </span>
                      {mentorData.rating > 0 && (
                        <span className="rating-outlined-small">
                          {renderStars(mentorData.rating)}
                          <span className="rating-value-small">({mentorData.rating.toFixed(1)})</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bio or Focus */}
                  {mentorData.bio && (
                    <p className="mentor-text-small">{mentorData.bio}</p>
                  )}
                  {!mentorData.bio && mentorData.focus && (
                    <p className="mentor-text-small">{mentorData.focus}</p>
                  )}

                  {/* Expertise/Skills Tags */}
                  {topSkills.length > 0 && (
                    <div className="mentor-skills-tags">
                      {topSkills.map((skill, idx) => (
                        <span key={idx} className="mentor-skill-tag">{skill}</span>
                      ))}
                      {totalSkillsCount > 3 && (
                        <span className="mentor-skill-tag-more">
                          +{totalSkillsCount - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Category */}
                  {mentorData.category && (
                    <div className="mentor-category">
                      <span className="mentor-category-tag">{mentorData.category}</span>
                    </div>
                  )}

                  <div className="mentor-card-bottom">
                    {mentorData.rating > 0 && !mentorData.experience && (
                      <span className="rating-outlined">
                        {renderStars(mentorData.rating)}
                      </span>
                    )}
                    <div className="mentor-actions">
                      <button
                        className="tiny book-session-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onBookSession && onBookSession()
                        }}
                      >
                        Book your free session
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
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

