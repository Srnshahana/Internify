import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mentors, courses } from '../Data.jsx'
import { ProgrammingIcon, DesignIcon, AIIcon, BusinessIcon, DataIcon, MarketingIcon, CloudIcon, SecurityIcon, WritingIcon } from '../components/Icons.jsx'
import backgroundImage from '../assets/background.png'
import heroSectionImage from '../assets/herosection.jpg'
import supabase from '../supabaseClient'
import '../App.css'

// Map courses to skills format
const latestSkills = courses.slice(0, 8).map((course) => ({
  id: course.id,
  name: course.name,
  image: course.image,
  category: course.category,
  description: course.description,
}))

const howItWorksSteps = [
  {
    number: 1,
    title: 'Explore',
    description: 'Browse our curated selection of mentors and courses tailored to your career goals.',
  },
  {
    number: 2,
    title: 'Connect',
    description: 'Book a free introductory session with your chosen mentor to discuss your learning path.',
  },
  {
    number: 3,
    title: 'Schedule',
    description: 'Set up weekly mentoring sessions that fit your schedule and learning pace.',
  },
  {
    number: 4,
    title: 'Learn',
    description: 'Work on real-world projects with personalized guidance and feedback from your mentor.',
  },
  {
    number: 5,
    title: 'Advance',
    description: 'Build job-ready skills and advance your career with ongoing mentor support.',
  },
]

const careerGuidanceTestimonials = [
  {
    id: 1,
    mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    mentorName: 'Sarah Chen',
    mentorRole: 'Career Advisor',
    quote: 'My career guidance sessions helped me transition from a non-tech background to landing my dream job at Google. The personalized guidance and real-world projects made all the difference.',
    studentName: 'Alex Johnson',
    studentRating: 5,
    bgColor: 'blue'
  },
  {
    id: 2,
    mentorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    mentorName: 'Michael Rodriguez',
    mentorRole: 'Life Advisor',
    quote: 'The career guidance program exceeded my expectations. I built a portfolio that got me multiple job offers within 3 months of completing the program.',
    studentName: 'Emma Williams',
    studentRating: 5,
    bgColor: 'blue'
  },
  {
    id: 3,
    mentorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    mentorName: 'David Kim',
    mentorRole: 'Career Coach',
    quote: 'I was stuck in my career, but my advisor provided clarity and direction. Now I\'m working on exciting ML projects and loving every moment.',
    studentName: 'James Brown',
    studentRating: 5,
    bgColor: 'blue'
  },
  {
    id: 4,
    mentorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    mentorName: 'Priya Patel',
    mentorRole: 'Career Strategist',
    quote: 'The weekly sessions kept me accountable and motivated. My advisor\'s feedback on my career path was invaluable in improving my approach.',
    studentName: 'Sophia Martinez',
    studentRating: 5,
    bgColor: 'blue'
  },
  {
    id: 5,
    mentorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    mentorName: 'Robert Taylor',
    mentorRole: 'Life Coach',
    quote: 'I learned more in 3 months with my advisor than I did in a year of self-study. The hands-on approach and industry insights were game-changing.',
    studentName: 'Daniel Lee',
    studentRating: 5,
    bgColor: 'blue'
  },
  {
    id: 6,
    mentorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    mentorName: 'Lisa Anderson',
    mentorRole: 'Career Mentor',
    quote: 'My advisor helped me build a portfolio that showcased my skills perfectly. I landed my first design role at a top tech company thanks to their guidance.',
    studentName: 'Olivia Davis',
    studentRating: 5,
    bgColor: 'blue'
  },
]

const studentTestimonials = [
  {
    id: 1,
    type: 'featured',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    title: 'How Students Land Their Dream Jobs Through Mentorship',
    description: 'Discover how personalized mentorship helps students transition from learning to landing roles at top tech companies.',
    category: 'Success Stories'
  },
  {
    id: 2,
    type: 'story',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    name: 'Emma Williams',
    role: 'Software Engineer at Microsoft',
    title: 'From Self-Taught to Software Engineer',
    description: 'Emma shares her journey from learning to code independently to landing her dream role with mentor guidance.',
    category: 'Student Journey'
  },
  {
    id: 3,
    type: 'insight',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=500&fit=crop',
    title: 'Building a Portfolio That Gets You Hired',
    description: 'Learn the key strategies for creating a portfolio that stands out to employers and showcases your real-world skills.',
    category: 'Career Tips'
  },
]

const simpleTestimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Software Engineer',
    company: 'Google',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    quote: 'Internify helped me transition from a non-tech background to landing my dream job at Google. The personalized mentorship was exactly what I needed.'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Product Designer',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    quote: 'The career guidance program exceeded my expectations. I built a portfolio that got me multiple job offers within 3 months of completing the program.'
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    role: 'Data Scientist',
    company: 'Amazon',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    quote: 'I was stuck in my career, but my advisor provided clarity and direction. Now I\'m working on exciting ML projects and loving every moment.'
  },
  {
    id: 4,
    name: 'Emma Williams',
    role: 'Full Stack Developer',
    company: 'Netflix',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    quote: 'The weekly sessions kept me accountable and motivated. My mentor\'s feedback was invaluable in improving my approach and landing my role.'
  },
  {
    id: 5,
    name: 'James Brown',
    role: 'DevOps Engineer',
    company: 'Meta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    quote: 'I learned more in 3 months with my mentor than I did in a year of self-study. The hands-on approach and industry insights were game-changing.'
  },
  {
    id: 6,
    name: 'Sophia Martinez',
    role: 'UX Designer',
    company: 'Apple',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    quote: 'My mentor helped me build a portfolio that showcased my skills perfectly. I landed my first design role at a top tech company thanks to their guidance.'
  },
  {
    id: 7,
    name: 'Daniel Lee',
    role: 'Cloud Architect',
    company: 'AWS',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    quote: 'The structured learning path and real-world projects made all the difference. I now have the confidence and skills to tackle complex cloud challenges.'
  },
  {
    id: 8,
    name: 'Olivia Davis',
    role: 'Security Engineer',
    company: 'Cisco',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop',
    quote: 'Internify gave me the mentorship I needed to break into cybersecurity. My mentor\'s industry expertise was instrumental in my success.'
  },
  {
    id: 9,
    name: 'David Kim',
    role: 'Machine Learning Engineer',
    company: 'Tesla',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    quote: 'The personalized mentorship helped me understand ML concepts deeply. I\'m now working on autonomous vehicle systems at Tesla.'
  },
  {
    id: 10,
    name: 'Priya Patel',
    role: 'Mobile Developer',
    company: 'Uber',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    quote: 'Switching careers seemed daunting, but my mentor made the transition smooth. I\'m now building mobile apps that millions of people use daily.'
  },
  {
    id: 11,
    name: 'Robert Taylor',
    role: 'Frontend Engineer',
    company: 'Shopify',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
    quote: 'The project-based learning approach was exactly what I needed. I built real applications during my mentorship that became part of my portfolio.'
  },
  {
    id: 12,
    name: 'Lisa Anderson',
    role: 'Backend Developer',
    company: 'Stripe',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop',
    quote: 'My mentor helped me understand backend systems architecture. I now work on payment infrastructure that processes billions of dollars.'
  },
  {
    id: 13,
    name: 'Chris Wilson',
    role: 'AI Researcher',
    company: 'OpenAI',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    quote: 'The mentorship program gave me the foundation I needed to pursue AI research. I\'m now working on cutting-edge language models.'
  },
  {
    id: 14,
    name: 'Maria Garcia',
    role: 'Systems Engineer',
    company: 'IBM',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
    quote: 'I gained both technical skills and confidence through Internify. My mentor\'s guidance helped me excel in systems engineering interviews.'
  },
  {
    id: 15,
    name: 'Kevin Zhang',
    role: 'Platform Engineer',
    company: 'Salesforce',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    quote: 'The mentorship experience was transformative. I learned platform engineering best practices and landed a role at a top SaaS company.'
  },
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
  renderStars
}) {
  const navigate = useNavigate()
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
  const howItWorksSectionRef = useRef(null)
  const careerGuidanceRightRef = useRef(null)
  const careerGuidanceTrackRef = useRef(null)

  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoadingMentors(true)
        const { data: mentorsFromApi, error: mentorsError } = await supabase
          .from('mentors_details')
          .select('*')
          .limit(5)

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
    <div className="page light-theme-landing-page">
      <div
        className="light-theme-hero-section"
        ref={heroSectionRef}
      >
        <div className="vertical-slices-container">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="vertical-slice"
              style={{ '--i': i }}
            >
              <div
                className="vertical-slice-bg"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.6) 100%), url(${heroSectionImage})`
                }}
              />
            </div>
          ))}
        </div>
        <div className="light-theme-topbar">
          <div className="brand">
            <span>Internify.</span>
          </div>
          <div className="top-actions">
            <button className="link" onClick={() => navigate('/login')}>Login</button>
            <button className="pill">Apply as mentor</button>
          </div>
        </div>

        <header className="light-theme-hero">
          <div className="light-theme-hero-content">
            <h1 className="light-theme-hero-title">Find your mentor</h1>
            <p className="light-theme-hero-description">
              Internify: connect with industry mentors for your career journey and skill development.
            </p>
            <div className="light-theme-hero-search-container">
              <div className="light-theme-hero-search-box">
                <div className="search-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 2H16V18H4V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 6L12 10L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder='Try "Video Production"'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch()
                  }}
                  className="light-theme-hero-search-input"
                />
                <button className="light-theme-hero-search-btn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
            <div className="light-theme-category-scroll-container">
              <div className="light-theme-category-scroll" ref={categoryScrollRef}>
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <button
                      key={category.id}
                      className="light-theme-category-tag"
                      onClick={() => handleNavSearch(category.searchTerm)}
                    >
                      <div className="light-theme-category-icon">
                        <IconComponent className="light-theme-category-icon-svg" />
                      </div>
                      <div className="light-theme-category-name">{category.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </header>
      </div>

      <section className="light-theme-coaching-solutions-section">
        <div className="light-theme-coaching-solutions-container">
          <div className="light-theme-coaching-solutions-content">
            <p className="light-theme-coaching-solutions-eyebrow">FROM LEARNING TO CAREER SUCCESS</p>
            <h2 className="light-theme-coaching-solutions-title">From Confusion to Career Clarity — And Your First Job</h2>
            <p className="light-theme-coaching-solutions-description">
              You don’t need more courses — you need the right guidance.
              Internify connects freshers with mentors who’ve been there before. Get clarity, build the right skills, work on real direction, and move step-by-step toward your first job with confidence.
            </p>
            <ul className="light-theme-coaching-solutions-list">
              <li className="light-theme-coaching-solutions-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <strong>Freshers & Students:</strong>  Personal mentorship to choose the right path and prepare for jobs.
                </div>
              </li>
              <li className="light-theme-coaching-solutions-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <strong>	Job Seekers:</strong> Real-world guidance, not generic advice.
                </div>
              </li>
              <li className="light-theme-coaching-solutions-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <strong>Mentors:</strong>  Help someone take their first real step into a career.
                </div>
              </li>
              <li className="light-theme-coaching-solutions-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <strong>Teams & Organizations:</strong> Hire freshers with real-world skills, guided by industry mentors.
                </div>
              </li>
            </ul>
            <button className="light-theme-coaching-solutions-cta" onClick={() => navigate('/explore')}>
              Explore Our Mentorship Options
            </button>
          </div>
          <div className="light-theme-coaching-solutions-image-wrapper">
            <img src={backgroundImage} alt="Mentorship" className="light-theme-coaching-solutions-image" />
            <div className="light-theme-coaching-solutions-stats">
              <div className="light-theme-coaching-stat-box light-theme-stat-box-primary">
                <p className="light-theme-coaching-stat-label">Active Mentors</p>
                <p className="light-theme-coaching-stat-value">1,245+</p>
              </div>
              <div className="light-theme-coaching-stat-box light-theme-stat-box-secondary">
                <p className="light-theme-coaching-stat-label">Mentorship Categories</p>
                <p className="light-theme-coaching-stat-value">50+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="light-theme-top-rated-programs-section">
        <div className="page-content-wrapper">
          <div className="top-rated-programs-header">
            <div className="top-rated-programs-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>TOP-RATED PROGRAMS</span>
            </div>
            <div className="top-rated-programs-title-row">
              <h2 className="top-rated-programs-title">Master the skills that matter most</h2>
              <button className="top-rated-programs-browse-btn" onClick={() => navigate('/explore')}>
                Browse Programs
              </button>
            </div>
          </div>
          <div className="programs-slider">
            <div className="programs-track" ref={skillsTrackRef}>
              {latestSkills.map((skill) => {
                const courseData = courses.find(c => c.id === skill.id || c.name === skill.name)
                const rating = courseData?.rating || 4.5
                const level = courseData?.level || 'Intermediate'
                const duration = courseData?.duration || 12
                const durationHours = duration * 5

                return (
                  <div
                    className="program-card"
                    key={skill.id || skill.name}
                    onClick={() => handleNavSearch(`course:${skill.id || skill.name}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="program-card-image-wrapper">
                      <img src={skill.image} alt={skill.name} className="program-card-image" />
                      <div className="program-card-gradient-overlay"></div>
                      <div className="program-card-content">
                        <h3 className="program-card-title">{skill.name}</h3>
                        <div className="program-card-details">
                          {rating && (
                            <div className="program-card-rating">
                              <span className="program-rating-star">★</span>
                              <span className="program-rating-value">{rating}</span>
                            </div>
                          )}
                          <div className="program-card-meta">
                            <span className="program-card-level">{level}</span>
                            <span className="program-card-separator">•</span>
                            <span className="program-card-duration">{durationHours}h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="programs-dots">
              {Array.from({ length: skillsTotalPages }, (_, index) => (
                <button
                  key={index}
                  className={`program-dot ${currentSkillsPage === index ? 'active' : ''}`}
                  onClick={() => {
                    const track = skillsTrackRef.current
                    if (!track) return
                    const cardWidth = 352
                    const gap = 24
                    const cardsPerPage = Math.floor(track.clientWidth / (cardWidth + gap)) || 1
                    const scrollLeft = index * (cardWidth + gap) * cardsPerPage
                    track.scrollTo({ left: scrollLeft, behavior: 'smooth' })
                  }}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={howItWorksSectionRef} className="light-theme-how-it-works">
        <div className="light-theme-how-it-works-header">
          <h2 className="light-theme-how-it-works-title">How It Works</h2>
        </div>
        <div className="light-theme-how-it-works-steps">
          {howItWorksSteps.map((step) => (
            <div className="light-theme-how-it-works-step" key={step.number}>
              <div className="light-theme-step-number-circle">
                <span className="light-theme-step-number">{step.number}</span>
              </div>
              <h3 className="light-theme-step-title">{step.title}</h3>
              <div className="light-theme-step-underline"></div>
              <p className="light-theme-step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="light-theme-mentors-section">
        <div className="page-content-wrapper">
          <div className="light-theme-mentors-header">
            <div className="light-theme-mentors-title-row">
              <h2 className="light-theme-mentors-title">Our top mentors</h2>
              <button className="light-theme-mentors-view-all-btn" onClick={() => navigate('/explore')}>
                View all
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

      {/* CTA Card Section */}
      <section className="light-theme-cta-card-section">
        <div className="page-content-wrapper">
          <div className="light-theme-cta-card">
            <div className="light-theme-cta-card-content">
              <h2 className="light-theme-cta-card-title">Ready to Get Started?</h2>
              <p className="light-theme-cta-card-description">
                Request a demo to see how our platform works, or find the perfect mentor for your career goals.
              </p>
              <div className="light-theme-cta-card-buttons">
                <button
                  className="light-theme-cta-btn light-theme-cta-btn-primary"
                  onClick={() => {
                    // Handle demo request - you can add a modal or navigate to a demo page
                    alert('Demo request feature coming soon!')
                  }}
                >
                  Request a Demo
                </button>
                <button
                  className="light-theme-cta-btn light-theme-cta-btn-secondary"
                  onClick={() => navigate('/explore')}
                >
                  Find a Mentor
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="light-theme-student-testimonials-section">
        <div className="page-content-wrapper">
          <div className="light-theme-student-testimonials-grid">
            <div className="light-theme-student-testimonial-featured">
              <div className="light-theme-student-testimonial-image-wrapper">
                <img
                  src={studentTestimonials[0].image}
                  alt={studentTestimonials[0].title}
                  className="light-theme-student-testimonial-featured-image"
                />
                <div className="light-theme-student-testimonial-overlay">
                  <span className="light-theme-student-testimonial-category">{studentTestimonials[0].category}</span>
                  <h3 className="light-theme-student-testimonial-featured-title">{studentTestimonials[0].title}</h3>
                  <p className="light-theme-student-testimonial-featured-description">{studentTestimonials[0].description}</p>
                </div>
              </div>
            </div>
            <div className="light-theme-student-testimonials-right">
              {studentTestimonials.slice(1).map((testimonial) => (
                <div key={testimonial.id} className="light-theme-student-testimonial-card">
                  <div className="light-theme-student-testimonial-card-image-wrapper">
                    <img
                      src={testimonial.image}
                      alt={testimonial.title}
                      className="light-theme-student-testimonial-card-image"
                    />
                    <div className="light-theme-student-testimonial-card-overlay">
                      <span className="light-theme-student-testimonial-card-category">{testimonial.category}</span>
                      {testimonial.name && (
                        <div className="light-theme-student-testimonial-card-header">
                          <h4 className="light-theme-student-testimonial-card-name">{testimonial.name}</h4>
                          <p className="light-theme-student-testimonial-card-role">{testimonial.role}</p>
                        </div>
                      )}
                      <h3 className="light-theme-student-testimonial-card-title">{testimonial.title}</h3>
                      <p className="light-theme-student-testimonial-card-description">{testimonial.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="page-content-wrapper">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">425k+</div>
              <div className="stat-label">MEMBERS</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">30k+</div>
              <div className="stat-label">CLASSES</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">9k+</div>
              <div className="stat-label">TEACHERS</div>
            </div>
            <div className="stat-card">
              <div className="stat-rating">
                <span className="stat-number">4.8</span>
                <div className="stat-stars">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="stat-label">APP STORE RATING</div>
            </div>
          </div>
        </div>
      </section>

      <section className="simple-testimonials-section">
        <div className="page-content-wrapper">
          <h2 className="simple-testimonials-title">Students Testimonials</h2>
          <div className="simple-testimonials-grid">
            {simpleTestimonials.slice((currentSimpleTestimonialPage - 1) * 3, currentSimpleTestimonialPage * 3).map((testimonial) => (
              <div key={testimonial.id} className="simple-testimonial-card">
                <img src={testimonial.avatar} alt={testimonial.name} className="simple-testimonial-avatar" />
                <div className="simple-testimonial-content">
                  <h4 className="simple-testimonial-name">{testimonial.name}</h4>
                  <p className="simple-testimonial-role">{testimonial.role} • {testimonial.company}</p>
                  <p className="simple-testimonial-quote">{testimonial.quote}</p>
                </div>
              </div>
            ))}
          </div>
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
        </div>
      </section>

      <section className="get-in-touch-section">
        <div className="page-content-wrapper">
          <div className="get-in-touch-container">
            <h2 className="get-in-touch-title">Get In Touch</h2>
            <p className="get-in-touch-description">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
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
                  placeholder="Email"
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

      <footer className="footer-rich">
        <div className="page-content-wrapper">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand">
                <span>Internify.</span>
              </div>
              <p className="footer-tagline">Your trusted source to find highly-vetted mentors & industry professionals to move your career ahead.</p>
              <a href="#" className="footer-contact-link">Contact</a>
              <div className="footer-social">
                <a href="#" className="social-icon" aria-label="Facebook">FB</a>
                <a href="#" className="social-icon" aria-label="Instagram">IG</a>
                <a href="#" className="social-icon" aria-label="Twitter">TW</a>
                <a href="#" className="social-icon" aria-label="LinkedIn">IN</a>
                <a href="#" className="social-icon" aria-label="YouTube">YT</a>
              </div>
            </div>
            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/explore') }}>Browse Mentors</a>
              <a href="#">Book a Session</a>
              <a href="#">Become a Mentor</a>
              <a href="#">Mentorship for Teams</a>
              <a href="#">Testimonials</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/resources') }}>Free Study Materials</a>
              <a href="#">Newsletter</a>
              <a href="#">Books</a>
              <a href="#">Perks</a>
              <a href="#">Templates</a>
              <a href="#">Career Paths</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">Case Studies</a>
              <a href="#">Partner Program</a>
              <a href="#">Code of Conduct</a>
              <a href="#">Privacy Policy</a>
              <a href="#">DMCA</a>
            </div>
            <div className="footer-column">
              <h4>Explore</h4>
              <a href="#">Companies</a>
              <a href="#">Fractional Executives</a>
              <a href="#">Services & Training</a>
              <a href="#">Part-Time Experts</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">FAQ</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
