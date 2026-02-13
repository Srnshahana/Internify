import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import techBgJson from '../../assets/lottie/Technology backgrounds.json'
import bannerJson from '../../assets/lottie/landingapgae-robot.json'
import StudentAppBar from '../../components/shared/StudentAppBar.jsx'
import { mentors, courses } from '../../data/staticData.js'
import { ProgrammingIcon, DesignIcon, AIIcon, BusinessIcon, DataIcon, MarketingIcon, CloudIcon, SecurityIcon, WritingIcon, ExploreIcon, CalendarIcon, ClassroomIcon, ProfileIcon, FolderIcon, CertificateIcon, BoltIcon, TargetIcon, FinanceIcon, ProductIcon, MobileIcon, WebIcon, DevOpsIcon } from '../../components/Icons.jsx'
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
import topmentor from '../../assets/images/topmentor.mp4'
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
    bgColor: 'sky'
  },
  {
    id: 2,
    mentorImage: testimonial2,
    mentorName: 'David Chen',
    mentorRole: 'Backend Lead @ Amazon',
    quote: 'The career guidance program exceeded my expectations. I built a portfolio that got me multiple job offers within 3 months of completing the program.',
    studentName: 'Emma Williams',
    studentRating: 5,
    bgColor: 'sky'
  },
  {
    id: 3,
    mentorImage: testimonial3,
    mentorName: 'Emily Davis',
    mentorRole: 'Product Manager @ Netflix',
    quote: 'I was stuck in my career, but my advisor provided clarity and direction. Now I\'m working on exciting ML projects and loving every moment.',
    studentName: 'James Brown',
    studentRating: 5,
    bgColor: 'sky'
  },
  {
    id: 4,
    mentorImage: testimonial4,
    mentorName: 'Jessica Martinez',
    mentorRole: 'Marketing Strategist @ Spotify',
    quote: 'The weekly sessions kept me accountable and motivated. My advisor\'s feedback on my career path was invaluable in improving my approach.',
    studentName: 'Sophia Martinez',
    studentRating: 5,
    bgColor: 'sky'
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

// Hardcoded Premium Mentors
const apiMentors = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Senior Product Designer',
    company: 'Meta',
    experience: '12 years exp',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
    rating: 4.9,
    reviews: 124
  },
  {
    id: 2,
    name: 'James Wilson',
    role: 'Full Stack Engineer',
    company: 'Instagram',
    experience: '8 years exp',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop',
    rating: 4.8,
    reviews: 89
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Data Scientist',
    company: 'Google',
    experience: '10 years exp',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop',
    rating: 4.9,
    reviews: 156
  },
  {
    id: 4,
    name: 'Michael Ross',
    role: 'Backend lead',
    company: 'Spotify',
    experience: '15 years exp',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop',
    rating: 5.0,
    reviews: 210
  },
  {
    id: 5,
    name: 'Emily Zhang',
    role: 'Product Manager',
    company: 'Airbnb',
    experience: '9 years exp',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=2574&auto=format&fit=crop',
    rating: 4.7,
    reviews: 95
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'ML Engineer',
    company: 'Tesla',
    experience: '7 years exp',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop',
    rating: 4.8,
    reviews: 112
  },
  {
    id: 7,
    name: 'Sofia Rodriguez',
    role: 'iOS Developer',
    company: 'Apple',
    experience: '6 years exp',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop',
    rating: 4.9,
    reviews: 78
  },
  {
    id: 8,
    name: 'Marcus Thorne',
    role: 'Security Architect',
    company: 'Cloudflare',
    experience: '11 years exp',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop',
    rating: 5.0,
    reviews: 145
  },
]

