import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mentors, courses } from '../../data/staticData.js'
import { ProgrammingIcon, DesignIcon, AIIcon, BusinessIcon, DataIcon, MarketingIcon, CloudIcon, SecurityIcon, WritingIcon, ExploreIcon, CalendarIcon, ClassroomIcon, ProfileIcon, FolderIcon, CertificateIcon } from '../../components/Icons.jsx'
import { checkAuthSession, clearAuthData } from '../../utils/auth.js'
// Hero section images removed as assets - using inline styles or URLs if needed
const SuccessStory1 = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
const SuccessStory2 = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80'
const SuccessStory3 = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80'
import adds1 from '../../assets/images/adds1.png'
import adds2 from '../../assets/images/adds2.png'
import adds3 from '../../assets/images/adds3.png'
import topprogram4 from '../../assets/images/topprogram1.jpeg'
import topprogram3 from '../../assets/images/topprogram2.jpeg'
import topprogram2 from '../../assets/images/topprogram3.jpg'
import topprogram1 from '../../assets/images/topprogram4.jpg'
import testimonial1 from '../../assets/images/testimonial1.png'
import testimonial2 from '../../assets/images/testimonial2.png'
import testimonial3 from '../../assets/images/testimonial3.png'
import testimonial4 from '../../assets/images/testimonial4.png'
import supabase from '../../supabaseClient'
import '../../App.css'

// Map courses to skills format
// Top Rated Programs Data
const latestSkills = [
  {
    id: 'top-1',
    name: 'Coding / Software Engineering',
    image: topprogram1,
    category: 'Development',
    description: 'Master full-stack development and engineering principles.',
    rating: 4.9,
    level: 'All Levels',
    duration: 12
  },
  {
    id: 'top-2',
    name: 'Content Creation & Digital Media',
    image: topprogram2,
    category: 'Creative',
    description: 'Build your brand and master digital storytelling.',
    rating: 4.8,
    level: 'Beginner',
    duration: 8
  },
  {
    id: 'top-3',
    name: 'Soft Skills & Career Growth',
    image: topprogram3,
    category: 'Personal Growth',
    description: 'Enhance communication, leadership, and interview skills.',
    rating: 4.9,
    level: 'All Levels',
    duration: 4
  },
  {
    id: 'top-4',
    name: 'Entrepreneurship & Business',
    image: topprogram4,
    category: 'Business',
    description: 'Learn to launch, manage, and scale your business ideas.',
    rating: 4.7,
    level: 'Intermediate',
    duration: 16
  }
]

const howItWorksSteps = [
  {
    number: 1,
    title: '1-on-1 Mentorship Sessions',
    description: 'Personalized guidance from industry mentors focused on real hiring needs.',
    icon: ProfileIcon,
  },
  {
    number: 2,
    title: 'Job-Ready Real-World Projects',
    description: 'Work on practical projects that demonstrate actual workplace skills.',
    icon: FolderIcon,
  },
  {
    number: 3,
    title: 'Internify Certificate of Completion',
    description: 'Skill-verified certification to strengthen resumes and profiles.',
    icon: CertificateIcon,
  },
  {
    number: 4,
    title: 'Referral Letter from Mentors',
    description: 'Mentor-issued referral letters to support internship and job applications.',
    icon: WritingIcon,
  },
  {
    number: 5,
    title: 'Interview Preparation & Hiring Support',
    description: 'Mock interviews, resume reviews, and guidance aligned with recruiter expectations.',
    icon: BusinessIcon,
  },
]

const careerGuidanceTestimonials = [
  {
    id: 1,
    mentorImage: testimonial1,
    mentorName: 'Sarah Anderson',
    mentorRole: 'UX Designer @ Google',
    quote: 'My career guidance sessions helped me transition from a non-tech background to landing my dream job at Google. The personalized guidance and real-world projects made all the difference.',
    studentName: 'Alex Johnson',
    studentRating: 5,
    bgColor: 'blue'
  },
  {
    id: 2,
    mentorImage: testimonial2,
    mentorName: 'David Chen',
    mentorRole: 'Backend Lead @ Amazon',
    quote: 'The career guidance program exceeded my expectations. I built a portfolio that got me multiple job offers within 3 months of completing the program.',
    studentName: 'Emma Williams',
    studentRating: 5,
    bgColor: 'blue'
  },
  {
    id: 3,
    mentorImage: testimonial3,
    mentorName: 'Emily Davis',
    mentorRole: 'Product Manager @ Netflix',
    quote: 'I was stuck in my career, but my advisor provided clarity and direction. Now I\'m working on exciting ML projects and loving every moment.',
    studentName: 'James Brown',
    studentRating: 5,
    bgColor: 'blue'
  },
  {
    id: 4,
    mentorImage: testimonial4,
    mentorName: 'Jessica Martinez',
    mentorRole: 'Marketing Strategist @ Spotify',
    quote: 'The weekly sessions kept me accountable and motivated. My advisor\'s feedback on my career path was invaluable in improving my approach.',
    studentName: 'Sophia Martinez',
    studentRating: 5,
    bgColor: 'blue'
  }
]

