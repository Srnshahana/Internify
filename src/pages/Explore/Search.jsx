import supabase from '../../supabaseClient'
import { useEffect, useMemo, useState } from 'react'
import Loading from '../../components/Loading'
import { searchCourses, searchMentors, getMentorsByCourse } from '../../data/staticData.js'
import { Mentor } from '../../models/Mentor.js'
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
  const [apiMentors, setApiMentors] = useState([])
  const [apiCourses, setApiCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
    setTerm(initialQuery || '')
    setQuery(initialQuery || '')
  }, [initialQuery])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Fetch mentors and courses in parallel
      const [mentorsRes, coursesRes] = await Promise.all([
        supabase
          .from('mentors_details')
          .select('mentor_id, name, profile_image, category, about, address, is_verified, is_platformAssured, coursesOffered, rating'),
        supabase.from('courses').select('course_id, title, image, description, estimated_time, career_field, price_range').order('title', { ascending: true })
      ])

      const { data: mentorsData, error: mentorsError } = mentorsRes
      const { data: coursesData, error: coursesError } = coursesRes

      if (mentorsError) console.error('Error fetching mentors:', mentorsError)
      if (coursesError) console.error('Error fetching courses:', coursesError)

      if (mentorsData && coursesData) {
        const resolvedMentors = mentorsData.map(mentorItem => {
          const courseIds = Array.isArray(mentorItem.coursesOffered)
            ? mentorItem.coursesOffered.map(String)
            : []

          // Match course_id from courses table with IDs in mentor's coursesOffered array
          const fullCourses = coursesData.filter(c =>
            courseIds.includes(String(c.course_id))
          )

          return new Mentor({
            mentor_id: mentorItem.mentor_id,
            id: mentorItem.mentor_id,
            name: mentorItem.name,
            profile_image: mentorItem.profile_image,
            category: mentorItem.category,
            about: mentorItem.about,
            address: mentorItem.address,
            is_verified: mentorItem.is_verified,
            is_platformAssured: mentorItem.is_platformAssured,
            rating: mentorItem.rating,
            coursesOffered: fullCourses
          })
        })
        setApiMentors(resolvedMentors)
        setApiCourses(coursesData)

      } else {
        if (mentorsData) setApiMentors(mentorsData.map(m => new Mentor({ ...m, id: m.mentor_id })))
        if (coursesData) setApiCourses(coursesData)
      }
    } catch (err) {
      console.error('Unexpected error in fetchAllData:', err)
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
    if (!mentor) return null;

    // If it's already a Mentor instance or has the expected normalized structure, return it
    if (mentor instanceof Mentor || (mentor.id && mentor.name && mentor.coursesOffered)) {
      // Add missing UI aliases if not present
      return {
        ...mentor,
        image: mentor.profile_image || mentor.image || '',
        assured: mentor.is_verified || mentor.assured || false,
        reviews: (mentor.testimonial || mentor.testimonials || mentor.testimonialsCount || []).length || mentor.reviews || 0
      }
    }

    // Check if it's raw API structure
    const isApiStructure = mentor.mentor_id !== undefined || mentor.profile_image !== undefined

    if (isApiStructure) {
      const name = mentor.name || mentor.full_name || 'Mentor'
      const mentorId = mentor.mentor_id || mentor.id
      return {
        id: mentorId,
        mentor_id: mentorId,
        name: name,
        about: mentor.about || mentor.bio || '',
        bio: mentor.about || mentor.bio || '', // Aliased for backward compatibility
        address: mentor.address || mentor.location || '',
        location: mentor.address || mentor.location || '', // Aliased
        profileImage: mentor.profile_image || mentor.image || '',
        category: Array.isArray(mentor.category) ? mentor.category.join(', ') : (mentor.category || ''),
        coursesOffered: mentor.coursesOffered || [],
        isVerified: mentor.is_verified || mentor.assured || false,
        platformAssured: mentor.is_platformAssured || false,
        image: mentor.profile_image || mentor.image || '',
        assured: mentor.is_verified || mentor.assured || false,
        rating: mentor.rating || 0
      }
    }

    return mentor
  }



  const filteredMentors = useMemo(() => {
    // Prioritize apiMentors fetched in this component
    let result = apiMentors.length > 0 ? apiMentors : mentors

    if (!result) return []

    // Check if we're using API mentors
    const isUsingApiMentors = result.length > 0 && (result[0] instanceof Mentor || result[0]?.mentor_id !== undefined || result[0]?.profile_image !== undefined)

    // Filter by selected course if a course is selected
    if (selectedCourseId) {
      result = result.filter(mentor => {
        const mentorData = getMentorData(mentor)
        const mentorCourses = mentorData.coursesOffered || []

        return mentorCourses.some(course => {
          const cId = typeof course === 'object' ? (course.course_id || course.id) : course
          return String(cId) === String(selectedCourseId)
        })
      })
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
          <div className="course-filter-badge" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f0f9ff',
            color: '#0369a1',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            width: 'fit-content',
            margin: '0 auto 20px auto',
            border: '1px solid #e0f2fe'
          }}>
            <span>Showing mentors for: {coursesToUse.find((c) => (c.course_id || c.id) === selectedCourseId)?.title}</span>
            <button
              onClick={() => setSelectedCourseId(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#0369a1',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700'
              }}
            >
              ✕
            </button>
          </div>
        )}
        {activeTab === 'courses' ? (
          // console.log(course.Image),
          <div className="explore-courses-grid">
            {loading ? (
              <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
                <Loading size="100px" />
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
                  key={course.course_id || course.id}
                  onClick={() => handleCourseClick(course.course_id || course.id)}
                  style={{
                    cursor: 'pointer',
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className="explore-course-image" style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={course.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBdt2bdOr6yNUso2UGqXJRcNpnjWeSlpumaw&s'}
                      alt={course.title || 'Course image'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBdt2bdOr6yNUso2UGqXJRcNpnjWeSlpumaw&s';
                      }}
                    />
                    {course.career_field && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#0ea5e9',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {course.career_field}
                      </span>
                    )}
                  </div>
                  <div className="explore-course-content" style={{ padding: '16px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', lineHeight: '1.4' }}>
                      {course.title}
                    </h3>

                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      marginBottom: '16px',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {course.description || 'Master professional skills with expert-led training and real-world projects.'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {course.estimated_time && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            {course.estimated_time}
                          </div>
                        )}
                        {course.price_range && (
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                            {course.price_range}
                          </div>
                        )}
                      </div>
                      <button style={{
                        background: '#0ea5e9',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="explore-grid">
            {isLoading ? (
              <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
                <Loading size="100px" />
                <p>Loading mentors...</p>
              </div>
            ) : filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => {
                const mentorData = getMentorData(mentor)
                const mentorId = mentorData.mentor_id || mentorData.id

                // Ensure skills are strings, not objects
                return (
                  <div
                    className="soft-mentor-card"
                    key={`explore-${mentorId || mentorData.name}`}
                    onClick={() => {
                      console.log('Mentor card clicked:', mentorData);
                      if (onMentorClick) onMentorClick(mentorData);
                    }}
                  >
                    <div className="soft-card-header">
                      <div className="soft-avatar-wrapper">
                        <img
                          src={mentorData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorData.name || 'Mentor')}&background=0D0D0D&color=fff`}
                          alt={mentorData.name}
                          className="soft-avatar"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorData.name || 'Mentor')}&background=0D0D0D&color=fff`
                          }}
                        />
                        {mentorData.assured && (
                          <div className="verified-badge-soft" title="Verified Mentor">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                          </div>
                        )}
                      </div>

                      <div className="soft-header-info">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 className="soft-name">{mentorData.name}</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {mentorData.address && (
                            <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              {mentorData.address}
                            </span>
                          )}
                          {mentorData.category && (
                            <span style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: '500' }}>• {mentorData.category}</span>
                          )}
                        </div>
                        {/* Star Rating Section */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill={star <= (mentorData.rating || 0) ? "#facc15" : "#e2e8f0"}
                                style={{ transition: 'fill 0.2s ease' }}
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          {(mentorData.rating > 0) && (
                            <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600', marginLeft: '2px' }}>
                              {mentorData.rating}.0
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="soft-card-body">
                      {/* Bio / About */}
                      <p className="soft-bio" style={{ marginBottom: '12px' }}>
                        {mentorData.about?.substring(0, 80) || 'Experienced mentor ready to help you grow.'}{mentorData.about?.length > 80 ? '...' : ''}
                      </p>

                      {/* Courses Provided */}
                      {mentorData.coursesOffered && mentorData.coursesOffered.length > 0 && (
                        <div className="soft-skills-list" style={{ marginBottom: '12px' }}>
                          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '100%' }}>
                            Courses Provided
                          </p>
                          {mentorData.coursesOffered.slice(0, 3).map((course, idx) => (
                            <span key={idx} className="soft-skill-pill" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #e0f2fe' }}>
                              {typeof course === 'object' ? course.title : 'Course'}
                            </span>
                          ))}
                          {mentorData.coursesOffered.length > 3 && (
                            <span className="soft-more-pill">+{mentorData.coursesOffered.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* <div className="soft-card-footer">
                      <button className="soft-book-btn">Book Session</button>
                    </div> */}
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