const topCourses = [
  {
    id: 1,
    title: 'UX Strategy Masterclass',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
    rating: 4.9,
    reviews: '1.2k',
    price: '$49.00',
    type: 'featured'
  },
  {
    id: 2,
    title: 'Creative Coding',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop',
    rating: 4.8,
    reviews: '850',
    price: '$35.00',
    type: 'small'
  },
  {
    id: 3,
    title: 'Motion Design',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2574&auto=format&fit=crop',
    rating: 4.7,
    reviews: '620',
    price: '$42.00',
    type: 'small'
  }
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
  /* State for dynamic data */
  /* State for dynamic data */
  const [topCourses, setTopCourses] = useState(courses)
  const [topMentors, setTopMentors] = useState(mentors)

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)

    const fetchMentors = async () => {
      try {
        const { data, error } = await supabase
          .from('mentors_details')
          .select('*')
          .limit(5)

        if (error) {
          console.error('Error fetching mentors:', error)
          return
        }

        if (data && data.length > 0) {
          const formattedMentors = data.map(m => ({
            id: m.mentor_id || m.id,
            name: m.name || m.full_name || 'Mentor',
            role: m.role || 'Senior Mentor',
            company: m.company || 'Tech Giant',
            image: m.profile_image || m.image || 'https://via.placeholder.com/150',
            rating: m.rating || m.avg_rating || 5.0,
            reviews: m.reviews_count || (m.testimonial ? m.testimonial.length : 24)
          }))
          setTopMentors(formattedMentors)
        }
      } catch (err) {
        console.error('Unexpected error fetching mentors:', err)
      }
    }

    fetchMentors()

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
  const [trackSet, setTrackSet] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackSet(prev => (prev === 0 ? 1 : 0))
    }, 6000)
    return () => clearInterval(interval)
  }, [])
  const [currentSkillsPage, setCurrentSkillsPage] = useState(0)
  const [skillsTotalPages, setSkillsTotalPages] = useState(1)
  const [currentMentorPage, setCurrentMentorPage] = useState(0)
  const [mentorTotalPages, setMentorTotalPages] = useState(1)
  const categoryScrollRef = useRef(null)
  const heroSectionRef = useRef(null)
  // const [apiMentors, setApiMentors] = useState([])     <-- Removed, using hardcoded data
  // const [isLoadingMentors, setIsLoadingMentors] = useState(true) <-- Removed
  const [currentCareerGuidanceIndex, setCurrentCareerGuidanceIndex] = useState(0)
  const [currentSimpleTestimonialPage, setCurrentSimpleTestimonialPage] = useState(1)
  const [contactEmail, setContactEmail] = useState('')
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)
  const howItWorksSectionRef = useRef(null)
  const careerGuidanceRightRef = useRef(null)
  const careerGuidanceTrackRef = useRef(null)
  const [roadmapStep, setRoadmapStep] = useState(0)

  const roadmapContainerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When visible, animate to full gradually or instantly with CSS transition
            // We want "line goes full till 3"
            // Let's set it to 3 and let CSS transition handle the duration
            setRoadmapStep(3)
          } else {
            // When leaving, reset after a delay so user doesn't see it snap back immediately
            const timer = setTimeout(() => {
              setRoadmapStep(0)
            }, 1000) // 1s delay before reset
            return () => clearTimeout(timer)
          }
        })
      },
      {
        threshold: 0.4, // Trigger when 40% visible
      }
    )

    if (roadmapContainerRef.current) {
      observer.observe(roadmapContainerRef.current)
    }

    // New Reveal Observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          } else {
            entry.target.classList.remove('visible')
          }
        })
      },
      { threshold: 0.3 }
    )

    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => revealObserver.observe(el))

    return () => {
      if (roadmapContainerRef.current) {
        observer.unobserve(roadmapContainerRef.current)
      }
      revealElements.forEach((el) => revealObserver.unobserve(el))
    }
  }, [topMentors, topCourses])

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
  // Hardcoded Premium Mentors moved to module scope or defined here

  const mentorsToDisplay = apiMentors.map(mentor => ({
    id: mentor.id,
    name: mentor.name,
    role: mentor.role,
    company: mentor.company,
    focus: mentor.role, // fallback
    rating: mentor.rating || 4.9,
    reviews: mentor.reviews || 100,
    assured: true,
    experience: mentor.experience,
    image: mentor.image
  }))

  const platformFeatures = [
    { id: 'feat-1', name: '1-on-1 Mentorship', icon: ProgrammingIcon, desc: 'Personalized guidance from experts.' },
    { id: 'feat-2', name: 'Real World Projects', icon: FolderIcon, desc: 'Build portfolio-ready industry apps.' },
    { id: 'feat-3', name: 'Direct Referrals', icon: BoltIcon, desc: 'Get referred to top tech giants.' }
  ]

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
      const totalPages = Math.ceil(topMentors.length / cardsPerPage)
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
  }, [topMentors.length])

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
    <div className="landing-page-new font-sans">
      <div className="background-effects">
        <div className="grain-texture absolute inset-0"></div>
        <div className="floating-shape w-64 h-64 bg-sky-400 opacity-10 top-[-10%] left-[-10%] animate-pulse" style={{ width: '16rem', height: '16rem', background: 'rgba(14, 165, 233, 0.1)' }}></div>
        <div className="floating-shape w-80 h-80 bg-purple-200 opacity-20 bottom-[-10%] right-[-10%]" style={{ width: '20rem', height: '20rem', background: 'rgba(233, 213, 255, 0.2)' }}></div>
        <div className="absolute top-1/4 left-1/2 w-4 h-4 rounded-full bg-sky-400 opacity-40 shadow-[0_0_20px_rgba(14,165,233,0.5)]" style={{ width: '1rem', height: '1rem', background: 'rgba(14, 165, 233, 0.4)' }}></div>
      </div>

      <nav className="nav-pill-wrapper reveal reveal-down">
        <div className="nav-pill">
          <div className="nav-logo-group">
            <div className="nav-logo-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>bolt</span>
            </div>
            <h2 className="nav-logo-text">Internify</h2>
          </div>
          <div className="nav-btn-group">
            <button className="nav-login-btn" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="nav-join-btn" onClick={() => isLoggedIn ? navigate('/dashboard') : navigate('/signup')}>
              {isLoggedIn ? 'Enter Dashboard' : 'Join'}
            </button>
          </div>
        </div>
      </nav>

      <main className="landing-main-content">
        <section className="elegant-hero">
          <div className="hero-lottie-bg">
            <Lottie animationData={techBgJson} loop={true} />
          </div>

          <div className="hero-glass-card">
            <h1 className="hero-title-new">
              Master your <br />
              <span className="italic-sky">perfect craft</span>
            </h1>
            <p className="hero-subtitle-new">
              Learn from industry veterans through <br />
              personalized mentorship and guided paths.
            </p>

            <div className="hero-search-pill">
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search mentors, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="hero-search-btn" onClick={handleSearch}>Search</button>
            </div>

            <div className="hero-mentors-badge">
              <div className="avatar-stack">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Mentor" className="avatar-small" />
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop" alt="Mentor" className="avatar-small" />
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop" alt="Mentor" className="avatar-small" />
              </div>
              <span className="mentors-count">582+ Active Mentors</span>
            </div>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat-card liquid-glass">
              <span className="stat-label-small">SUCCESS RATE</span>
              <span className="stat-value-large">98%</span>
            </div>
            <div className="hero-stat-card liquid-glass">
              <span className="stat-label-small">SESSION SCHEDULED</span>
              <span className="stat-value-large">10k+</span>
            </div>
          </div>
        </section>

        <section className="mission-section landing-section">
          <div className="mission-centered-header reveal reveal-blur-pop">
            <h2 className="section-title-v2">Are You Running Into <span>These Problems?</span></h2>
            {/* <p className="mission-subtitle-v2">Internify bridges the gap between where you are and where you want to be.</p> */}
          </div>

          <div className="mission-problems-grid">
            <div className="problem-card-v2 reveal reveal-slow reveal-right stagger-slow-1">
              <span className="problem-number">01</span>
              <h3 className="problem-title">No Real-World Experience ?</h3>
              <p className="problem-text">You’ve learned so much in theory, but when it comes to applying it, it feels like there’s a huge gap between what you know and what the real world expects.</p>
            </div>

            <div className="problem-card-v2 reveal reveal-slow reveal-up stagger-slow-2">
              <span className="problem-number">02</span>
              <h3 className="problem-title">No Internship Opportunities ?</h3>
              <p className="problem-text">You’re ready to work, but opportunities are scarce, and it feels like doors keep closing before you even get a chance to show your potential.</p>
            </div>

            <div className="problem-card-v2 reveal reveal-slow reveal-left stagger-slow-3">
              <span className="problem-number">03</span>
              <h3 className="problem-title">Unprepared for Job Market ?</h3>
              <p className="problem-text">You dream of starting your career, but without guidance, a strong portfolio, or interview practice, the path ahead feels overwhelming and uncertain.</p>
            </div>
          </div>
        </section>



        <section className="disciplines-section landing-section reveal reveal-blur-pop">
          <h2 className="font-serif text-3xl text-deep-charcoal mb-4 reveal reveal-blur-pop"> </h2>
          <div className="career-carousel-container no-scrollbar reveal reveal-up stagger-1">
            {/* Removed platformFeatures from here as requested to focus on career fields */}

            {/* Existing Categories */}
            {categories.map((cat, index) => (
              <div key={cat.id} className={`discipline-item reveal reveal-right stagger-${((index + platformFeatures.length) % 4) + 1}`}>
                <div className={`organic-card discipline-card liquid-glass p-1 overflow-hidden ${index % 2 === 0 ? 'rotate-[8deg]' : '-rotate-[8deg]'}`} style={{ border: '2px solid rgba(14, 165, 233, 0.2)' }}>
                  <div className="w-full h-full bg-sky-50/30 flex items-center justify-center organic-card">
                    <cat.icon className="text-sky-500" size={40} />
                  </div>
                </div>
                <div className="discipline-info">
                  <p className="discipline-name">{cat.name}</p>
                  <p className="discipline-count">100+ Mentors</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        <section className="benefits-section landing-section">
          <div className="benefits-header">
            <h2 className="Benefits-title-v2">We Provide You <span>Mentor-Led Internship Opportunities</span></h2>
          </div>
          <div className="benefits-grid-v2">
            <div className="reveal reveal-up stagger-slow-1">
              <div className="benefit-card-v2">
                <div className="benefit-icon-v2 icon-sky">
                  <span className="material-symbols-outlined">videocam</span>
                </div>
                <h3 className="benefit-name-v2">1-on-1 Classes with Experts</h3>
                <p className="benefit-desc-v2"> industry professionals who guide you step-by-step</p>
              </div>
            </div>
            <div className="reveal reveal-up stagger-slow-2">
              <div className="benefit-card-v2">
                <div className="benefit-icon-v2 icon-sky">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <h3 className="benefit-name-v2">Real-World Projects</h3>
                <p className="benefit-desc-v2">Gain hands-on experience working on projects that prepare you for actual industry challenges.</p>
              </div>
            </div>
            <div className="reveal reveal-up stagger-slow-3">
              <div className="benefit-card-v2">
                <div className="benefit-icon-v2 icon-purple">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <h3 className="benefit-name-v2">Referral Letters & Certificates</h3>
                <p className="benefit-desc-v2">Showcase your skills and get mentor-backed recommendations to strengthen your profile.</p>
              </div>
            </div>
            <div className="reveal reveal-up stagger-slow-4">
              <div className="benefit-card-v2">
                <div className="benefit-icon-v2 icon-ocean">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <h3 className="benefit-name-v2">Access to Recruiters</h3>
                <p className="benefit-desc-v2">Connect with top companies and get opportunities to kickstart your career..</p>
              </div>
            </div>
          </div>
        </section>





        <section className="top-mentors-section-v2 landing-section reveal reveal-blur-pop">
          <div className="tracks-header reveal reveal-blur-pop">
            <h2 className="section-title-v2">Top <span>Mentors</span></h2>
            <span className="view-all-link-v2" onClick={() => navigate('/explore')}>See all <span className="material-symbols-outlined">arrow_forward</span></span>
          </div>
          <div className="mentors-grid-v2">
            {topMentors.slice(0, 5).map((mentor, index) => (
              <div key={mentor.id} className={`mentor-card-horizontal-v2 reveal reveal-perspective-in stagger-${index + 1}`}>
                <div className="mentor-card-header-v2">
                  <img src={mentor.image} alt={mentor.name} className="mentor-avatar-large-v2" />
                  <div className="mentor-company-tag-v2">{mentor.company}</div>
                </div>
                <div className="mentor-card-body-v2">
                  <h3 className="mentor-name-v2">{mentor.name}</h3>
                  <p className="mentor-role-v2">{mentor.role}</p>
                  <div className="mentor-stats-row-v2">
                    <div className="mentor-stat-v2">
                      <span className="material-symbols-outlined">star</span> {mentor.rating}
                    </div>
                    <div className="mentor-stat-v2">
                      <span className="material-symbols-outlined">group</span> {mentor.reviews}
                    </div>
                  </div>
                  <button className="btn-connect-card-v2" onClick={() => onMentorClick(mentor)}>Connect</button>
                </div>
              </div>
            ))}
          </div>
        </section>


        <section className="top-courses-section-v2 landing-section reveal reveal-blur-pop">
          <div className="tracks-header reveal reveal-blur-pop">
            <h2 className="section-title-v2">Top <span>Courses</span></h2>
            <span className="view-all-link-v2" onClick={() => navigate('/explore')}>See all <span className="material-symbols-outlined">arrow_forward</span></span>
          </div>
          <div className="courses-marquee-container">
            {/* Row 1: First half of courses, duplicated for loop */}
            <div className="marquee-row marquee-left-1">
              {[...topCourses.slice(0, 6), ...topCourses.slice(0, 6)].map((course, idx) => (
                <div key={`${course.id}-r1-${idx}`} className="course-card-marquee">
                  <div className="course-thumb-v2">
                    <img src={course.image} alt={course.title} />
                    <div className="course-tag-v2">{course.category || 'Design'}</div>
                  </div>
                  <div className="course-content-v2">
                    <h3 className="course-name-v2">{course.title}</h3>
                    <div className="course-meta-v2">
                      <div className="course-rating-v2">
                        <span className="material-symbols-outlined">star</span>
                        <span>{course.rating}</span>
                      </div>
                      <div className="course-reviews-v2">({course.reviews || 24} reviews)</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Second half (or mixed), duplicated for loop */}
            <div className="marquee-row marquee-right">
              {[...topCourses.slice(6, 12), ...topCourses.slice(6, 12)].map((course, idx) => (
                <div key={`${course.id}-r2-${idx}`} className="course-card-marquee">
                  <div className="course-thumb-v2">
                    <img src={course.image} alt={course.title} />
                    <div className="course-tag-v2">{course.category || 'Tech'}</div>
                  </div>
                  <div className="course-content-v2">
                    <h3 className="course-name-v2">{course.title}</h3>
                    <div className="course-meta-v2">
                      <div className="course-rating-v2">
                        <span className="material-symbols-outlined">star</span>
                        <span>{course.rating}</span>
                      </div>
                      <div className="course-reviews-v2">({course.reviews || 85} reviews)</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>





        <section className="cta-side-by-side landing-section reveal reveal-blur-pop">
          <div className="cta-split-container">
            <div className="referral-banner-v2 reveal reveal-left reveal-blur-pop stagger-1">
              <div className="referral-icon-v2">
                <span className="material-symbols-outlined">rocket</span>
              </div>
              <h2 className="referral-title-v2">Get Hired Instantly</h2>
              <p className="referral-text-v2">
                Join our exclusive placement program and get direct referrals to top tech firms.
              </p>
              <button className="btn-referral-v2" onClick={() => navigate('/explore')}>Apply for Referrals</button>
            </div>

            <div className="mentor-cta-card-v2 reveal reveal-right reveal-blur-pop stagger-2">
              <div className="mentor-cta-icon-v2">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <h2 className="mentor-cta-title-v2">Become a Mentor</h2>
              <p className="mentor-cta-text-v2">
                Share your knowledge and help shape the next generation of professionals.
              </p>
              <button className="btn-mentor-cta-v2" onClick={() => navigate('/apply-mentor')}>Start Teaching</button>
            </div>
          </div>

        </section>

        <section className="unified-footer-frame landing-section landing-section-v2 reveal">



          {/* Success Stories Component */}
          <div className="section-header-v2 reveal reveal-blur-pop">
            <h2 className="section-title-v2">Success <span>Stories</span></h2>
          </div>
          <div className="success-stories-scroll-frame no-scrollbar">
            {careerGuidanceTestimonials.map((story, idx) => (
              <div key={story.id} className={`success-story-card-small reveal reveal-story-pop stagger-${(idx % 4) + 1}`}>
                <div className="story-header-small">
                  <img src={story.mentorImage} alt={story.mentorName} className="story-avatar-small" />
                  <div className="story-meta-small">
                    <span className="story-name-small">{story.mentorName}</span>
                    <span className="story-role-small">{story.mentorRole}</span>
                  </div>
                </div>
                <div className="story-rating-small">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined icon-filled">star</span>
                  ))}
                </div>
                <p className="story-quote-small">"{story.quote}"</p>
              </div>
            ))}
          </div>

          {/* Spacer between components */}
          <div style={{ height: '6rem' }}></div>
          {/* Get in Touch Component */}
          <div className="get-in-touch-container-new liquid-glass glow-edge reveal reveal-up">
            <h2 className="get-in-touch-title-new">Get in Touch</h2>
            <p className="get-in-touch-desc-new">
              Have questions or need guidance? Our team is here to help you navigate your career journey.
            </p>
            <div className="get-in-touch-form-new">
              <input type="email" placeholder="Enter your email" className="get-in-touch-input-new" />
              <button className="get-in-touch-btn-new">Send Message</button>
            </div>
          </div>

        </section>
      </main>

      <footer className="footer-redesign reveal">
        <div className="footer-content-new">
          <div className="footer-logo-row reveal reveal-up">
            <div className="footer-logo-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>bolt</span>
            </div>
            <h2 className="footer-logo-text">Internify</h2>
          </div>
          <div className="footer-links-grid">
            <div className="footer-column reveal reveal-up stagger-1">
              <h4 className="footer-column-title">Platform</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item" onClick={() => navigate('/explore')}>Mentorship</li>
                <li className="footer-link-item" onClick={() => navigate('/explore')}>Courses</li>
                <li className="footer-link-item" onClick={() => navigate('/jobs')}>Careers</li>
              </ul>
            </div>
            <div className="footer-column reveal reveal-up stagger-2">
              <h4 className="footer-column-title">Company</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item">About</li>
                <li className="footer-link-item">Terms</li>
                <li className="footer-link-item">Privacy</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom-new reveal reveal-up stagger-3">
            <p className="footer-copyright">© 2026 Internify</p>
            <div className="footer-socials">
              <div className="social-icon-pill">
                <span className="material-symbols-outlined">public</span>
              </div>
              <div className="social-icon-pill">
                <span className="material-symbols-outlined">share</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div >
  )
}