const studentTestimonials = [
  {
    id: 1,
    type: 'featured',
    image: SuccessStory1,
    title: 'How Students Land Their Dream Jobs Through Mentorship',
    description: 'Discover how personalized mentorship helps students transition from learning to landing roles at top tech companies.',
    category: 'Success Stories'
  },
  {
    id: 2,
    type: 'story',
    image: SuccessStory2,
    name: 'Emma Williams',
    role: 'Software Engineer at Microsoft',
    title: 'From Self-Taught to Software Engineer',
    description: 'Emma shares her journey from learning to code independently to landing her dream role with mentor guidance.',
    category: 'Student Journey'
  },
  {
    id: 3,
    type: 'insight',
    image: SuccessStory3,
    title: 'Building a Portfolio That Gets You Hired',
    description: 'Learn the key strategies for creating a portfolio that stands out to employers and showcases your real-world skills.',
    category: 'Career Tips'
  },
]

const simpleTestimonials = [
  {
    id: 1,
    name: 'Sarah Anderson',
    role: 'Product Designer',
    company: 'Google',
    avatar: testimonial1,
    quote: 'Internify helped me transition from a non-tech background to landing my dream job at Google. The personalized mentorship was exactly what I needed.'
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Senior Mentor',
    company: 'Amazon',
    avatar: testimonial2,
    quote: 'Guiding students through real-world projects and seeing them succeed is incredibly rewarding. The curriculum here is top-notch.'
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Data Scientist',
    company: 'Spotify',
    avatar: testimonial3,
    quote: 'I was stuck in my career, but my advisor provided clarity and direction. Now I\'m working on exciting ML projects and loving every moment.'
  },
  {
    id: 4,
    name: 'Jessica Martinez',
    role: 'UX Researcher',
    company: 'Netflix',
    avatar: testimonial4,
    quote: 'The weekly sessions kept me accountable and motivated. My mentor\'s feedback was invaluable in improving my approach and landing my role.'
  }
]

// Additional icon components
const TargetIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const FinanceIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const ProductIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" x2="9" y1="3" y2="21" />
    <line x1="3" x2="21" y1="12" y2="12" />
  </svg>
)

const MobileIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" x2="12" y1="18" y2="18" />
  </svg>
)

const WebIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const DevOpsIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" x2="12" y1="22.08" y2="12" />
  </svg>
)

// Category data with icons
const categories = [
  { id: 'engineering', name: 'Engineering', icon: ProgrammingIcon, searchTerm: 'engineering' },
  { id: 'design', name: 'Design', icon: DesignIcon, searchTerm: 'design' },
  { id: 'ai', name: 'AI', icon: AIIcon, searchTerm: 'ai' },
  { id: 'leadership', name: 'Leadership', icon: BusinessIcon, searchTerm: 'leadership' },
  { id: 'career-guidance', name: 'Career Guidance', icon: TargetIcon, searchTerm: 'career guidance' },
  { id: 'marketing', name: 'Marketing', icon: MarketingIcon, searchTerm: 'marketing' },
  { id: 'data-science', name: 'Data Science', icon: DataIcon, searchTerm: 'data science' },
  { id: 'cloud', name: 'Cloud', icon: CloudIcon, searchTerm: 'cloud' },
  { id: 'security', name: 'Security', icon: SecurityIcon, searchTerm: 'security' },
  { id: 'writing', name: 'Writing', icon: WritingIcon, searchTerm: 'writing' },
  { id: 'finance', name: 'Finance', icon: FinanceIcon, searchTerm: 'finance' },
  { id: 'product', name: 'Product', icon: ProductIcon, searchTerm: 'product' },
  { id: 'mobile', name: 'Mobile', icon: MobileIcon, searchTerm: 'mobile' },
  { id: 'web', name: 'Web', icon: WebIcon, searchTerm: 'web' },
  { id: 'devops', name: 'DevOps', icon: DevOpsIcon, searchTerm: 'devops' },
]

