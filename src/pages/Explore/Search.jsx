
import supabase from '../../supabaseClient'
import { useEffect, useMemo, useState } from 'react'
import { searchCourses, searchMentors, getMentorsByCourse } from '../../data/staticData.js'
import '../../App.css'

const heroSectionImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'

const ArrowLeftIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
)

// Company Icon Helper
const getCompanyIcon = (companyName) => {
  if (!companyName) return null

  const company = companyName.toLowerCase()
  const iconSize = 20

  // Google
  if (company.includes('google')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    )
  }

  // Microsoft
  if (company.includes('microsoft')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="M0 0h11.377v11.372H0z" fill="#f25022" />
        <path d="M12.623 0H24v11.372H12.623z" fill="#00a4ef" />
        <path d="M0 12.628h11.377V24H0z" fill="#7fba00" />
        <path d="M12.623 12.628H24V24H12.623z" fill="#ffb900" />
      </svg>
    )
  }

  // Amazon
  if (company.includes('amazon')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#FF9900">
        <path d="M16.417 9.58a1.03 1.03 0 0 0-1.09.238 3.08 3.08 0 0 1-2.21.888 2.15 2.15 0 0 1-1.44-.5 1.56 1.56 0 0 1-.19-1.94c.33-.506.94-.842 1.56-1.375a4.02 4.02 0 0 0 1.38-2.526c.07-.72-.08-1.38-.47-1.95a3.6 3.6 0 0 0-1.5-1.29 4.12 4.12 0 0 0-2.13-.36 3.8 3.8 0 0 0-2.49 1.39c-.28.3-.5.65-.66 1.03a1.11 1.11 0 0 0 .5 1.5c.4.2.87.12 1.2-.19.28-.26.45-.6.5-.98a1.3 1.3 0 0 1 .81-1.11 1.25 1.25 0 0 1 1.21.08c.3.2.5.55.5.92 0 .7-.2 1.36-.6 1.95-.5.73-1.18 1.2-1.97 1.42a.5.5 0 0 0-.4.49v5.33a.5.5 0 0 0 .17.37c.2.16.5.2.75.08 2.5-1.08 4.47-2.9 5.58-5.25a.5.5 0 0 0-.15-.68zm-1.32 4.38c-.08.06-.17.1-.27.12-.1.02-.2.02-.3 0a4.1 4.1 0 0 1-2.85-2.35.5.5 0 0 0-.93.26 5.2 5.2 0 0 0 3.64 3.06c.22.05.44.05.66 0a.5.5 0 0 0 .35-.65 5.1 5.1 0 0 1-.26-1.44z" />
        <path d="M19.98 19.19a.5.5 0 0 1-.7.7l-2.3-2.3a.5.5 0 0 1 .7-.7l2.3 2.3z" />
      </svg>
    )
  }

  // Meta/Facebook
  if (company.includes('meta') || company.includes('facebook')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#0084FF">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }

  // Apple
  if (company.includes('apple')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#000000">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    )
  }

  // Netflix
  if (company.includes('netflix')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#E50914">
        <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.924-.004-15.71-.002-22.95zM5.398 0L18.601 24H24L10.603 0H5.398z" />
      </svg>
    )
  }

  // Tesla
  if (company.includes('tesla')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#E31937">
        <path d="M12 5.362l-8.5-4.362v4.362h17V1L12 5.362zm0 1.276l8.5 4.362v8.724H3.5V11l8.5-4.362zm0 1.276L3.5 12v8.724h17V12l-8.5-4.362z" />
      </svg>
    )
  }

  // GitHub
  if (company.includes('github')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    )
  }

  // Default company icon
  return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

// Helper function to render stars
const renderStarsFunc = (rating) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <>
      {Array(fullStars).fill(0).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#facc15">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half-fill)" />
        </svg>
      )}
      {Array(emptyStars).fill(0).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </>
  )
}


