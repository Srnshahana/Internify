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
import worldmapImg from '../../assets/images/worldmap.jpg'
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
// Category data with icons
// Featured Programs Data
const featuredPrograms = [
  {
    id: 'fp-1',
    title: 'Artificial Intelligence & Machine Learning',
    category: 'Future Tech',
    growthStat: '7x job growth',
    badge: 'Most Popular',
    ribbon: 'Free access until 30/06/2026',
    tags: ['Python', 'Neural Nets', 'ChatGPT', 'TensorFlow'],
    image: aiCourseImg,
    accentColor: '#5b8dee'
  },
  {
    id: 'fp-2',
    title: 'Digital Marketing & AI Strategy',
    category: 'AI Strategy',
    growthStat: '443% skill demand growth',
    badge: 'Trending',
    ribbon: 'Enroll before 15/05/2026',
    tags: ['SEO', 'Analytics', 'Ad Campaigns', 'Content AI'],
    image: digitalMarketingImg,
    accentColor: '#e05fa0'
  },
  {
    id: 'fp-3',
    title: 'Ethical Hacking and Cyber Security',
    category: 'Digital Security',
    growthStat: '4M+ job shortage',
    badge: 'High Demand',
    ribbon: 'Limited seats — act fast',
    tags: ['Penetration Testing', 'Linux', 'OSINT', 'Firewalls'],
    image: ethicalHackingImg,
    accentColor: '#2abfa3'
  },
  {
    id: 'fp-4',
    title: 'Data Science & Analytics',
    category: 'Data Intelligence',
    growthStat: '35% faster career growth',
    badge: 'New',
    ribbon: 'Batch starting 01/04/2026',
    tags: ['SQL', 'Python', 'Tableau', 'Statistics'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    accentColor: '#f59e42'
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
  },
  {
    id: 5,
    mentorImage: testimonial3,
    mentorName: 'Ryan Foster',
    mentorRole: 'Software Engineer @ Meta',
    quote: 'Internify gave me structured guidance that transformed my coding interviews. I went from constant rejections to landing offers at top tech companies.',
    studentName: 'Ryan Foster',
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
        <section className="hero-section-neu" id="home">
          <div className="neu-hero-container reveal reveal-up">
            <div className="neu-hero-content">
              <span className="neu-hero-label">INTERNIFY ECOSYSTEM</span>
              <h1 className="neu-hero-title">
                Grow Your Career <br />
                <span>th Expert Mentors</span>
              </h1>
              <p className="neu-hero-subtitle">
                {/* The global network for growth. Connecting students with
                experienced mentors for direction and clarity. */}
                A global network built for growth. We connect students with industry mentors who bring 5+ years of real-world experience, so you gain practical skills that truly prepare you for your career.
              </p>

              {/* Neumorphic Search Bar */}
              <div className="neu-search-container">
                <div className="neu-search-box">
                  <span className="material-symbols-outlined neu-search-icon">search</span>
                  <input
                    type="text"
                    placeholder="Search mentors, skills..."
                    // className="hero-input-v3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="neu-search-input"
                  />
                  <button className="neu-btn-search" onClick={handleSearch}>Search</button>
                </div>
              </div>

              <div className="neu-hero-actions">
                <button className="neu-btn-primary" onClick={() => navigate('/explore')}>
                  Browse Mentors
                </button>
                <button className="neu-btn-secondary" onClick={() => setIsCourseModalOpen(true)}>
                  Explore Courses
                </button>
              </div>
            </div>

            <div className="neu-hero-visual-v5">
              <div className="neu-global-network">
                {/* Neumorphic Embossed Map */}
                <div className="neu-map-wrapper">
                  <img src={worldmapImg} alt="World Map" className="neu-embossed-map" />
                </div>

                {/* SVG lines — viewBox 0 0 100 100 = % space, preserveAspectRatio none to match container */}
                <svg className="neu-connection-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* NA (20,44) → EU (43,39) */}
                  <path d="M 20,44 Q 28,25 43,39" className="neu-line-path" />
                  {/* EU (43,39) → AS (67,44) */}
                  <path d="M 43,39 Q 55,58 67,44" className="neu-line-path" />
                  {/* AS (67,44) → JP (80,33) */}
                  <path d="M 67,44 Q 75,24 80,33" className="neu-line-path" />
                  {/* EU (43,39) → SA (37,72) */}
                  <path d="M 43,39 Q 40,60 37,72" className="neu-line-path" />
                  {/* NA (20,44) → SA (37,72) */}
                  <path d="M 20,44 Q 25,62 37,72" className="neu-line-path" />
                  {/* AS (67,44) → SA (37,72) */}
                  <path d="M 67,44 Q 55,65 37,72" className="neu-line-path" />
                </svg>

                {/* Glowing Nodes — % positions matching SVG coordinates */}
                <div className="neu-glow-node" style={{ top: '44%', left: '20%' }}></div>  {/* NA */}
                <div className="neu-glow-node" style={{ top: '39%', left: '43%' }}></div>  {/* EU */}
                <div className="neu-glow-node" style={{ top: '44%', left: '67%' }}></div>  {/* AS */}
                <div className="neu-glow-node" style={{ top: '33%', left: '80%' }}></div>  {/* JP */}
                <div className="neu-glow-node" style={{ top: '72%', left: '37%' }}></div>  {/* SA */}

                {/* Profile Cards — appear just above/beside corresponding node */}
                <div className="neu-profile-card card-alex" style={{ top: '24%', left: '8%' }}>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Alex C" className="avatar-small" />
                  <div className="card-info">
                    <span className="card-name">Alex C.</span>
                    <span className="card-role">AI Engineer</span>
                  </div>
                </div>

                <div className="neu-profile-card card-sarah" style={{ top: '52%', left: '35%' }}>
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Sarah K" className="avatar-small" />
                  <div className="card-info">
                    <span className="card-name">Sarah K.</span>
                    <span className="card-role">Cybersecurity Expert</span>
                  </div>
                </div>

                <div className="neu-profile-card card-kenji" style={{ top: '15%', left: '65%' }}>
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Kenji T" className="avatar-small" />
                  <div className="card-info">
                    <span className="card-name">Kenji T.</span>
                    <span className="card-role">Data Scientist</span>
                  </div>
                </div>

                <div className="neu-profile-card card-priya" style={{ top: '77%', left: '42%' }}>
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Priya S" className="avatar-small" />
                  <div className="card-info">
                    <span className="card-name">Priya S.</span>
                    <span className="card-role">Product Manager</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-programs-section landing-section" id="courses">

          <div className="featured-header">
            <div className="featured-text-group">
              <span className="offer-tag-pill">CURATED COURSES</span>
              <h2 className="offer-title">
                Our <span className="offer-title-accent">Featured Courses</span>
              </h2>
              <p className="offer-subtitle">
                Explore the top courses built on skills that remain relevant for decades.
                Future-proof your career with knowledge that stands the test of time.
              </p>
            </div>
            <div className="view-all-container">
              <span className="view-all-text" onClick={() => navigate('/explore')}>
                View All courses <span className="material-symbols-outlined icon-inline">arrow_forward</span>
              </span>
            </div>
          </div>

          <div className="featured-grid-new">
            {featuredPrograms.map((program) => (
              <div key={program.id} className="fc-card">

                {/* ── Top image block ── */}
                <div className="fc-image-block" style={{ background: program.accentColor }}>
                  <img src={program.image} alt={program.title} className="fc-img" />
                  {/* Badge top-right */}
                  <span className="fc-badge">{program.badge}</span>
                  {/* Ribbon at bottom of image */}
                  <div className="fc-ribbon">{program.ribbon}</div>
                </div>

                {/* ── Bottom info block ── */}
                <div className="fc-body">
                  <div className="fc-title-row">
                    <h3 className="fc-title">{program.title}</h3>
                    <span className="fc-cta" onClick={() => navigate('/explore')}>
                      Enroll Now ↗
                    </span>
                  </div>
                  {/* <div className="fc-tags">
                    {program.tags.map((tag) => (
                      <span key={tag} className="fc-tag">{tag}</span>
                    ))}
                  </div> */}
                </div>

              </div>
            ))}
          </div>
        </section>



        <img src={shadowImg} alt="" className="bg-deco-shadow bottom-left" />

        <section className="about-premium-section" id="about">

          {/* Background blobs */}
          <div className="premium-bg-elements">
            <div className="premium-blob blob-1"></div>
            <div className="premium-blob blob-2"></div>
          </div>

          {/* Structural Neumorphic 'A' shape — Matches reference image depth and cutouts */}
          <div className="premium-shape-3d-wrapper">
            <div className="premium-a-structural-container">
              <div className="shape-a-main">
                <div className="shape-a-cutout-top"></div>
                <div className="featured-header-premium">
                  <div className="featured-text-group-premium">
                    <span className="featured-tag-pill">ABOUT US</span>
                    <h2 className="h2-premium">
                      Elevate Your <span className="text-gradient-blue">Professional Brand</span>
                    </h2>
                    <p className="featured-desc-premium">
                      Internify helps you transform your professional journey with precision-guided
                      mentorship and industry-standard training modules.
                    </p>
                  </div>
                </div>
                <div className="shape-a-cutout-bottom"></div>
              </div>
            </div>
          </div>

          <div className="premium-about-container">
            {/* Left Content Side */}
            <div className="premium-about-left">
              <p className="premium-description">
                Level up your skills with a platform designed for the modern ambitious talent.
                Connect with mentors who have walked the path you're on and gain the
                insights that only experience can provide.
              </p>

              <div className="premium-slider-nav">
                <div className="premium-nav-dot active"></div>
                <div className="premium-nav-dot"></div>
                <div className="premium-nav-dot"></div>
              </div>

              <button className="premium-contact-btn">
                Contact us
              </button>

              <div className="about-social-hint">
                <span className="hint-label">FOLLOW US:</span>
                <div className="hint-icons">
                  <div className="social-icon-box twitter-box" title="Twitter">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  </div>
                  <div className="social-icon-box instagram-box" title="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <div className="social-icon-box telegram-box" title="Telegram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.21 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                  </div>
                  <div className="social-icon-box linkedin-box" title="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                  <div className="social-icon-box facebook-box" title="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Decorative Side - Matches reference image composition */}
            <div className="premium-about-right">

              {/* Reference Element 1: Floating Grid Overlay */}
              <div className="floating-ui-grid">
                <div className="grid-corner tl"></div>
                <div className="grid-corner tr"></div>
                <div className="grid-corner bl"></div>
                <div className="grid-corner br"></div>
                <div className="grid-center-cursor">
                  <span className="material-symbols-outlined">open_with</span>
                </div>
              </div>

              {/* Reference Element 2: Top Header Bar (T T T %) */}
              <div className="floating-module premium-header-bar">
                <div className="bar-controls">
                  <span className="material-symbols-outlined active-icon">analytics</span>
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span className="material-symbols-outlined">verified</span>
                  <span className="hint-percent">100%</span>
                </div>
                <div className="bar-content-rich">
                  <p className="bar-main-text">Path: Senior Data Architect</p>
                  <div className="bar-tags">
                    <span className="b-tag">Python</span>
                    <span className="b-tag">SQL</span>
                    <span className="b-tag">Cloud</span>
                  </div>
                </div>
              </div>

              {/* New Career Element: Live Session Pill */}
              <div className="floating-module premium-live-session">
                <div className="live-indicator"></div>
                <span className="live-text">LIVE: Figma Workshop</span>
              </div>

              {/* New Career Element: Goal Progress Card */}
              <div className="floating-module premium-goal-card">
                <div className="goal-header">
                  <span className="material-symbols-outlined goal-icon">flag</span>
                  <span className="goal-label">CAREER READINESS</span>
                </div>
                <div className="goal-progress-wrap">
                  <div className="goal-progress-bar" style={{ width: '65%' }}></div>
                </div>
                <span className="goal-pct">65% Achieved</span>
              </div>

              {/* Reference Element 3: Settings/Slider Panel (Right Edge) */}
              <div className="floating-module premium-slider-panel">
                <div className="slider-row">
                  <p className="s-label">Hue</p>
                  <div className="s-track"><div className="s-thumb" style={{ left: '70%' }}></div></div>
                </div>
                <div className="slider-row">
                  <p className="s-label">Brightness</p>
                  <div className="s-track"><div className="s-thumb" style={{ left: '40%' }}></div></div>
                </div>
                <div className="slider-row">
                  <p className="s-label">Saturation</p>
                  <div className="s-track"><div className="s-thumb" style={{ left: '90%' }}></div></div>
                </div>
              </div>

              {/* Reference Element 4: Color Gradient Card (Bottom Right) */}
              <div className="floating-module premium-color-card">
                <div className="color-gradient-surface">
                  <div className="selector-dot"></div>
                </div>
              </div>

              {/* Original Career Context (Hidden behind or integrated if needed) */}
              <div className="career-context-modules" style={{ display: 'none' }}>
                <div className="floating-module career-linkedin-module"></div>
                <div className="floating-module career-resume-module"></div>
              </div>

            </div>
          </div>
        </section>




        <section className="mission-section landing-section" id="mission">
          <div className="neu-texture-overlay"></div>
          <div className="mission-bg-blobs">
            <div className="mission-blob blob-1"></div>
            <div className="mission-blob blob-2"></div>
            <div className="mission-blob blob-3"></div>
          </div>

          <div className="mission-composition">
            {/* Big watermark text */}
            <div className="mission-deco-text-v4">GROWTH</div>


            {/* Section label above cards */}
            <div className="growth-section-header">
              <span className="featured-tag-pill">CAREER GROWTH</span>
              <h2 className="h2-premium">
                Your Path to <span className="text-gradient-blue">Career Success</span>
              </h2>
              <p className="featured-desc-premium">
                Three opportunity pillars that take you from where you are to where you want to be.
              </p>
            </div>

            {/* 3 Neumorphic Growth Cards */}
            <div className="mission-device-grid">

              {/* Card 1 — blue */}
              <div className="mission-device growth-card-1">
                <div className="gc-icon-wrap">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <h3 className="gc-title">No Real-World Experience ?</h3>
                <p className="gc-desc">
                  Gain real hands-on experience through guided internships and live projects that bridge theory and industry practice.
                </p>
                <div className="gc-bottom-tab"></div>
              </div>

              {/* Card 2 — pink */}
              <div className="mission-device growth-card-2">
                <div className="gc-icon-wrap">
                  <span className="material-symbols-outlined">hub</span>
                </div>
                <h3 className="gc-title">	No Internship Opportunities ?</h3>
                <p className="gc-desc">
                  Unlock access to curated job opportunities, recruiters, and an ever-growing community of professionals ready to sponsor your growth.
                </p>
                <div className="gc-bottom-tab"></div>
              </div>

              {/* Card 3 — teal */}
              <div className="mission-device growth-card-3">
                <div className="gc-icon-wrap">
                  <span className="material-symbols-outlined">military_tech</span>
                </div>
                <h3 className="gc-title">Unprepared for Job Market ?</h3>
                <p className="gc-desc">
                  Sharpen interview skills, build a standout portfolio, and acquire the professionalism and confidence every recruiter looks for.
                </p>
                <div className="gc-bottom-tab"></div>
              </div>

            </div>

          </div>
        </section>






        <section className="offer-section landing-section">
          <div className="neu-texture-overlay"></div>
          <div className="offer-bg-blobs">
            <div className="offer-blob ob-1"></div>
            <div className="offer-blob ob-2"></div>
            <div className="offer-blob ob-3"></div>
          </div>

          {/* Header */}
          <div className="featured-header-premium">
            <div className="featured-text-group-premium">
              <span className="featured-tag-pill">WHAT WE OFFER</span>
              <h2 className="h2-premium">
                Everything You Need to <br />
                <span className="text-gradient-blue">Launch Your Career</span>
              </h2>
              <p className="featured-desc-premium">
                From mentorship to placement — every tool, connection, and
                certification to take you from learner to professional.
              </p>
            </div>
          </div>

          {/* ── Flow block 1: items 01, 02, 03 ── */}
          <div className="offer-flow-block">

            {/* SVG S-curve connector — blue→purple→pink */}
            <svg
              className="offer-flow-svg"
              viewBox="0 0 900 180"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="ofg1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <marker id="arr1" markerWidth="10" markerHeight="8"
                  refX="9" refY="4" orient="auto">
                  <polygon points="0 0, 10 4, 0 8" fill="#ec4899" />
                </marker>
              </defs>
              {/* S-curve: arc over C1, dip under to C2, arc up to C3 */}
              <path
                d="M 70,90 C 70,0 230,0 230,90 C 230,180 370,180 450,90 C 530,0 670,0 750,60"
                stroke="url(#ofg1)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                markerEnd="url(#arr1)"
              />
            </svg>

            {/* Item 01 */}
            <div className="offer-flow-item">
              <div className="offer-flow-circle ofc-ring-solid-blue">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div className="offer-flow-info">
                <span className="offer-flow-num ofn-blue">OFFER 01</span>
                <h3 className="offer-flow-title">1-on-1 Mentorship</h3>
                <p className="offer-flow-desc">Personalized guidance from industry experts to navigate your career path with confidence.</p>
              </div>
            </div>

            {/* Item 02 */}
            <div className="offer-flow-item">
              <div className="offer-flow-circle ofc-ring-dash-purple">
                <span className="material-symbols-outlined">edit_square</span>
              </div>
              <div className="offer-flow-info">
                <span className="offer-flow-num ofn-purple">OFFER 02</span>
                <h3 className="offer-flow-title">Real-World Projects</h3>
                <p className="offer-flow-desc">Hands-on projects that build practical skills and strengthen your professional portfolio.</p>
              </div>
            </div>

            {/* Item 03 */}
            <div className="offer-flow-item">
              <div className="offer-flow-circle ofc-ring-dash-pink">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div className="offer-flow-info">
                <span className="offer-flow-num ofn-pink">OFFER 03</span>
                <h3 className="offer-flow-title">Verified Certificates</h3>
                <p className="offer-flow-desc">Skill-backed certificates recognised by employers — prove what you know.</p>
              </div>
            </div>

          </div>

          {/* ── Flow block 2: items 04, 05, 06 ── */}
          <div className="offer-flow-block">

            {/* SVG S-curve connector — cyan→blue→purple */}
            <svg
              className="offer-flow-svg"
              viewBox="0 0 900 180"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="ofg2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <marker id="arr2" markerWidth="10" markerHeight="8"
                  refX="9" refY="4" orient="auto">
                  <polygon points="0 0, 10 4, 0 8" fill="#7c3aed" />
                </marker>
              </defs>
              <path
                d="M 70,90 C 70,0 230,0 230,90 C 230,180 370,180 450,90 C 530,0 670,0 750,60"
                stroke="url(#ofg2)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                markerEnd="url(#arr2)"
              />
            </svg>

            {/* Item 04 */}
            <div className="offer-flow-item">
              <div className="offer-flow-circle ofc-ring-solid-cyan">
                <span className="material-symbols-outlined">forward_to_inbox</span>
              </div>
              <div className="offer-flow-info">
                <span className="offer-flow-num ofn-cyan">OFFER 04</span>
                <h3 className="offer-flow-title">Referral Letters</h3>
                <p className="offer-flow-desc">Mentor-issued recommendations that open doors to internships and entry-level roles.</p>
              </div>
            </div>

            {/* Item 05 */}
            <div className="offer-flow-item">
              <div className="offer-flow-circle ofc-ring-dash-blue">
                <span className="material-symbols-outlined">record_voice_over</span>
              </div>
              <div className="offer-flow-info">
                <span className="offer-flow-num ofn-blue">OFFER 05</span>
                <h3 className="offer-flow-title">Interview Prep</h3>
                <p className="offer-flow-desc">Mock interviews and recruiter-aligned advice so you perform at your absolute best.</p>
              </div>
            </div>

            {/* Item 06 */}
            <div className="offer-flow-item">
              <div className="offer-flow-circle ofc-ring-dash-purple">
                <span className="material-symbols-outlined">hub</span>
              </div>
              <div className="offer-flow-info">
                <span className="offer-flow-num ofn-purple">OFFER 06</span>
                <h3 className="offer-flow-title">Recruitments & Network</h3>
                <p className="offer-flow-desc">Connect with top companies and an ever-growing network of industry leaders.</p>
              </div>
            </div>

          </div>
        </section>


        <section className="mentors-section landing-section" id="mentors">



          <div className="neu-texture-overlay"></div>


          <div className="featured-header-premium">
            <div className="featured-text-group-premium">
              <span className="featured-tag-pill">EXPERT GUIDANCE</span>
              <h2 className="h2-premium">
                Professional <span className="text-gradient-blue">Mentors</span>
              </h2>
              <p className="featured-desc-premium">
                Our mentors are industry experts with 5+ years of real-world
                experience, providing practical guidance and insights to help
                you succeed in your career.
              </p>
              <div className="view-all-container-premium">
                <span className="featured-view-all-btn" onClick={() => navigate('/mentors')}>
                  View All Mentors <span className="material-symbols-outlined">arrow_forward</span>
                </span>
              </div>
            </div>
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
              <div key={mentor.id} className="mentor-card-premium">
                {/* Top Area - Refined Image Container */}
                <div className="mentor-card-top">
                  <div className="mentor-card-rating">
                    <span className="material-symbols-outlined star-icon">star</span>
                    {mentor.rating}.0
                  </div>
                  <img src={mentor.image} alt={mentor.name} className="mentor-card-img" />
                </div>

                {/* Body - Clean Aesthetic */}
                <div className="mentor-card-body">
                  <div className="mentor-card-header">
                    <h3 className="mentor-card-name">
                      {mentor.name}
                      <span className="material-symbols-outlined verified-badge">check_circle</span>
                    </h3>
                  </div>

                  <p className="mentor-card-bio">
                    {mentor.role} who focuses on simplicity & usability at {mentor.company}.
                  </p>

                  <div className="mentor-card-footer-stats">
                    <div className="stats-info">
                      <div className="stat-item">
                        <span className="material-symbols-outlined">person</span>
                        312
                      </div>
                      <div className="stat-item">
                        <span className="material-symbols-outlined">assignment_turned_in</span>
                        48
                      </div>
                    </div>
                    <button className="mentor-follow-btn">
                      Follow +
                    </button>
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
              {/* 5 Gears as in reference */}
              <div className="deco-gear gg-1">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <div className="deco-gear gg-2">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <div className="deco-gear gg-3">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <div className="deco-gear gg-4">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <div className="deco-gear gg-5">
                <span className="material-symbols-outlined">settings</span>
              </div>

              {/* Decorative Squares / Blocks */}
              <div className="deco-square gs-1"></div>
              <div className="deco-square gs-2"></div>
              <div className="deco-square gs-3"></div>
              <div className="deco-square gs-4"></div>
              <div className="deco-square gs-5"></div>
              <div className="deco-square gs-6"></div>

              {/* Small Decorative Boxes */}
              <div className="gs-box gs-box-1"></div>
              <div className="gs-box gs-box-2"></div>
              <div className="gs-box gs-box-3"></div>
              <div className="gs-box gs-box-4"></div>

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
                    <span className="m-label">Growth</span>
                    <span className="m-val">+24%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="featured-header-premium" style={{ marginBottom: '3rem' }}>
              <div className="featured-text-group-premium">
                <span className="featured-tag-pill">OPPORTUNITIES</span>
                <h2 className="h2-premium">
                  Career Growth <span className="text-gradient-blue">Opportunities</span>
                </h2>
                <p className="featured-desc-premium">
                  Take the next step in your professional journey with our tailored programs.
                </p>
              </div>
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
          <div className="featured-header-premium" style={{ marginBottom: '4rem' }}>
            <div className="featured-text-group-premium">
              <span className="featured-tag-pill">SUCCESS STORIES</span>
              <h2 className="h2-premium">
                Hear From Our <span className="text-gradient-blue">Community</span>
              </h2>
              <p className="featured-desc-premium">
                Real stories from people who transformed their careers through meaningful mentorship.
              </p>
            </div>
          </div>

          <div className="ref-testimonials-grid">
            {careerGuidanceTestimonials.map((story, idx) => {
              // Blue shades: deep → sky → mid → pale → indigo → cyan
              const accentGradients = [
                'linear-gradient(135deg, #1e40af, #3b82f6)',
                'linear-gradient(135deg, #0369a1, #0ea5e9)',
                'linear-gradient(135deg, #1d4ed8, #60a5fa)',
                'linear-gradient(135deg, #0284c7, #38bdf8)',
                'linear-gradient(135deg, #1e3a8a, #2563eb)',
                'linear-gradient(135deg, #075985, #0ea5e9)',
              ]
              const accentColors = ['#3b82f6', '#0ea5e9', '#60a5fa', '#38bdf8', '#2563eb', '#06b6d4']
              const numbers = ['01', '02', '03', '04', '05', '06']
              const isEven = idx % 2 === 1  // even index → cap at bottom

              return (
                <div
                  key={story.id}
                  className={`ref-card-wrapper ${isEven ? 'ref-card-lower' : 'ref-card-raised'}`}
                >
                  <div className="ref-neu-card">

                    {/* TOP cap — only for odd cards (01, 03) */}
                    {!isEven && (
                      <div className="ref-cap ref-cap-top" style={{ background: accentGradients[idx] }} />
                    )}

                    <div className="ref-card-body">
                      {/* Large light-gray number */}
                      <span className="ref-card-number">{numbers[idx]}</span>

                      {/* Colored mentor name label */}
                      <p className="ref-card-label" style={{ color: accentColors[idx] }}>
                        {story.mentorName}
                      </p>

                      {/* Dotted rule in accent color */}
                      <div className="ref-card-rule" style={{ borderColor: accentColors[idx] }} />

                      {/* Stars */}
                      <div className="ref-card-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined icon-filled ref-star">star</span>
                        ))}
                      </div>

                      {/* Quote text */}
                      <p className="ref-card-quote">{story.quote}</p>

                      {/* Avatar footer */}
                      <div className="ref-card-footer">
                        <div className="ref-card-avatar">
                          <img src={story.mentorImage} alt={story.mentorName} />
                        </div>
                        <div>
                          <p className="ref-card-footer-name">{story.mentorName}</p>
                          <p className="ref-card-footer-role">{story.mentorRole}</p>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM cap — only for even cards (02, 04) */}
                    {isEven && (
                      <div className="ref-cap ref-cap-bottom" style={{ background: accentGradients[idx] }} />
                    )}

                  </div>
                </div>
              )
            })}
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
