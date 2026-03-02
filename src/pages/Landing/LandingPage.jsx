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
import worldMapImg from '../../assets/images/worldmap.jpg'

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
    image: 'https://ui-avatars.com/api/?name=Mentor&background=0D0D0D&color=fff',
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
  const [aboutSlideIndex, setAboutSlideIndex] = useState(0)
  const aboutFeatures = [
    {
      title: "Who We Are",
      desc: "Internify is a premiere mentorship platform bridging the gap between academic learning and high-stakes industry performance through expert-led guidance."
    },
    {
      title: "Our Mission",
      desc: "We empower the next generation of digital builders by providing a structured ecosystem of real-world projects, verified certifications, and elite networking."
    },
    {
      title: "Our Vision",
      desc: "To create a global standard for professional excellence where every ambitious learner has a direct, frictionless path to their dream career."
    }
  ]
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

  // Simplified About Us Section

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
        <section className="hero-section-v3" id="search">
          {/* Floating 3D Decoration for Glass look */}
          <div className="glass-decoration-elements">
            <div className="floating-sphere sphere-1"></div>
            <div className="floating-sphere sphere-2"></div>
            <div className="floating-sphere sphere-3"></div>
            <div className="floating-sphere sphere-4"></div>
            {/* Metallic 3D Rings (Torus) */}
            <div className="glass-ring ring-1"></div>
            <div className="glass-ring ring-2"></div>
            <div className="glass-ring ring-3"></div>
          </div>

          <div className="hero-glass-card">
            {/* Browser Mockup Header */}
            <div className="browser-header">
              <div className="browser-controls">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="browser-address-bar">
                <span>www.internify.com</span>
              </div>
              <div className="browser-spacer"></div>
            </div>

            <div className="hero-content-wrapper">
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h1 className="hero-title-v3 reveal reveal-left">Build Your Career Step by Step</h1>
                <p className="hero-subtitle-v3 reveal reveal-right">
                  A career mentorship ecosystem that connects students with experienced mentors to provide clarity, direction, and real-world guidance.
                </p>

                <div className="hero-search-v3 reveal reveal-up stagger-3">
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

                <div className="hero-actions-v3 reveal reveal-up stagger-4">
                  <button className="btn-v3-primary" onClick={() => setIsCourseModalOpen(true)}>
                    View Courses
                    <span className="material-symbols-outlined icon-right">arrow_forward</span>
                  </button>
                  <button className="btn-v3-outline">Let's Talk</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-programs-section landing-section" id="courses">
          <div className="neu-texture-overlay"></div>

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
                <div className="program-card-image-wrapper">
                  <img src={program.image} alt={program.title} className="program-bg" />
                  <div className="program-overlay"></div>
                </div>
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


        <section className="mission-section landing-section reveal reveal-pop" id="mission">
          <div className="mission-bg-pattern">
            <div className="pattern-dots-right"></div>
          </div>

          <div className="neu-texture-overlay"></div>

          {/* Background Blobs for Vibrance */}
          <div className="mission-bg-blobs">
            <div className="mission-blob blob-1"></div>
            <div className="mission-blob blob-2"></div>
          </div>

          <div className="mission-composition">
            {/* Background Decorative Elements */}
            <div className="mission-deco-text-v4">CHALLENGES</div>

            <div className="inspo-deco-elements">
              <div className="deco-square ds-1"></div>
              <div className="deco-square ds-2"></div>
              <div className="deco-square ds-3"></div>
              <div className="deco-gear dg-1">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <div className="deco-gear dg-2">
                <span className="material-symbols-outlined">settings</span>
              </div>
            </div>

            {/* 3 Central Neumorphic Devices */}
            <div className="mission-device-grid">
              {/* Card 1: Experience */}
              <div className="mission-device">
                <div className="device-inner">
                  <div className="device-header-pill"></div>
                  <div className="mission-text-content-v4">
                    <span className="mission-tag-v4">CHALLENGE 01</span>
                    <h2 className="mission-title-v4">EXPERIENCE</h2>
                    <div className="mission-divider"></div>
                    <p className="mission-desc-v4">
                      You’ve learned theory, but there’s a gap between what you know and what the real world expects.
                    </p>
                    <button className="device-btn">SOLVE NOW</button>
                  </div>
                  <div className="device-home-button"></div>
                </div>
              </div>

              {/* Card 2: Opportunities */}
              <div className="mission-device">
                <div className="device-inner">
                  <div className="device-header-pill"></div>
                  <div className="mission-text-content-v4">
                    <span className="mission-tag-v4">CHALLENGE 02</span>
                    <h2 className="mission-title-v4">OPPORTUNITIES</h2>
                    <div className="mission-divider"></div>
                    <p className="mission-desc-v4">
                      You’re ready to work, but opportunities are scarce, and doors close before you can show potential.
                    </p>
                    <button className="device-btn">OPEN DOORS</button>
                  </div>
                  <div className="device-home-button"></div>
                </div>
              </div>

              {/* Card 3: Readiness */}
              <div className="mission-device">
                <div className="device-inner">
                  <div className="device-header-pill"></div>
                  <div className="mission-text-content-v4">
                    <span className="mission-tag-v4">CHALLENGE 03</span>
                    <h2 className="mission-title-v4">READINESS</h2>
                    <div className="mission-divider"></div>
                    <p className="mission-desc-v4">
                      Corporate world demands more than skills; it requires professionalism, confidence, and network.
                    </p>
                    <button className="device-btn">GET READY</button>
                  </div>
                  <div className="device-home-button"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <img src={shadowImg} alt="" className="bg-deco-shadow bottom-left" />

        <section className="about-us-section landing-section">
          <div className="neu-texture-overlay"></div>
          <section className="about-premium-section" id="about">
            <div className="premium-side-text">
              THIS IS FULLY EDITABLE LANDING PAGE
            </div>

            <div className="premium-bg-elements">
              <div className="premium-blob blob-1"></div>
              <div className="premium-blob blob-2"></div>
              <div className="premium-shape-3d">A</div>
            </div>

            <div className="premium-about-container">
              {/* Left Content Side */}
              <div className="premium-about-left">
                <h2 className="premium-about-title">
                  Re<span>.</span>vamp
                </h2>
                <p className="premium-about-subtitle">your career game</p>

                <div className="premium-about-slider">
                  <div className="premium-slider-content">
                    <p className="premium-description">
                      {aboutFeatures[aboutSlideIndex].desc}
                    </p>
                  </div>
                  <div className="premium-slider-nav">
                    {aboutFeatures.map((_, idx) => (
                      <span
                        key={idx}
                        className={`premium-nav-dot ${aboutSlideIndex === idx ? 'active' : ''}`}
                        onClick={() => setAboutSlideIndex(idx)}
                      ></span>
                    ))}
                  </div>
                </div>

                <button className="premium-contact-btn">
                  Contact us
                </button>

                <div className="premium-files-hint">
                  <span className="hint-label">FILES:</span>
                  <div className="hint-icons">
                    <div className="hint-icon-box">Ps</div>
                    <div className="hint-icon-box">Bl</div>
                    <div className="hint-icon-box">Jpg</div>
                  </div>
                </div>
              </div>

              {/* Right Decorative Side */}
              <div className="premium-about-right">
                {/* Grid Module */}
                <div className="floating-module grid-module">
                  <div className="grid-overlay"></div>
                  <div className="grid-points">
                    <span className="point tl"><span className="p-icon"></span></span>
                    <span className="point tr"><span className="p-icon"></span></span>
                  </div>
                  <div className="grid-center-icon">
                    <span className="material-symbols-outlined">zoom_out_map</span>
                  </div>
                  <div className="grid-bottom-line">
                    <span className="point bl"></span>
                    <span className="point br"></span>
                  </div>
                </div>

                {/* Text Editor Module */}
                <div className="floating-module controllers-module">
                  <div className="controls-header">
                    <span className="c-icon">T</span>
                    <span className="c-icon italic">T</span>
                    <span className="c-icon bold">T</span>
                    <span className="c-icon">%</span>
                  </div>
                  <div className="controls-body">
                    <p className="skeleton-text-hint">Write something...</p>
                    <div className="skeleton-block"></div>
                  </div>
                </div>

                {/* Sliders Module */}
                <div className="floating-module sliders-module">
                  <div className="slider-item">
                    <span className="slider-label">Hue:</span>
                    <div className="slider-track"><div className="slider-thumb" style={{ left: '70%' }}></div></div>
                  </div>
                  <div className="slider-item">
                    <span className="slider-label">Brightness:</span>
                    <div className="slider-track"><div className="slider-thumb" style={{ left: '40%' }}></div></div>
                  </div>
                  <div className="slider-item">
                    <span className="slider-label">Saturation:</span>
                    <div className="slider-track"><div className="slider-thumb" style={{ left: '90%' }}></div></div>
                  </div>
                </div>

                {/* Color Palette Module */}
                <div className="floating-module color-palette-module">
                  <div className="palette-gradient"></div>
                  <div className="palette-picker"></div>
                </div>
              </div>
            </div>
          </section>
        </section>


        <section className="offer-section landing-section">
          <div className="neu-texture-overlay"></div>

          <div className="offer-header">
            <h2 className="section-title-v3">What we offer</h2>
            <p className="offer-subtitle">
              Our goal is to equip you with the skills, guidance, and connections to launch<br />
              your career."
            </p>
          </div>

          <div className="offer-grid">
            {/* Card 1 */}
            <div className="offer-card">
              <span className="material-symbols-outlined offer-icon-blue">lightbulb</span>
              <span className="offer-number">01</span>
              <h3 className="offer-card-title">1-on-1 Mentorship</h3>
              <p className="offer-card-text">
                Personalized guidance from industry experts to help you navigate your career path.
              </p>
            </div>

            {/* Card 2 */}
            <div className="offer-card">
              <span className="material-symbols-outlined offer-icon-blue">edit_square</span>
              <span className="offer-number">02</span>
              <h3 className="offer-card-title">Real-World Projects</h3>
              <p className="offer-card-text">
                Hands-on projects that build practical skills and strengthen your portfolio.
              </p>
            </div>

            {/* Card 3 */}
            <div className="offer-card">
              <span className="material-symbols-outlined offer-icon-blue">verified</span>
              <span className="offer-number">03</span>
              <h3 className="offer-card-title">Verified Certificates</h3>
              <p className="offer-card-text">
                Skill-backed certificates to showcase your achievements to employers.
              </p>
            </div>

            {/* Card 4 */}
            <div className="offer-card">
              <span className="material-symbols-outlined offer-icon-blue">computer</span>
              <span className="offer-number">04</span>
              <h3 className="offer-card-title">Referral Letters</h3>
              <p className="offer-card-text">
                Mentor-issued recommendations to support internship and job applications.
              </p>
            </div>

            {/* Card 5 */}
            <div className="offer-card">
              <span className="material-symbols-outlined offer-icon-blue">description</span>
              <span className="offer-number">05</span>
              <h3 className="offer-card-title">Career Guidance & Interview Prep</h3>
              <p className="offer-card-text">
                Resume reviews, mock interviews, and advice aligned with recruiter expectations.
              </p>
            </div>

            {/* Card 6 */}
            <div className="offer-card">
              <span className="material-symbols-outlined offer-icon-blue">forum</span>
              <span className="offer-number">06</span>
              <h3 className="offer-card-title">Recruitments & Opportunities</h3>
              <p className="offer-card-text">
                Connect with top companies and apply for internships and entry-level roles.
              </p>
            </div>
          </div>
        </section>

        <section className="mentors-section landing-section" id="mentors">
          <div className="neu-texture-overlay"></div>


          <div className="mentors-header">
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
                image: "https://ui-avatars.com/api/?name=Mentor&background=0D0D0D&color=fff",
                skills: ["React", "GraphQL", "Web"]
              }
            ].map((mentor, index) => (
              <div key={mentor.id} className="mentor-card-compact">
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
        <section className="get-hired-section landing-section">
          <div className="neu-texture-overlay"></div>

          <div className="growth-composition">
            {/* Background Decorative Elements */}
            <div className="growth-deco-text-v5">GROWTH</div>

            <div className="growth-deco-elements">
              {/* 3 Gears as in reference */}
              <div className="deco-gear gg-1">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <div className="deco-gear gg-2">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <div className="deco-gear gg-3">
                <span className="material-symbols-outlined">settings</span>
              </div>

              {/* Decorative Squares / Blocks */}
              <div className="deco-square gs-1"></div>
              <div className="deco-square gs-2"></div>
              <div className="deco-square gs-3"></div>

              {/* Skeleton UI (Top-Right and Bottom-Left) */}
              <div className="growth-skeleton-group sk-top-right">
                <div className="sk-line"></div>
                <div className="sk-line"></div>
                <div className="sk-line"></div>
              </div>

              <div className="growth-skeleton-group sk-bottom-left">
                <div className="sk-line"></div>
                <div className="sk-line"></div>
                <div className="sk-line"></div>
              </div>

              {/* Dot Indicators Column (Matches Image Far Right) */}
              <div className="growth-dots-col">
                <div className="g-dot"></div>
                <div className="g-dot"></div>
                <div className="g-dot active"></div>
                <div className="g-dot"></div>
                <div className="g-dot"></div>
              </div>

              {/* Single Central Blue Dot (Matches Image) */}
              <div className="growth-single-dot"></div>

              {/* Decorative Spark (Matches Image Bottom Right) */}
              <div className="growth-spark-deco">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>

              {/* Central Device Shape (Translucent Backdrop) */}
              <div className="growth-device-backdrop"></div>

              {/* Only 1 Metric: TRENDING (Top-Left of Card) */}
              <div className="growth-metric m-trending">
                <div className="metric-neu">
                  <span className="material-symbols-outlined">trending_up</span>
                  <div className="metric-info">
                    <span className="m-label">Trending</span>
                    <span className="m-val">+24%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-header-v3">
              <h2 className="section-title-v3">Career Growth Opportunities</h2>
              <p className="section-subtitle-v3">Take the next step in your professional journey with our tailored programs.</p>
            </div>
            <div className="get-hired-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-hired">
                  <span className="material-symbols-outlined">rocket_launch</span>
                </div>
                <h3 className="feature-title">Get Hired Instantly</h3>
                <p className="feature-desc">
                  Join our exclusive placement program and get direct referrals to top tech firms. Fast-track your career with our network.
                </p>
                <button className="feature-btn btn-hired" onClick={() => navigate('/explore')}>Apply for Referrals</button>
              </div>

              <div className="feature-card">
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
          </div>
        </section>







        {/* ... navbar ... */}

        {/* ... hero section ... */}
















        <section className="unified-footer-frame landing-section landing-section-v2" id="testimonials">
          <div className="neu-texture-overlay"></div>





          {/* Success Stories Component */}
          <div className="neu-section-header">
            <div className="neu-section-tag">Success Stories</div>
            <h2 className="neu-section-title">Hear From Our Community</h2>
            <p className="neu-section-desc">
              Real stories from people who transformed their careers through
              meaningful mentorship.
            </p>
          </div>

          <div className="success-stories-grid">
            {careerGuidanceTestimonials.slice(0, 3).map((story, idx) => (
              <div key={story.id} className="neu-story-card-wrapper">
                <div className="neu-story-card">
                  <div className="neu-quote-circle">
                    <span className="material-symbols-outlined">format_quote</span>
                  </div>

                  <div className="neu-story-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined icon-filled">star</span>
                    ))}
                  </div>

                  <p className="neu-story-quote-txt">"{story.quote}"</p>

                  <div className="neu-story-divider"></div>

                  <div className="neu-story-footer">
                    <div className="neu-story-avatar-group">
                      <div className="neu-story-avatar-neu">
                        <img src={story.mentorImage} alt={story.mentorName} />
                      </div>
                    </div>
                    <div className="neu-footer-info">
                      <span className="neu-footer-name">{story.mentorName}</span>
                      <span className="neu-footer-role">{story.mentorRole}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


      </main >

      <footer className="footer-v2">
        <div className="footer-container-v2">
          <div className="neumorphic-footer-card">
            <div className="footer-top-v2">
              <div className="footer-brand-col">
                <div className="footer-logo-group">
                  <div className="footer-logo-outer">
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>auto_awesome</span>
                  </div>
                  <h2 className="footer-logo-txt">Internify</h2>
                </div>
                <p className="footer-brand-desc">
                  Empowering growth through meaningful mentorship connections worldwide.
                  Helping students find clarity and launch careers.
                </p>
                <div className="footer-social-neu">
                  <button className="neu-social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  <button className="neu-social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.98 0 1.778-.773 1.778-1.729V1.729C24 .774 23.205 0 22.225 0z" />
                    </svg>
                  </button>
                  <button className="neu-social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="footer-links-row">
                <div className="footer-links-col">
                  <h4>Platform</h4>
                  <ul className="footer-links-list">
                    <li onClick={() => navigate('/explore')}>Find a Mentor</li>
                    <li onClick={() => navigate('/mentors')}>Become a Mentor</li>
                    <li onClick={() => navigate('/explore')}>Browse Topics</li>
                    <li onClick={() => navigate('/explore')}>Pricing</li>
                  </ul>
                </div>
                <div className="footer-links-col">
                  <h4>Company</h4>
                  <ul className="footer-links-list">
                    <li>About Us</li>
                    <li>Careers</li>
                    <li>Blog</li>
                    <li>Press</li>
                  </ul>
                </div>
                <div className="footer-links-col">
                  <h4>Support</h4>
                  <ul className="footer-links-list">
                    <li>Help Center</li>
                    <li>Contact</li>
                    <li>Privacy Policy</li>
                    <li>Terms</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="neu-footer-divider"></div>

            <div className="footer-bottom-neu">
              <p className="footer-copy-neu">© 2026 Internify. All rights reserved.</p>
              <p className="footer-made-neu">Made with <span>❤</span> for mentors and mentees everywhere</p>
            </div>
          </div>
        </div>
      </footer>
      <CourseModal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} />
    </div >
  )
}
