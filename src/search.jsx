
import supabase from './supabaseClient'
import { useEffect, useMemo, useState } from 'react'
import { searchCourses, searchMentors, getMentorsByCourse } from './Data.jsx'
import './App.css'

// Company Icon Helper
const getCompanyIcon = (companyName) => {
  if (!companyName) return null
  
  const company = companyName.toLowerCase()
  const iconSize = 20
  
  // Google
  if (company.includes('google')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    )
  }
  
  // Microsoft
  if (company.includes('microsoft')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="M0 0h11.377v11.372H0z" fill="#f25022"/>
        <path d="M12.623 0H24v11.372H12.623z" fill="#00a4ef"/>
        <path d="M0 12.628h11.377V24H0z" fill="#7fba00"/>
        <path d="M12.623 12.628H24V24H12.623z" fill="#ffb900"/>
      </svg>
    )
  }
  
  // Amazon
  if (company.includes('amazon')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#FF9900">
        <path d="M16.417 9.58a1.03 1.03 0 0 0-1.09.238 3.08 3.08 0 0 1-2.21.888 2.15 2.15 0 0 1-1.44-.5 1.56 1.56 0 0 1-.19-1.94c.33-.506.94-.842 1.56-1.375a4.02 4.02 0 0 0 1.38-2.526c.07-.72-.08-1.38-.47-1.95a3.6 3.6 0 0 0-1.5-1.29 4.12 4.12 0 0 0-2.13-.36 3.8 3.8 0 0 0-2.49 1.39c-.28.3-.5.65-.66 1.03a1.11 1.11 0 0 0 .5 1.5c.4.2.87.12 1.2-.19.28-.26.45-.6.5-.98a1.3 1.3 0 0 1 .81-1.11 1.25 1.25 0 0 1 1.21.08c.3.2.5.55.5.92 0 .7-.2 1.36-.6 1.95-.5.73-1.18 1.2-1.97 1.42a.5.5 0 0 0-.4.49v5.33a.5.5 0 0 0 .17.37c.2.16.5.2.75.08 2.5-1.08 4.47-2.9 5.58-5.25a.5.5 0 0 0-.15-.68zm-1.32 4.38c-.08.06-.17.1-.27.12-.1.02-.2.02-.3 0a4.1 4.1 0 0 1-2.85-2.35.5.5 0 0 0-.93.26 5.2 5.2 0 0 0 3.64 3.06c.22.05.44.05.66 0a.5.5 0 0 0 .35-.65 5.1 5.1 0 0 1-.26-1.44z"/>
        <path d="M19.98 19.19a.5.5 0 0 1-.7.7l-2.3-2.3a.5.5 0 0 1 .7-.7l2.3 2.3z"/>
      </svg>
    )
  }
  
  // Meta/Facebook
  if (company.includes('meta') || company.includes('facebook')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#0084FF">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  }
  
  // Apple
  if (company.includes('apple')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#000000">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
    )
  }
  
  // Netflix
  if (company.includes('netflix')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#E50914">
        <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.924-.004-15.71-.002-22.95zM5.398 0L18.601 24H24L10.603 0H5.398z"/>
      </svg>
    )
  }
  
  // Tesla
  if (company.includes('tesla')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#E31937">
        <path d="M12 5.362l-8.5-4.362v4.362h17V1L12 5.362zm0 1.276l8.5 4.362v8.724H3.5V11l8.5-4.362zm0 1.276L3.5 12v8.724h17V12l-8.5-4.362z"/>
      </svg>
    )
  }
  
  // GitHub
  if (company.includes('github')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  }
  
  // Default company icon
  return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
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
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      {hasHalfStar && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="#facc15"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half-fill)"/>
        </svg>
      )}
      {Array(emptyStars).fill(0).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </>
  )
}


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
                  className="mentor-card-new"
                  key={`explore-${mentorId || mentorData.name}`}
                  onClick={() => onMentorClick && onMentorClick(mentorData)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mentor-card-image-wrapper">
                    <img 
                      src={mentorData.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=320&q=80'} 
                      alt={mentorData.name}
                      className="mentor-card-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=320&q=80'
                      }}
                    />
                    <button 
                      className="mentor-card-favorite"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle favorite action
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    <div className="mentor-card-overlay">
                      <h3 className="mentor-card-name">{mentorData.name}</h3>
                      <p className="mentor-card-location">
                        {mentorData.company && (
                          <span className="mentor-card-company">
                            <span className="mentor-card-company-icon">{getCompanyIcon(mentorData.company)}</span>
                            <span>{mentorData.company}</span>
                          </span>
                        )}
                        {mentorData.company && mentorData.location && ' • '}
                        {mentorData.location || (mentorData.company ? '' : 'Online')}
                      </p>
                    </div>
                  </div>
                  <div className="mentor-card-content">
                    <div className="mentor-card-rating">
                      <span className="rating-stars">{renderStarsFunc(mentorData.rating || 4.5)}</span>
                      <span className="rating-text">{mentorData.rating?.toFixed(1) || 4.5} ({mentorData.reviews || 0} reviews)</span>
                    </div>
                    {mentorData.assured && <span className="mentor-badge">Platform assured</span>}
                    <p className="mentor-card-description">{mentorData.focus || mentorData.role || mentorData.bio?.substring(0, 100) || 'Experienced mentor'}</p>
                    <div className="mentor-card-footer">
                      <span className="mentor-card-price">${mentorData.hourlyRate || '50'}/h</span>
                      <span className="mentor-card-free-lesson">• 1st lesson free</span>
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

