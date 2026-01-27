import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import techBgJson from '../../assets/lottie/Technology backgrounds.json'
import bannerJson from '../../assets/lottie/landingapgae-robot.json'
import StudentAppBar from '../../components/shared/StudentAppBar.jsx'
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
// Smart Careers for 2027 Data
const latestSkills = [
  {
    id: 'smart-1',
    name: 'AI & Machine Learning Specialist',
    image: topprogram1,
    category: 'Future Tech',
    description: 'Master the algorithms and models driving the 2027 industrial revolution.',
    rating: 4.9,
    level: 'Advanced',
    duration: 16
  },
  {
    id: 'smart-2',
    name: 'Generative AI & Prompt Engineering',
    image: topprogram2,
    category: 'AI Strategy',
    description: 'Transform industries by mastering the art of AI communication and workflow automation.',
    rating: 4.8,
    level: 'Intermediate',
    duration: 12
  },
  {
    id: 'smart-3',
    name: 'Cybersecurity & Data Sovereignty',
    image: topprogram3,
    category: 'Digital Security',
    description: 'Protect the future of digital assets and personal privacy in a hyper-connected world.',
    rating: 4.9,
    level: 'All Levels',
    duration: 14
  },
  {
    id: 'smart-4',
    name: 'Full Stack Cloud Architecture',
    image: topprogram4,
    category: 'Cloud Dev',
    description: 'Build scalable, resilient systems using Next.js, Go, and modern cloud infrastructures.',
    rating: 4.7,
    level: 'Professional',
    duration: 18
  },
  {
    id: 'smart-5',
    name: 'AR/VR Experience Designer',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80',
    category: 'Immersive Tech',
    description: 'Design the next generation of spatial computing interfaces and virtual worlds.',
    rating: 4.8,
    level: 'Intermediate',
    duration: 14
  },
  {
    id: 'smart-6',
    name: 'Blockchain Infrastructure Engineer',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    category: 'Web3',
    description: 'Engineer decentralized systems and smart contracts for the trustless economy.',
    rating: 4.7,
    level: 'Advanced',
    duration: 15
  },
  {
    id: 'smart-7',
    name: 'Quantum Computing Explorer',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    category: 'Deep Tech',
    description: 'Harness the power of cubits to solve problems beyond the reach of classical computers.',
    rating: 4.9,
    level: 'Expert',
    duration: 24
  },
  {
    id: 'smart-8',
    name: 'Sustainable Tech Architect',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    category: 'Green Tech',
    description: 'Design carbon-neutral digital solutions and eco-friendly hardware systems.',
    rating: 4.6,
    level: 'Intermediate',
    duration: 12
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

// Scroll-based Typewriter component
const TypewriterText = ({ text }) => {
  const [index, setIndex] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false
            return
          }

          const rect = containerRef.current.getBoundingClientRect()
          const windowHeight = window.innerHeight

          // Calculate progress: 0 when bottom enters, 1 when it's through the middle
          const startTrigger = windowHeight * 0.9
          const endTrigger = windowHeight * 0.3

          let progress = (startTrigger - rect.top) / (startTrigger - endTrigger)
          progress = Math.max(0, Math.min(1, progress))

          const newIndex = Math.floor(progress * text.length)
          setIndex(newIndex)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [text])

  return (
    <span ref={containerRef} className="typewriter-font">
      <span className="typed-text">{text.substring(0, index)}</span>
      {index < text.length && <span className="typewriter-cursor">|</span>}
      <span className="untyped-text">{text.substring(index)}</span>
    </span>
  )
}

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

  const scrollSkills = (dir) => {
    const el = skillsTrackRef.current
    if (!el) return
    const distance = el.clientWidth * 0.8
    el.scrollBy({ left: dir === 'next' ? distance : -distance, behavior: 'smooth' })
  }

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

  const [revealProgress, setRevealProgress] = useState(0)
  const revealContainerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!revealContainerRef.current) return

      const rect = revealContainerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate progress based on how much of the wrapper is scrolled through
      // 0: bottom of wrapper is at bottom of viewport
      // 1: top of wrapper reached top of viewport
      const totalHeight = rect.height
      const scrolled = windowHeight - rect.top

      let progress = scrolled / totalHeight
      progress = Math.max(0, Math.min(1, progress))
      setRevealProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="landing-page-new">
      {/* {showNavbar && (
        <StudentAppBar
          onLogout={handleLogout}
          hideProfile={true}
          hideLogout={!isLoggedIn}
        />
      )} */}

      <section className="elegant-hero">
        <div className="hero-lottie-bg">
          <Lottie animationData={techBgJson} loop={true} />
        </div>
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
          </div>
        </div>
      </section>

      <section className="problem-solution-section landing-section">
        <div className="page-content-wrapper problem-solution-grid">
          <div className="problem-column">
            <div className="hero-lottie-banner">
              <Lottie animationData={bannerJson} loop={true} />
            </div>
          </div>

          <div className="solution-column">
            <h3 className="mentorship-card-title">Why Mentorship Matters Today</h3>
            <div style={{ maxWidth: '650px' }}>
              <TypewriterText text="In a world full of noise, endless courses, and confusing advice, mentorship gives you clarity. It saves you from wasting years figuring things out alone, helps you focus on the right skills, and gives you the confidence of knowing someone who’s already succeeded is guiding your next move — so your career doesn’t grow by chance, but by choice." />
            </div>
          </div>
        </div>
      </section>

      <section className="elegant-programs-section landing-section">
        <div className="page-content-wrapper">
          <div className="landing-section-header">
            <div className="landing-section-header-text">
              <span className="landing-section-subtitle">Future Trends</span>
              <h2 className="landing-section-title">Smart careers for 2027</h2>
            </div>
            <div className="view-more-container desktop-only" onClick={() => navigate('/explore')}>
              <span>View more</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          <div className="landing-carousel-container">
            <div className="carousel-controls desktop-only">
              <button className="carousel-nav prev" onClick={() => scrollSkills('prev')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="carousel-nav next" onClick={() => scrollSkills('next')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <div
              className="classroom-carousel"
              ref={skillsTrackRef}
            >
              {latestSkills.map((skill) => {
                const courseData = courses.find(c => c.id === skill.id || c.name === skill.name)
                const rating = skill.rating || courseData?.rating || 4.5
                const level = skill.level || courseData?.level || 'Intermediate'
                const duration = skill.duration || courseData?.duration || 12

                return (
                  <div
                    className="landing-program-card"
                    key={skill.id || skill.name}
                  >
                    <div className="program-card-image-wrapper">
                      <img src={skill.image} alt={skill.name} className="program-card-image" />
                    </div>

                    {/* <div className="program-card-content"> */}
                    <div className="program-card-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(rating) ? "star-filled" : "star-empty"}>★</span>
                      ))}
                    </div>

                    <h3 className="program-card-title">{skill.name}</h3>
                    <p className="program-card-subtitle">{skill.description}</p>

                    <div className="program-card-tags">
                      <span className="program-tag">{level}</span>
                      <span className="program-tag">{duration} weeks</span>
                    </div>
                    {/* </div> */}
                  </div>
                )
              })}
            </div>

            <div className="carousel-dots">
              {[...Array(skillsTotalPages)].map((_, i) => (
                <div
                  key={i}
                  className={`dot ${currentSkillsPage === i ? 'active' : ''}`}
                  onClick={() => {
                    const track = skillsTrackRef.current;
                    if (track) {
                      const scrollAmount = track.clientWidth * i;
                      track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <div className="view-more-container mobile-only" onClick={() => navigate('/explore')}>
            <span>View more</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </section>

      <div className="job-portal-reveal-wrapper" ref={revealContainerRef}>
        <section
          className="job-portal-section landing-section sticky-reveal-section"
          style={{
            transform: `translateY(${100 - (revealProgress * 100)}%)`,
            opacity: Math.min(1, revealProgress * 1.5)
          }}
        >
          <div className="page-content-wrapper">
            <div className="job-portal-banner">
              <div className="job-portal-content">
                <h2>Start applying to real opportunities</h2>
                <p>Connect with top recruiters and find your dream internship or first job. Your future starts here.</p>
                <div className="job-portal-actions">
                  <button className="btn-primary" style={{ padding: '16px 32px' }} onClick={() => navigate('/jobs')}>Explore Jobs</button>
                </div>
              </div>
              <div className="job-portal-visual desktop-only">
                <div style={{
                  width: '320px',
                  height: '220px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '32px',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
                }}>
                  <FolderIcon size={80} color="rgba(255,255,255,0.3)" />
                  <div style={{ marginTop: '20px', width: '60%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                  <div style={{ marginTop: '10px', width: '40%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>


      <section className="how-it-works-section landing-section">
        <div className="page-content-wrapper">
          <div className="landing-section-center-header">
            <span className="landing-section-subtitle">Process</span>
            <h2 className="landing-section-title">Kickstart your career in 3 simple steps</h2>
          </div>

          <div className="how-it-works-grid">
            <div className="how-it-works-step accent-blue">
              <div className="step-number-circle">1</div>
              <h3>Sign up & explore</h3>
              <p>Create your account and discover hundreds of practical courses tailored to industry needs.</p>
            </div>

            <div className="how-it-works-step accent-purple">
              <div className="step-number-circle">2</div>
              <h3>Connect with mentors</h3>
              <p>Get personalized guidance from experienced professionals at top tech companies.</p>
            </div>

            <div className="how-it-works-step accent-green">
              <div className="step-number-circle">3</div>
              <h3>Apply & Grow</h3>
              <p>Apply for real job opportunities and track your growth with our assessment tools.</p>
            </div>
          </div>
        </div>
      </section>



      <section className="why-choose-section landing-section">
        <div className="page-content-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="landing-section-subtitle">Values</span>
            <h2 className="landing-section-title" style={{ textAlign: 'center' }}>Why Choose Internify</h2>
          </div>

          <div className="why-choose-cards">
            <div className="why-choose-card">
              <div className="why-choose-icon">
                <CertificateIcon size={24} />
              </div>
              <div className="why-choose-text">
                <h3>Industry-experienced mentors</h3>
                <p>Learn from those who have already succeeded in the roles you dream of.</p>
              </div>
            </div>

            <div className="why-choose-card">
              <div className="why-choose-icon">
                <ProgrammingIcon size={24} />
              </div>
              <div className="why-choose-text">
                <h3>Practical courses</h3>
                <p>Project-based learning that gives you real experience, not just theory.</p>
              </div>
            </div>

            <div className="why-choose-card">
              <div className="why-choose-icon">
                <CalendarIcon size={24} />
              </div>
              <div className="why-choose-text">
                <h3>Career guidance</h3>
                <p>From resume building to interview prep, we support you at every stage.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="workshops-section landing-section">
        <div className="page-content-wrapper">
          <div className="workshops-card">
            <div className="workshops-info">
              <span className="landing-section-subtitle" style={{ marginBottom: '12px' }}>Community</span>
              <h2>Attend Workshops & Career Talks</h2>
              <p>Join live sessions with industry leaders and accelerate your career path with expert insights.</p>
              <button className="btn-primary" style={{ padding: '16px 32px' }} onClick={() => navigate('/events')}>See Upcoming Events</button>
            </div>
            <div className="workshops-illustration">
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ width: '140px', height: '140px', background: '#f0f9ff', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(12, 165, 233, 0.1)' }}>
                  <DesignIcon size={48} color="#0ca5e9" />
                </div>
                <div style={{ width: '140px', height: '140px', background: '#fff1f2', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '40px', boxShadow: '0 10px 20px rgba(244, 63, 94, 0.1)' }}>
                  <AIIcon size={48} color="#f43f5e" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="light-theme-mentors-section landing-section">
        <div className="page-content-wrapper">
          <span className="landing-section-subtitle">Expert Guidance</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <h2 className="landing-section-title" style={{ marginBottom: 0 }}>Our top mentors</h2>
            <button className="light-theme-mentors-view-all-btn" onClick={() => navigate('/explore')}>
              <span>View all</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
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

      <section className="simple-testimonials-section landing-section">
        <div className="page-content-wrapper">
          <span className="landing-section-subtitle">Success Stories</span>
          <h2 className="landing-section-title">Students Testimonials</h2>
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

      <section className="get-in-touch-section landing-section">
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