export default function LandingPage({
  onOpenExplore,
  onOpenResources,
  onOpenLogin,
  onMentorClick,
  onBookSession,
  renderStars,
  showNavbar = true
}) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const user = await checkAuthSession()
      setIsLoggedIn(!!user)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearAuthData()
    setIsLoggedIn(false)
    navigate('/')
  }
  const mentorTrackRef = useRef(null)
  const skillsTrackRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentSkillsPage, setCurrentSkillsPage] = useState(0)
  const [skillsTotalPages, setSkillsTotalPages] = useState(1)
  const [currentMentorPage, setCurrentMentorPage] = useState(0)
  const [mentorTotalPages, setMentorTotalPages] = useState(1)
  const categoryScrollRef = useRef(null)
  const heroSectionRef = useRef(null)
  const [apiMentors, setApiMentors] = useState([])
  const [isLoadingMentors, setIsLoadingMentors] = useState(true)
  const [currentCareerGuidanceIndex, setCurrentCareerGuidanceIndex] = useState(0)
  const [currentSimpleTestimonialPage, setCurrentSimpleTestimonialPage] = useState(1)
  const [contactEmail, setContactEmail] = useState('')
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)
  const howItWorksSectionRef = useRef(null)
  const careerGuidanceRightRef = useRef(null)
  const careerGuidanceTrackRef = useRef(null)
  const ads = [
    { id: 1, image: adds1, title: 'Internify Ad 1' },
    { id: 2, image: adds2, title: 'Internify Ad 2' },
    { id: 3, image: adds3, title: 'Internify Ad 3' },
  ]

  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const minSwipeDistance = 50

  // For infinite loop, we clone the first and last few items
  const displayAds = [ads[ads.length - 1], ...ads, ads[0]]
  const [currentAdIndex, setCurrentAdIndex] = useState(1) // Start at the real first item
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Infinite Ad Banner Loop
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextAd()
    }, 4000)
    return () => clearInterval(timer)
  }, [currentAdIndex])

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) handleNextAd()
    if (isRightSwipe) handlePrevAd()
  }

  // Mouse handlers for desktop swipe
  const onMouseDown = (e) => {
    setTouchEnd(null)
    setTouchStart(e.clientX)
  }

  const onMouseMove = (e) => {
    if (touchStart) setTouchEnd(e.clientX)
  }

  const onMouseUp = () => {
    if (!touchStart || !touchEnd) {
      setTouchStart(null)
      return
    }
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) handleNextAd()
    if (isRightSwipe) handlePrevAd()
    setTouchStart(null)
  }

  const handleNextAd = () => {
    setIsTransitioning(true)
    setCurrentAdIndex((prev) => prev + 1)
  }

  const handlePrevAd = () => {
    setIsTransitioning(true)
    setCurrentAdIndex((prev) => prev - 1)
  }

  const handleTransitionEnd = () => {
    if (currentAdIndex >= displayAds.length - 1) {
      setIsTransitioning(false)
      setCurrentAdIndex(1)
    } else if (currentAdIndex <= 0) {
      setIsTransitioning(false)
      setCurrentAdIndex(displayAds.length - 2)
    }
  }

  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoadingMentors(true)
        const { data: mentorsFromApi, error: mentorsError } = await supabase
          .from('mentors_details')
          .select('*')
          .limit(5)
        console.log('mentorsFromApi', mentorsFromApi)
        if (mentorsError) {
          console.error('Error fetching mentors:', mentorsError)
          setApiMentors([])
        } else {
          setApiMentors(mentorsFromApi || [])
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
        setApiMentors([])
      } finally {
        setIsLoadingMentors(false)
      }
    }

    fetchMentors()
  }, [])

  const renderStarsFunc = renderStars || ((score) => {
    const full = Math.floor(score)
    const half = score - full >= 0.5
    const stars = Array(5).fill('☆').map((star, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
    return stars
  })

  const mentorsToDisplay = apiMentors.length > 0
    ? apiMentors.map(mentor => ({
      id: mentor.mentor_id || mentor.id,
      name: mentor.name || 'Mentor',
      role: mentor.career_field || mentor.role || 'Mentor',
      company: mentor.company || '',
      focus: mentor.bio || mentor.description || '',
      rating: mentor.rating || 4.5,
      assured: true,
      experience: mentor.experience || 0,
      hourlyRate: mentor.hourly_rate || 50,
      image: mentor.profile_image || mentor.image || 'https://via.placeholder.com/150',
    }))
    : mentors.slice(0, 5)

  const scrollMentors = (dir) => {
    const el = mentorTrackRef.current
    if (!el) return
    const distance = el.clientWidth * 0.8
    el.scrollBy({ left: dir === 'next' ? distance : -distance, behavior: 'smooth' })
  }

  const handleSearch = () => {
    const q = searchTerm.trim().toLowerCase()
    navigate(`/explore?q=${encodeURIComponent(q)}`)
  }

  const handleNavSearch = (term) => {
    const q = term.toLowerCase()
    setSearchTerm(term)
    navigate(`/explore?q=${encodeURIComponent(q)}`)
  }

  // Handle skills slider scroll to update dot indicators
  useEffect(() => {
    const track = skillsTrackRef.current
    if (!track) return

    const calculatePages = () => {
      const cardWidth = 352 // minmax(320px, 380px) average
      const gap = 24
      const cardsPerPage = Math.floor(track.clientWidth / (cardWidth + gap)) || 1
      const totalPages = Math.ceil(latestSkills.length / cardsPerPage)
      setSkillsTotalPages(totalPages)
      return { cardsPerPage, totalPages, cardWidth, gap }
    }

    const handleScroll = () => {
      const { cardsPerPage, totalPages, cardWidth, gap } = calculatePages()
      const scrollLeft = track.scrollLeft
      const scrollDistance = (cardWidth + gap) * cardsPerPage
      const page = Math.round(scrollLeft / scrollDistance)
      setCurrentSkillsPage(Math.min(page, Math.max(0, totalPages - 1)))
    }

    calculatePages() // Initial calculation
    track.addEventListener('scroll', handleScroll)

    // Also handle window resize to recalculate
    const handleResize = () => {
      calculatePages()
      handleScroll()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      track.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Handle mentor slider scroll to update dot indicators
  useEffect(() => {
    const track = mentorTrackRef.current
    if (!track) return

    const calculatePages = () => {
      const cardWidth = 350 // minmax(320px, 380px) average
      const gap = 24
      const cardsPerPage = Math.floor(track.clientWidth / (cardWidth + gap)) || 1
      const totalPages = Math.ceil(mentorsToDisplay.length / cardsPerPage)
      setMentorTotalPages(totalPages)
      return { cardsPerPage, totalPages, cardWidth, gap }
    }

    const handleScroll = () => {
      const { cardsPerPage, totalPages, cardWidth, gap } = calculatePages()
      const scrollLeft = track.scrollLeft
      const scrollDistance = (cardWidth + gap) * cardsPerPage
      const page = Math.round(scrollLeft / scrollDistance)
      setCurrentMentorPage(Math.min(page, Math.max(0, totalPages - 1)))
    }

    calculatePages() // Initial calculation
    track.addEventListener('scroll', handleScroll)

    // Also handle window resize to recalculate
    const handleResize = () => {
      calculatePages()
      handleScroll()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      track.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [mentorsToDisplay.length])

  const scrollCareerGuidance = (direction) => {
    if (direction === 'right') {
      setCurrentCareerGuidanceIndex((prev) =>
        prev < careerGuidanceTestimonials.length - 1 ? prev + 1 : prev
      )
    } else {
      setCurrentCareerGuidanceIndex((prev) =>
        prev > 0 ? prev - 1 : prev
      )
    }
  }

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200
      categoryScrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="landing-page-new">
      {showNavbar && (
        <nav className="elegant-navbar">
          <div className="user-profile-left">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User Profile" />
          </div>
          <div className="nav-actions-right">
            {isLoggedIn ? (
              <button className="login-btn-elegant" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <button className="apply-mentor-btn" onClick={() => navigate('/login')}>Login</button>
                <button className="login-btn-elegant" onClick={() => navigate('/apply-mentor')}>Apply as mentor</button>
              </>
            )}
          </div>
        </nav>
      )}

      <section className="elegant-hero">
        {/* <div className="hero-blur-bg"></div> */}
        <div className="hero-glass-card">
          <h1 className="hero-heading-elegant">Find your <span>perfect mentor</span></h1>

          <div className="elegant-search-container">
            <div className="elegant-search-box">
              <input
                type="text"
                className="elegant-search-input"
                placeholder="Search for mentors, skills, or career paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="elegant-search-btn" onClick={handleSearch}>Search</button>
            </div>

            {/* <div className="suggestion-tags">
              {['Career Guidance',
                'Tech & Digital',
                'Content Creation',
                'Entrepreneurship',
                'Marketing & Growth',
                'Soft Skills'].map(tag => (
                  <button
                    key={tag}
                    className="suggestion-tag"
                    onClick={() => handleNavSearch(tag)}
                  >
                    {tag}
                  </button>
                ))}
            </div> */}
          </div>
        </div>
      </section>


      <section className="elegant-programs-section">
        <h2 className="programs-heading-small landing-section-title" style={{ paddingLeft: '0%' }}>Top rated programs</h2>

        <div className="landing-carousel-container">
          <div className="classroom-carousel">
            {latestSkills.slice(0, 4).map((skill) => {
              const courseData = courses.find(c => c.id === skill.id || c.name === skill.name)
              const rating = courseData?.rating || 4.5
              const level = courseData?.level || 'Intermediate'
              const duration = courseData?.duration || 12

              return (
                <div
                  className="classroom-carousel-card landing-program-card"
                  key={skill.id || skill.name}
                  onClick={() => handleNavSearch(skill.name)}
                >
                  <div className="program-card-image-wrapper">
                    <img src={skill.image} alt={skill.name} className="program-card-image" />
                    <div className="program-card-gradient-overlay"></div>
                  </div>
                  <div className="program-card-content">
                    <h3 className="program-card-title">{skill.name}</h3>

                    <div className="program-card-details">
                      <div className="program-card-rating">
                        <span className="program-rating-star">★</span>
                        <span className="program-rating-value">{rating}</span>
                      </div>
                      <div className="program-card-meta">
                        <span className="program-card-level">{level}</span>
                        <span className="program-card-separator">•</span>
                        <span className="program-card-duration">{duration} Weeks</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="view-more-container" onClick={() => navigate('/explore')} style={{ paddingRight: '5%' }}>
          <span>View more</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </section>


      <section className="ad-banner-section">
        <div className="ad-carousel-container" style={{ borderRadius: 0 }}>
          <div
            className="ad-track"
            onTransitionEnd={handleTransitionEnd}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={() => setTouchStart(null)}
            style={{
              transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
              transform: `translateX(-${currentAdIndex * 100}%)`,
              display: 'flex',
              width: '100%'
            }}
          >
            {displayAds.map((ad, index) => {
              const isActive = index === currentAdIndex
              return (
                <div
                  key={`${ad.id}-${index}`}
                  className={`ad-slide ${isActive ? 'active' : ''}`}
                  style={{ flex: '0 0 100%', cursor: 'grab' }}
                >
                  <img
                    src={ad.image}
                    alt={ad.title}
                    draggable="false"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0', pointerEvents: 'none' }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>


      {/* <section className="get-in-touch-section">
        <div className="page-content-wrapper">
          <div className="get-in-touch-card">
            <div className="get-in-touch-content">
              <h2 className="get-in-touch-title">Make an Enquiry</h2>
              <p className="get-in-touch-description">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            <form className="get-in-touch-form" onSubmit={(e) => {
              e.preventDefault()
              console.log('Email submitted:', contactEmail)
              setContactEmail('')
              alert('Thank you for your message! We\'ll get back to you soon.')
            }}>
              <div className="get-in-touch-input-wrapper">
                <input
                  type="email"
                  className="get-in-touch-input"
                  placeholder="Enter your email address"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
                <button type="submit" className="get-in-touch-submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div> */}
      {/* </section> */}



      <section className="light-theme-mentors-section">
        <div className="page-content-wrapper">
          <div className="light-theme-mentors-header">
            <div className="light-theme-mentors-title-row">
              <h2 className="light-theme-mentors-title">Our top mentors</h2>
              <button className="light-theme-mentors-view-all-btn" onClick={() => navigate('/explore')}>
                <span>View all</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <div className="light-theme-mentor-slider">
            <div className="light-theme-mentor-track" ref={mentorTrackRef}>
              {isLoadingMentors ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  Loading mentors...
                </div>
              ) : mentorsToDisplay.length > 0 ? (
                mentorsToDisplay.map((mentor) => (
                  <div
                    className="light-theme-mentor-card"
                    key={mentor.id || mentor.name}
                    onClick={() => navigate(`/mentor/${mentor.id || mentor.name}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="light-theme-mentor-card-image-wrapper">
                      <img src={mentor.image || 'https://via.placeholder.com/400x280?text=Mentor'} alt={mentor.name} className="light-theme-mentor-card-image" />
                    </div>
                    <div className="light-theme-mentor-card-content">
                      <h3 className="light-theme-mentor-card-name">{mentor.name}</h3>
                      <p className="light-theme-mentor-card-role">{mentor.role}</p>
                      <p className="light-theme-mentor-card-description">{mentor.focus || mentor.bio?.substring(0, 100) || 'Experienced mentor'}</p>
                      <div className="light-theme-mentor-card-footer">
                        <span className="light-theme-mentor-card-rating">{renderStarsFunc(mentor.rating || 4.5)}</span>
                        <span className="light-theme-mentor-card-price">${mentor.hourlyRate || '50'}/h</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  No mentors available
                </div>
              )}
            </div>
            {mentorTotalPages > 1 && (
              <div className="light-theme-mentor-dots">
                {Array.from({ length: mentorTotalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`light-theme-mentor-dot ${index === currentMentorPage ? 'active' : ''}`}
                    onClick={() => {
                      const track = mentorTrackRef.current
                      if (!track) return
                      const cardWidth = 350
                      const gap = 24
                      const cardsPerPage = Math.floor(track.clientWidth / (cardWidth + gap)) || 1
                      const scrollLeft = index * (cardWidth + gap) * cardsPerPage
                      track.scrollTo({ left: scrollLeft, behavior: 'smooth' })
                    }}
                    aria-label={`Go to mentor page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>





      <section className="simple-testimonials-section">
        <div className="page-content-wrapper">
          <h2 className="simple-testimonials-title">Students Testimonials</h2>
          <div className="simple-testimonials-grid">
            {(isMobile ? simpleTestimonials : simpleTestimonials.slice((currentSimpleTestimonialPage - 1) * 3, currentSimpleTestimonialPage * 3)).map((testimonial) => (
              <div
                key={testimonial.id}
                className="simple-testimonial-card"
                onClick={() => setSelectedTestimonial(testimonial)}
                style={{ cursor: 'pointer' }}
              >
                <div className="simple-testimonial-content">
                  <h4 className="simple-testimonial-name">{testimonial.name}</h4>
                  <p className="simple-testimonial-role">{testimonial.role} • {testimonial.company}</p>
                  <p className="simple-testimonial-quote">{testimonial.quote}</p>
                </div>
                <img src={testimonial.avatar} alt={testimonial.name} className="simple-testimonial-avatar" />
              </div>
            ))}
          </div>
          {!isMobile && (
            <div className="simple-testimonials-pagination">
              <button
                className="simple-testimonials-prev"
                onClick={() => setCurrentSimpleTestimonialPage(prev => Math.max(1, prev - 1))}
                disabled={currentSimpleTestimonialPage === 1}
                aria-label="Previous page"
              >
                ←
              </button>
              <span className="simple-testimonials-page-indicator">
                {String(currentSimpleTestimonialPage).padStart(2, '0')}/{String(Math.ceil(simpleTestimonials.length / 3)).padStart(2, '0')}
              </span>
              <button
                className="simple-testimonials-next"
                onClick={() => setCurrentSimpleTestimonialPage(prev => Math.min(Math.ceil(simpleTestimonials.length / 3), prev + 1))}
                disabled={currentSimpleTestimonialPage === Math.ceil(simpleTestimonials.length / 3)}
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="get-in-touch-section">
        <div className="page-content-wrapper">
          <div className="get-in-touch-card">
            <div className="get-in-touch-content">
              <h2 className="get-in-touch-title">Make an Enquiry</h2>
              <p className="get-in-touch-description">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            <form className="get-in-touch-form" onSubmit={(e) => {
              e.preventDefault()
              console.log('Email submitted:', contactEmail)
              setContactEmail('')
              alert('Thank you for your message! We\'ll get back to you soon.')
            }}>
              <div className="get-in-touch-input-wrapper">
                <input
                  type="email"
                  className="get-in-touch-input"
                  placeholder="Enter your email address"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
                <button type="submit" className="get-in-touch-submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div >
  )
}
