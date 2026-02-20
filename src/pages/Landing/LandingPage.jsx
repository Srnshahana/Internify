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
import Loading from '../../components/Loading';
import CourseModal from '../../components/CourseModal';
import supabase from '../../supabaseClient'
import '../../App.css'
import heroVideo from '../../assets/images/hero.mp4'
import heroImg from '../../assets/images/hero.jpg'
import topProgram3 from '../../assets/images/topprogram3.jpg'
import backgroundImg from '../../assets/images/background.png'
import image1 from '../../assets/images/njk.jpg'
import settingsImg from '../../assets/images/settings.png'
import shadowImg from '../../assets/images/shadow.png'
import searchVectorImg from '../../assets/images/searchvector.png'
import aiCourseImg from '../../assets/images/ai.jpg'
import digitalMarketingImg from '../../assets/images/digital marketting.jpg'
import ethicalHackingImg from '../../assets/images/ethicalhacking.jpg'

// Map courses to skills format
// Featured Programs Data
const featuredPrograms = [
  {
    id: 'fp-1',
    title: 'Artificial Intelligence & Machine Learning',
    category: 'Future Tech',
    growthStat: '7x job growth',
    image: aiCourseImg,
    overlayColor: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
  },
  {
    id: 'fp-2',
    title: 'Digital Marketing',
    category: 'AI Strategy',
    growthStat: '443% skill demand growth',
    image: digitalMarketingImg,
    overlayColor: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
  },
  {
    id: 'fp-3',
    title: 'Ethical Hacking and Cyber Security',
    category: 'Digital Security',
    growthStat: '4M+ job shortage',
    image: ethicalHackingImg,
    overlayColor: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
  }
]
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
  const videoRef = useRef(null)

  useEffect(() => {
    // Force play on mount to handle browser autoplay policies
    const video = videoRef.current;
    if (video) {
      console.log("Attempting to force autoplay...");
      // Explicitly set muted property on the DOM element
      video.muted = true;
      video.playsInline = true;

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("Video playing successfully");
        }).catch(error => {
          console.error("Video autoplay failed:", error);
          // Retry on user interaction if needed, but for now just log
        });
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
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
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)

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
            // Re-trigger animation by removing class when out of view
            entry.target.classList.remove('visible')
          }
        })
      },
      { threshold: 0.1 } // Reduced threshold for better triggering
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

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const aboutSlides = [
    {
      title: "Who We Are",
      text: "Internify is a mentorship and internship platform that bridges the gap between learning and real-world experience. We are a community of innovators, educators, and industry leaders dedicated to shaping the future of tech talent.",
      image: backgroundImg
    },
    {
      title: "What We Do",
      text: "We provide personalized guidance, hands-on projects, verified certificates, and opportunities to connect with top mentors and recruiters. Our platform empowers students and early-career professionals to build practical skills and launch their careers with confidence.",
      image: backgroundImg
    },
    {
      title: "Who We're For",
      text: "Whether you're a student looking for your first break, a career switcher seeking new opportunities, or a lifelong learner aiming to upskill, Internify is built for you. We support ambitious individuals ready to take charge of their professional journey.",
      image: backgroundImg
    }
  ];

  // Auto-slide Effect
  useEffect(() => {
    if (isDragging) return; // Pause auto-slide while dragging

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aboutSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [aboutSlides.length, isDragging]);

  // Drag/Swipe Handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes('mouse') ? e.pageX : e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap to slide if drag distance is significant
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0 && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      } else if (dragOffset < 0 && currentSlide < aboutSlides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      }
    }
    setDragOffset(0);
  };

  return (
    <div className="landing-page-new font-sans">

      <nav className="simple-navbar">
        <div className="nav-container">
          <div className="nav-logo">Internify</div>
          <div className="nav-links">
            <a href="#search">Search</a>
            <a href="#courses">courses</a>
            <a href="#mentors">mentors</a>
            <a href="#testimonials">testimonials</a>
            <button className="nav-login-simple" onClick={() => navigate('/login')}>login</button>
          </div>
        </div>
      </nav>

      <main className="landing-main-content">
        <section className="hero-section-v3">
          <div className="hero-dark-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <video
              ref={videoRef}
              className="hero-video-bg"
              onCanPlay={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                opacity: 0.6 // Adjust opacity to match previous dark overlay feel
              }}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>

            {/* Overlay to ensure text readability if video is bright */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1
            }}></div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h1 className="hero-title-v3 reveal reveal-left">Build Your Career Step by Stept</h1>
              <p className="hero-subtitle-v3 reveal reveal-right">
                A career mentorship ecosystem that connects students with experienced mentors to provide clarity, direction, and real-world guidance.
              </p>

              <div className="hero-search-v3">
                <input
                  type="text"
                  placeholder="Search mentors , skills ..."
                  className="hero-input-v3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <span className="search-icon-v3" onClick={handleSearch} style={{ cursor: 'pointer' }}>
                  <span className="material-symbols-outlined">search</span>
                </span>
              </div>

              <div className="hero-actions-v3">
                <button className="btn-v3-primary" onClick={() => setIsCourseModalOpen(true)}>
                  View Courses
                  <span className="material-symbols-outlined icon-right">arrow_forward</span>
                </button>
                <button className="btn-v3-outline">Let's Talk</button>
              </div>

              {/* <div className="hero-stats-row-v3">
                <div className="stat-item-v3">
                  <span className="stat-val-v3">3500+</span>
                  <span className="stat-lbl-v3">Students</span>
                </div>
                <div className="stat-divider-v3"></div>
                <div className="stat-item-v3">
                  <span className="stat-val-v3">500+</span>
                  <span className="stat-lbl-v3">Mentors</span>
                </div>
                <div className="stat-divider-v3"></div>
                <div className="stat-item-v3">
                  <span className="stat-val-v3">1200+</span>
                  <span className="stat-lbl-v3">Hired</span>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        <section className="featured-programs-section landing-section">
          <img src={settingsImg} alt="" className="bg-deco-settings" />
          <div className="featured-header reveal reveal-down">
            <div className="featured-text-group">
              <h2 className="section-title-start">Featured Courses</h2>
              <div className="title-underline-blue"></div>
              <p className="featured-desc">
                Explore the top courses built on skills that remain relevant <br />
                for decades. Future-proof your career with knowledge that <br />
                stands the test of time.
              </p>
            </div>
            <div className="view-all-container">
              <span className="view-all-text" onClick={() => navigate('/explore')}>
                View All courses <span className="material-symbols-outlined icon-inline">arrow_forward</span>
              </span>
            </div>
          </div>

          <div className="featured-grid">
            {featuredPrograms.map((program, index) => (
              <div key={program.id} className={`program-card reveal reveal-up stagger-${(index % 3) + 1}`}>
                <img src={program.image} alt={program.title} className="program-bg" />
                <div className="program-overlay"></div>
                <div className="program-content">
                  <div className="program-top-meta">
                    <span className="program-category">{program.growthStat}</span>
                  </div>
                  <h3 className="program-title">{program.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>


        <section
          className="mission-section landing-section"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${image1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* <img src={settingsImg} alt="" className="bg-deco-settings" /> Removed as requested */}
          <img src={shadowImg} alt="" className="bg-deco-shadow top-right" />
          <div className="mission-centered-header reveal reveal-pop">
            <h2 className="section-title-v3">What’s Holding You Back</h2>
            <p className="mission-subtitle-v3">
              Every early-career professional faces the struggle of having no clear direction. Without
              guidance, it’s easy to feel lost, overwhelmed, and unsure of the next steps.
            </p>
          </div>

          <div className="mission-problems-grid">
            <div className="problem-card-v3 reveal reveal-slow reveal-right stagger-slow-1">
              <div className="problem-icon-v3">
                <span className="material-symbols-outlined icon-large-blue">laptop_mac</span>
              </div>
              <h3 className="problem-title-v3">No Real-World Experience ?</h3>
              <p className="problem-text-v3">
                You’ve learned a lot in theory, but when applying it, there’s a big gap
                between what you know and what the real world expects
              </p>
            </div>

            <div className="problem-card-v3 reveal reveal-slow reveal-up stagger-slow-2">
              <div className="problem-icon-v3">
                <span className="material-symbols-outlined icon-large-blue">person</span>
              </div>
              <h3 className="problem-title-v3">No Internship Opportunities ?</h3>
              <p className="problem-text-v3">
                You’re ready to work, but opportunities are scarce, and doors close before you
                can show your potential
              </p>
            </div>

            <div className="problem-card-v3 reveal reveal-slow reveal-left stagger-slow-3">
              <div className="problem-icon-v3">
                <span className="material-symbols-outlined icon-large-blue">design_services</span>
              </div>
              <h3 className="problem-title-v3">Unprepared for Job Market ?</h3>
              <p className="problem-text-v3">
                You dream of starting your career, but without guidance or a strong portfolio,
                the path feels uncertain.
              </p>
            </div>
          </div>
          <img src={shadowImg} alt="" className="bg-deco-shadow bottom-left" />
        </section>

        <section className="about-us-section landing-section">
          {/* <img src={settingsImg} alt="" className="bg-deco-settings" /> */}
          {/* Static About Us Content Restored */}
          <div className="about-content">
            <h2 className="section-title-v3">About Us</h2>
            <p className="about-text">
              Internify is a mentorship and internship platform that bridges the gap between learning and real-world experience.
              {/* We provide personalized guidance, hands-on projects, verified certificates, and opportunities to connect with top mentors and recruiters,  */}
              empowering students and early-career professionals to confidently launch their careers
            </p>
          </div>

          {/* Slider Moved to "Box" (Image Container area) */}
          <div className="about-slider-box">
            <div
              className={`about-carousel-track ${isDragging ? 'dragging' : ''}`}
              style={{
                transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              {aboutSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`about-slide-card ${index === currentSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="about-card-content">
                    <h3 className="about-card-title">{slide.title}</h3>
                    <p className="about-card-text">{slide.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="about-dots-box">
              {aboutSlides.map((_, index) => (
                <span
                  key={index}
                  className={`about-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </section>

        <section className="offer-section landing-section">
          <img src={settingsImg} alt="" className="bg-deco-settings" />
          <img src={shadowImg} alt="" className="bg-deco-shadow top-left" />
          <img src={shadowImg} alt="" className="bg-deco-shadow bottom-right" />
          <div className="offer-header reveal reveal-pop">
            <h2 className="section-title-v3">What we offer</h2>
            <p className="offer-subtitle">
              Our goal is to equip you with the skills, guidance, and connections to launch<br />
              your career."
            </p>
          </div>

          <div className="offer-grid">
            {/* Card 1 */}
            <div className="offer-card reveal reveal-backflip stagger-1">
              <span className="material-symbols-outlined offer-icon-blue">lightbulb</span>
              <span className="offer-number">01</span>
              <h3 className="offer-card-title">1-on-1 Mentorship</h3>
              <p className="offer-card-text">
                Personalized guidance from industry experts to help you navigate your career path.
              </p>
            </div>

            {/* Card 2 */}
            <div className="offer-card reveal reveal-backflip stagger-2">
              <span className="material-symbols-outlined offer-icon-blue">edit_square</span>
              <span className="offer-number">02</span>
              <h3 className="offer-card-title">Real-World Projects</h3>
              <p className="offer-card-text">
                Hands-on projects that build practical skills and strengthen your portfolio.
              </p>
            </div>

            {/* Card 3 */}
            <div className="offer-card reveal reveal-backflip stagger-3">
              <span className="material-symbols-outlined offer-icon-blue">verified</span>
              <span className="offer-number">03</span>
              <h3 className="offer-card-title">Verified Certificates</h3>
              <p className="offer-card-text">
                Skill-backed certificates to showcase your achievements to employers.
              </p>
            </div>

            {/* Card 4 */}
            <div className="offer-card reveal reveal-backflip stagger-4">
              <span className="material-symbols-outlined offer-icon-blue">computer</span>
              <span className="offer-number">04</span>
              <h3 className="offer-card-title">Referral Letters</h3>
              <p className="offer-card-text">
                Mentor-issued recommendations to support internship and job applications.
              </p>
            </div>

            {/* Card 5 */}
            <div className="offer-card reveal reveal-backflip stagger-5">
              <span className="material-symbols-outlined offer-icon-blue">description</span>
              <span className="offer-number">05</span>
              <h3 className="offer-card-title">Career Guidance & Interview Prep</h3>
              <p className="offer-card-text">
                Resume reviews, mock interviews, and advice aligned with recruiter expectations.
              </p>
            </div>

            {/* Card 6 */}
            <div className="offer-card reveal reveal-backflip stagger-6">
              <span className="material-symbols-outlined offer-icon-blue">forum</span>
              <span className="offer-number">06</span>
              <h3 className="offer-card-title">Recruitments & Opportunities</h3>
              <p className="offer-card-text">
                Connect with top companies and apply for internships and entry-level roles.
              </p>
            </div>
          </div>
        </section>

        <section className="mentors-section landing-section">
          <div className="mentors-header reveal reveal-left">
            <div className="mentors-text-content">
              <h2 className="section-title-start">Professional Mentors</h2>
              <div className="title-underline-blue"></div>
              <p className="mentors-desc">
                Our mentors are industry experts with 5+ years of real-world
                experience, providing practical guidance and insights to help
                you succeed in your career.
              </p>
            </div>
            <a href="/mentors" className="view-all-link">
              View All mentors <span className="material-symbols-outlined icon-inline">arrow_forward</span>
            </a>
          </div>

          <div className="mentors-grid">
            {/* Hardcoded Mentors Data */}
            {[
              {
                id: 1,
                name: "Sarah Jenkins",
                role: "Senior UX Designer",
                company: "Google",
                experience: "8+ Years",
                rating: 5,
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
                skills: ["UI/UX", "Figma", "Research"]
              },
              {
                id: 2,
                name: "David Chen",
                role: "Staff Engineer",
                company: "Netflix",
                experience: "10+ Years",
                rating: 5,
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
                skills: ["System Design", "Java"]
              },
              {
                id: 3,
                name: "Emily Rodriguez",
                role: "Product Manager",
                company: "Airbnb",
                experience: "7+ Years",
                rating: 5,
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
                skills: ["Strategy", "Agile", "Data"]
              },
              {
                id: 4,
                name: "Michael Chang",
                role: "Frontend Lead",
                company: "Meta",
                experience: "9+ Years",
                rating: 5,
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
                skills: ["React", "GraphQL", "Web"]
              }
            ].map((mentor, index) => (
              <div key={mentor.id} className={`mentor-card-compact reveal reveal-up stagger-${(index % 4) + 1}`}>
                <div className="mentor-image-container">
                  <img src={mentor.image} alt={mentor.name} className="mentor-image" />
                </div>
                <div className="mentor-info">
                  <h3 className="mentor-name">{mentor.name}</h3>
                  <div className="mentor-role-company">
                    {mentor.role} <span className="text-highlight">@ {mentor.company}</span>
                  </div>
                  <div className="mentor-experience-text">
                    {mentor.experience} Exp
                  </div>
                  <div className="mentor-rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`material-symbols-outlined ${i < Math.floor(mentor.rating) ? 'star-filled' : 'star-outline'}`}>
                        star
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Get Hired & Mentor Section */}
        {/* New Get Hired & Mentor Section */}
        <section
          className="get-hired-section landing-section reveal reveal-slow reveal-up"
          style={{
            backgroundImage: `url(${image1})`
          }}
        >
          {/* <img src={searchVectorImg} alt="" className="bg-deco-search-vector" /> */}
          <div className="section-header-v3">
            <h2 className="section-title-v3">Career Growth Opportunities</h2>
            <p className="section-subtitle-v3">Take the next step in your professional journey with our tailored programs.</p>
          </div>
          <div className="get-hired-grid">
            <div className="feature-card reveal reveal-backflip stagger-1">
              <div className="feature-icon-wrapper icon-hired">
                <span className="material-symbols-outlined">rocket_launch</span>
              </div>
              <h3 className="feature-title">Get Hired Instantly</h3>
              <p className="feature-desc">
                Join our exclusive placement program and get direct referrals to top tech firms. Fast-track your career with our network.
              </p>
              <button className="feature-btn btn-hired" onClick={() => navigate('/explore')}>Apply for Referrals</button>
            </div>

            <div className="feature-card reveal reveal-backflip stagger-2">
              <div className="feature-icon-wrapper icon-mentor">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h3 className="feature-title">Become a Mentor</h3>
              <p className="feature-desc">
                Share your expertise, guide aspiring developers, and shape the future of tech. Join our community of industry leaders.
              </p>
              <button className="feature-btn btn-mentor" onClick={() => navigate('/mentors')}>Start Mentoring</button>
            </div>
          </div>
        </section>







        {/* ... navbar ... */}

        {/* ... hero section ... */}
















        <section className="unified-footer-frame landing-section landing-section-v2 reveal">



          {/* Success Stories Component */}
          <div className="mentors-header reveal reveal-story-pop">
            <div className="mentors-text-content">
              <h2 className="section-title-start">Success <span>Stories</span></h2>
              <div className="title-underline-blue"></div>
              <p className="mentors-desc">
                Hear from our community of learners who have transformed their careers.<br />
                Their journeys from beginners to professionals inspire everything we do.
              </p>
            </div>
          </div>
          <div className="success-stories-grid">
            {careerGuidanceTestimonials.slice(0, 3).map((story, idx) => (
              <div key={story.id} className={`testimonial-card reveal reveal-flip-up stagger-${(idx % 3) + 1}`}>
                <div className="testimonial-header">
                  <img src={story.mentorImage} alt={story.mentorName} className="testimonial-avatar" />
                  <div className="testimonial-meta">
                    <span className="testimonial-name">{story.mentorName}</span>
                    <span className="testimonial-role">{story.mentorRole}</span>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined icon-filled">star</span>
                  ))}
                </div>
                <p className="testimonial-quote">"{story.quote}"</p>
              </div>
            ))}
          </div>

          {/* Get in Touch Section Removed - Integrated into Footer */}
        </section>
      </main >

      <footer className="footer-redesign reveal">
        <div className="footer-content-new">
          <div className="footer-main-row">
            <div className="footer-left-col">
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
            </div>

            <div className="footer-right-col reveal reveal-up stagger-3">
              <div className="feature-card get-in-touch-card footer-contact-card">
                <div className="feature-icon-wrapper icon-contact">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <h2 className="feature-title">Get in Touch</h2>
                <p className="feature-desc">
                  Have questions or need guidance? Our team is available to help.
                </p>
                <div className="get-in-touch-form-new">
                  <input type="email" placeholder="Enter your email" className="get-in-touch-input-new" />
                  <button className="feature-btn btn-contact">Send Message</button>
                </div>
              </div>
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
      <CourseModal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} />
    </div >
  )
}