// Helper to normalize mentor data


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
    console.log('--------------------------------------');
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
      let categoryDisplay = ''
      if (Array.isArray(mentor.category)) {
        categoryDisplay = mentor.category.join(', ')
      } else if (typeof mentor.category === 'string') {
        categoryDisplay = mentor.category
      } else if (mentor.category && typeof mentor.category === 'object') {
        // detailed object?
        categoryDisplay = mentor.category.name || mentor.category.title || ''
      }

      // Final mapping matching the user's requested structure
      return {
        id: mentor.mentor_id || mentor.id,
        name: name,
        bio: mentor.about || mentor.bio || '',
        location: mentor.address || mentor.location || '',
        profileImage: mentor.profile_image || mentor.image || '',
        category: categoryDisplay,
        coursesOffered: mentor.coursesOffered || mentor.courses || [],
        expertise: expertise,
        skills: skillNames,
        education: mentor.education || [],
        experience: mentor.experience || [],
        testimonials: mentor.testimonial || mentor.testimonials || [],
        isVerified: mentor.is_verified || mentor.assured || false,
        platformAssured: mentor.is_platformAssured || false,
        // Helper derived fields
        role: role,
        company: company,
        experienceYears: experienceYears,
        rating: mentor.rating || mentor.avg_rating || 5.0,
        hourlyRate: mentor.hourlyRate || 50
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
          if (!mentor) return false
          const mentorData = getMentorData(mentor)
          if (!mentorData) return false

          const name = String(mentorData.name || '').toLowerCase()
          const role = String(mentorData.role || '').toLowerCase()
          const company = String(mentorData.company || '').toLowerCase()
          const bio = String(mentorData.bio || '').toLowerCase()
          const expertise = (Array.isArray(mentorData.expertise) ? mentorData.expertise : []).join(' ').toLowerCase()
          const skills = (Array.isArray(mentorData.skills) ? mentorData.skills : []).join(' ').toLowerCase()
          const category = String(mentorData.category || '').toLowerCase()

          return name.includes(lowerQuery) ||
            role.includes(lowerQuery) ||
            company.includes(lowerQuery) ||
            bio.includes(lowerQuery) ||
            expertise.includes(lowerQuery) ||
            skills.includes(lowerQuery) ||
            category.includes(lowerQuery)
        })
      } else {
        try {
          // Use static search function
          result = searchMentors(query).filter((mentor) =>
            result.some((m) => m.id === mentor.id)
          )
        } catch (e) {
          console.error("Search error fallback:", e)
        }
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
        if (!course) return false
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
    try {
      return searchCourses(query)
    } catch (e) {
      return []
    }
  }, [coursesToUse, query, apiCourses])

  return (
    <div className="explore-page-new">
      <div className="explore-soft-container">
        {/* Soft Header Section */}
        <div className="explore-soft-container" style={{ paddingTop: '80px' }}>
          {/* Sticky App Bar */}
          <div className="explore-app-bar">
            <div className="app-bar-content">
              <button className="back-btn-icon" onClick={onBack} aria-label="Back">
                <ArrowLeftIcon />
              </button>
              <h1 className="app-bar-title">Explore</h1>
            </div>
          </div>

          {/* Floating Control Bar */}
          <div className="floating-control-bar">
            {/* Tabs */}
            <div className="soft-tabs">
              <button
                className={`soft-tab ${activeTab === 'mentors' ? 'active' : ''}`}
                onClick={() => handleTabChange('mentors')}
              >
                Mentors
              </button>
              <button
                className={`soft-tab ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => handleTabChange('courses')}
              >
                Courses
              </button>
            </div>

            {/* Separator */}
            <div className="control-divider"></div>

            {/* Search Input */}
            <div className="soft-search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon-soft">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="soft-search-input"
                placeholder={activeTab === 'courses' ? 'Search courses...' : 'Search mentors, roles...'}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setQuery(term.trim())
                }}
              />
            </div>

            <button className="soft-search-btn" onClick={() => setQuery(term.trim())}>
              Search
            </button>
          </div>
        </div>

        {selectedCourseId && (
          <div className="active-filter-chip">
            <span>Filter: {coursesToUse.find((c) => c.id === selectedCourseId)?.title || 'Selected Course'}</span>
            <button onClick={() => setSelectedCourseId(null)}>✕</button>
          </div>
        )}

        {selectedCourseId && (
          <div className="course-filter-badge">
            <span>Showing mentors for: {coursesToUse.find((c) => c.id === selectedCourseId)?.title || coursesToUse.find((c) => c.id === selectedCourseId)?.name}</span>
            <button className="clear-filter-btn" onClick={() => setSelectedCourseId(null)}>
              ✕
            </button>
          </div>
        )}
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
                    className="soft-mentor-card"
                    key={`explore-${mentorId || mentorData.name}`}
                    onClick={() => onMentorClick && onMentorClick(mentorData)}
                  >
                    <div className="soft-card-header">
                      <div className="soft-avatar-wrapper">
                        <img
                          src={mentorData.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=320&q=80'}
                          alt={mentorData.name}
                          className="soft-avatar"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=320&q=80'
                          }}
                        />
                        {mentorData.assured && (
                          <div className="verified-badge-soft" title="Verified Mentor">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                          </div>
                        )}
                      </div>

                      <div className="soft-header-info">
                        <h3 className="soft-name">{mentorData.name}</h3>
                        <p className="soft-role">
                          {mentorData.role}
                          {mentorData.company && <span className="soft-at"> @ {mentorData.company}</span>}
                        </p>
                        <div className="soft-rating">
                          <span className="star-icon">★</span>
                          <span className="rating-val">{mentorData.rating?.toFixed(1) || 4.8}</span>
                          <span className="review-count">({mentorData.reviews || 12} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="soft-card-body">
                      {/* Tags/Skills Pill List */}
                      <div className="soft-skills-list">
                        {topSkills.map((skill, idx) => (
                          <span key={idx} className="soft-skill-pill">{skill}</span>
                        ))}
                        {totalSkillsCount > 3 && <span className="soft-more-pill">+{totalSkillsCount - 3}</span>}
                      </div>

                      <p className="soft-bio">
                        {mentorData.bio?.substring(0, 80) || 'Experienced mentor ready to help you grow.'}...
                      </p>
                    </div>

                    <div className="soft-card-footer">
                      <div className="soft-price">
                        <span className="curr">$</span>
                        <span className="val">{mentorData.hourlyRate || 50}</span>
                        <span className="unit">/hr</span>
                      </div>
                      <button className="soft-book-btn">Book Session</button>
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
    </div>
  )
}

