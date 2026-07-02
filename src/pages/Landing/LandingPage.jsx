import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RingsIcon, BadgeCheckIcon, ArrowBackIcon, ArrowForwardIcon, ResumeIcon } from '../../components/Icons.jsx'
import { getAuthenticatedUser, clearAuthData, getStoredAuthData } from '../../utils/auth.js'
// Hero section images removed as assets - using inline styles or URLs if needed
import Loading from '../../components/Loading';
import CourseModal from '../../components/CourseModal';
import supabase from '../../supabaseClient'
import dashboardImg from '../../assets/images/dashboard.png'
import classroomImg from '../../assets/images/clasroom.png'
import ethicalHackingImg from '../../assets/images/ethicalhacking.jpg'
import featMentors from '../../assets/images/feature-mentors.png'
import featCareer from '../../assets/images/feature-career.png'

import aiVideo from '../../assets/video/ai&machine learning.mp4'
import cyberVideo from '../../assets/video/cybersecurity.mp4'
import dataScienceVideo from '../../assets/video/datascience.mp4'
import digitalMarketingVideo from '../../assets/video/digitalmarketing.mp4'
import heroVideoUrl from '../../assets/video/herovideo.mp4'
// Category data with icons
// Featured Programs Data
const featuredPrograms = [
  {
    id: 'fp-3',
    title: 'Digital Security Specialist',
    category: 'Mobile Template',
    growthStat: '4M+ job shortage',
    badge: 'High Demand',
    ribbon: 'Limited seats — act fast',
    tags: ['Penetration Testing', 'Linux', 'OSINT', 'Firewalls'],
    image: ethicalHackingImg,
    video: cyberVideo,
    accentColor: '#2abfa3'
  },
  {
    id: 'fp-1',
    title: 'Artificial Intelligence & Machine Learning',
    category: 'Future Tech',
    growthStat: '7x job growth',
    badge: 'Most Popular',
    ribbon: 'Free access until 30/06/2026',
    tags: ['Python', 'Neural Nets', 'ChatGPT', 'TensorFlow'],
    image: dashboardImg,
    video: aiVideo,
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
    image: classroomImg,
    video: digitalMarketingVideo,
    accentColor: '#e05fa0'
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
    video: dataScienceVideo,
    accentColor: '#f59e42'
  }
]
const stitchFeatures = [
  {
    id: 'feat-1',
    title: '5+ Year Experienced Mentors',
    label: 'EXPERT GUIDANCE',
    type: 'easy-edits',
    description: 'Learn directly from industry experts with 5+ years of hands-on experience in their respective fields.',
    Icon: ResumeIcon,
    size: 'large'
  },
  {
    id: 'feat-2',
    title: '1-on-1 Guidance & Flexibility',
    label: 'PERSONALIZED LEARNING',
    type: 'guidance',
    description: 'Work on real-world projects with personal mentorship to bridge the theory-practice gap.',
    Icon: RingsIcon,
    image: featMentors,
    size: 'small'
  },
  {
    id: 'feat-3',
    title: 'Verified Certificates and Direct Referrals',
    label: 'CAREER ACCELERATION',
    type: 'verified',
    description: 'Earn industry-recognized certificates and personalized referral letters for your career.',
    Icon: BadgeCheckIcon,
    image: null,
    size: 'small'
  },
  {
    id: 'feat-4',
    title: 'Career Support',
    label: 'END-TO-END SUPPORT',
    type: 'accelerator',
    description: 'Get exclusive networking opportunities, mock interview prep, and end-to-end recruitment support.',
    image: featCareer,
    promptBar: true, /* Custom Visual for Stitch Design Mirror */
    size: 'large'
  }
];


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
const mentorsList = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Senior UX Designer",
    company: "Google",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    experience: "8+ Yrs Exp",
    mentees: "120+",
    about:
      "Sarah has over eight years of experience designing intuitive digital experiences for enterprise products used by millions of users worldwide. She specializes in user research, design systems, and accessibility, helping designers create products that are both visually compelling and highly functional."
  },
  {
    id: 2,
    name: "David Chen",
    role: "Staff Engineer",
    company: "Netflix",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    experience: "10+ Yrs Exp",
    mentees: "85+",
    about:
      "David is a seasoned software engineer with more than a decade of experience building highly scalable microservices and distributed systems. He enjoys mentoring developers on system design, backend architecture, and engineering best practices for large-scale applications."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "Airbnb",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    experience: "6+ Yrs Exp",
    mentees: "200+",
    about:
      "Emily is an experienced product leader who has guided cross-functional teams in building customer-centric products from idea to launch. She specializes in product strategy, agile methodologies, and data-driven decision-making, helping aspiring product managers develop impactful careers."
  },
  {
    id: 4,
    name: "Michael Chang",
    role: "Frontend Lead",
    company: "Meta",
    image: "https://ui-avatars.com/api/?name=Mentor&background=0D0D0D&color=fff",
    rating: 4.7,
    experience: "7+ Yrs Exp",
    mentees: "150+",
    about:
      "Michael has extensive experience leading frontend teams and building scalable web applications using modern JavaScript frameworks. He is passionate about performance optimization, clean architecture, and helping developers master React and frontend engineering principles."
  },
  {
    id: 5,
    name: "Jessica Lee",
    role: "Data Scientist",
    company: "Amazon",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    experience: "9+ Yrs Exp",
    mentees: "95+",
    about:
      "Jessica specializes in machine learning, predictive analytics, and big data infrastructure. With nearly a decade of industry experience, she has worked on developing intelligent systems that transform complex data into actionable insights and enjoys mentoring professionals entering the field of data science."
  },
  {
    id: 6,
    name: "Robert Fox",
    role: "Backend Developer",
    company: "Stripe",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    experience: "5+ Yrs Exp",
    mentees: "300+",
    about:
      "Robert is a backend engineer with deep expertise in designing secure, high-performance APIs and payment infrastructures. He enjoys teaching developers about scalable backend systems, database optimization, and writing clean, maintainable code that can handle millions of transactions reliably."
  }
];


// Interactive Particle Grid Component
export const InteractiveGrid = ({ type = "repel" }) => {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    const resize = () => {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      // Only resize if dimensions are valid and have actually changed
      if (rect.width > 0 && rect.height > 0) {
        // Set internal drawing buffer to match high-DPI scaling
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr

        // Ensure CSS box stays the same
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        // Scale the context globally to handle drawing units
        ctx.scale(dpr, dpr)

        initParticles()
      }
    }

    const initParticles = () => {
      particles = []
      const gap = 20
      const rows = Math.ceil(canvas.height / gap)
      const cols = Math.ceil(canvas.width / gap)

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          particles.push({
            x: j * gap + gap / 2,
            y: i * gap + gap / 2,
            baseX: j * gap + gap / 2,
            baseY: i * gap + gap / 2,
            size: 1.4, // Consistent base size
            density: Math.random() * 20 + 10
          })
        }
      }
    }

    const animate = () => {
      // Use the actual CSS dimensions for clearing since ctx is scaled
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      particles.forEach(p => {
        let dx = mouse.current.x - p.x
        let dy = mouse.current.y - p.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forceDirectionX = dx / (distance || 1)
        let forceDirectionY = dy / (distance || 1)
        let maxDistance = 100
        let force = (maxDistance - distance) / maxDistance
        let directionX = forceDirectionX * force * p.density
        let directionY = forceDirectionY * force * p.density

        if (distance < maxDistance) {
          if (type === "attract") {
            p.x += directionX
            p.y += directionY

            // Draw Constellation Line
            ctx.beginPath()
            ctx.moveTo(mouse.current.x, mouse.current.y)
            ctx.lineTo(p.x, p.y)
            ctx.strokeStyle = `rgba(15, 23, 42, ${0.12 * force})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          } else {
            p.x -= directionX
            p.y -= directionY
          }
        } else {
          if (p.x !== p.baseX) {
            let dx = p.x - p.baseX
            p.x -= dx / 10
          }
          if (p.y !== p.baseY) {
            let dy = p.y - p.baseY
            p.y -= dy / 10
          }
        }
      })

      // Batch draw all particles for extreme performance boost
      ctx.fillStyle = 'rgba(15, 23, 42, 0.32)' // Restored to subtle "normal" color
      ctx.beginPath()
      particles.forEach(p => {
        ctx.moveTo(p.x + p.size, p.y)
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      })
      ctx.fill()

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.current.x = -1000
      mouse.current.y = -1000
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resize() // Force a clean re-draw when coming back
      }
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    resize()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="stitch-canvas-grid" />
}

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating-container" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;
        const gradientId = `star-grad-${star}-${rating}`;

        return (
          <svg key={star} width="16" height="16" viewBox="0 0 24 24" style={{ display: 'block' }}>
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset={`${fillPercentage}%`} stopColor="#FBBF24" />
                <stop offset={`${fillPercentage}%`} stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#${gradientId})`}
            />
          </svg>
        );
      })}
      <span style={{ marginLeft: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>
        {rating}
      </span>
    </div>
  );
};

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
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getStoredAuthData())
  const [userRole, setUserRole] = useState(() => getStoredAuthData()?.role || null)
  // --- BENEFITS SECTION REVEAL ANIMATION ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the card is visible
    );

    // Apply observer and set transition delay for stagger effect
    const cards = document.querySelectorAll('.stitch-features-grid .feature-card');
    cards.forEach((card, index) => {
      // Stagger: 0.1s delay per card
      card.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)

    const checkUser = async () => {
      try {
        const authData = await getAuthenticatedUser()
        if (authData) {
          setIsLoggedIn(true)
          setUserRole(authData.role)
        } else {
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      }
    }
    checkUser()
  }, [navigate])

  const [activeFaq, setActiveFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const auraRef = useRef(null);
  const coursesCarouselRef = useRef(null);
  const mentorAccordionRef = useRef(null);

  const scrollMentorAccordion = (direction) => {
    if (mentorAccordionRef.current) {
      const scrollAmount = 240;
      mentorAccordionRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Continuous carousel animation handled purely by CSS for smooth performance.
  }, []);



  const handleMouseMove = (e) => {
    if (!auraRef.current) return
    const { clientX, clientY } = e
    auraRef.current.style.left = `${clientX}px`
    auraRef.current.style.top = `${clientY}px`
  }

  const scrollCarousel = (direction) => {
    if (!coursesCarouselRef.current) return
    const scrollAmount = 450
    coursesCarouselRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    })
  }

  const handleSearch = () => {
    const q = searchTerm.trim().toLowerCase()
    navigate(`/explore?q=${encodeURIComponent(q)}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearAuthData()
    setIsLoggedIn(false)
    navigate('/')
  }

  const stitchFaqs = [
    {
      id: 1,
      question: "What is Internify?",
      answer: "Internify is a platform that connects students with experienced professionals for 1-on-1 mentorship and internship-based learning, focused on practical skills and real-world experience."
    },
    {
      id: 2,
      question: "Who is this program for?",
      answer: "This program is for students who want to build real skills, work on practical tasks, and gain internship experience. Beginners can join as long as they are willing to learn."
    },
    {
      id: 3,
      question: "Who are the mentors?",
      answer: "Mentors are experienced professionals from different fields with practical industry experience. They guide students through learning, tasks, and projects."
    },
    {
      id: 5,
      question: "How does the internship work?",
      answer: "You will be guided by a mentor, work on tasks or mini projects, and use the platform to track your progress. The focus is on learning by doing."
    },
    {
      id: 6,
      question: "Will I get a certificate?",
      answer: "Yes, you will receive a certificate upon successful completion. Students who perform well may also receive a referral letter from their mentor."
    },
    {
      id: 7,
      question: "Do I need prior experience?",
      answer: "No prior experience is required for beginner-level programs. Basic interest and consistency are enough to get started."
    },
    {
      id: 8,
      question: "Is placement support guaranteed?",
      answer: "Placement is not guaranteed. However, we support you with mock interviews with real HR/recruiters and help in building a strong profile to improve your chances."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Simplified About Us Section

  return (
    <div className="landing-page-new font-sans">

      <nav className="simple-navbar">
        <div className="nav-container-new">
          {/* Logo Section */}
          <div className="nav-logo-group" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="nav-logo-text">Internify</span>
          </div>

          {/* Main Links (Center) */}
          <div className="nav-links-center">
            <a href="/explore" onClick={(e) => { e.preventDefault(); navigate('/explore'); }}>Explore Mentors</a>
            <a href="/explore?tab=courses" onClick={(e) => { e.preventDefault(); navigate('/explore?tab=courses'); }}>Explore Courses</a>
            <a href="/resources" onClick={(e) => { e.preventDefault(); navigate('/resources'); }}>Resources</a>
            <a href="#faq">FAQ</a>
          </div>

          {/* Auxiliary Links (Right) */}
          <div className="nav-links-right">
            {isLoggedIn ? (
              <button className="nav-login-btn-new" onClick={() => navigate(userRole === 'mentor' ? '/mentor-dashboard' : '/dashboard')}>Dashboard</button>
            ) : (
              <>
                <button className="nav-aux-link" onClick={() => navigate('/apply-mentor')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Apply as Mentor</button>
                <button className="nav-login-btn-new" onClick={() => navigate('/login')}>Log in</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="landing-main-content">

        <section className="stitch-hero" id="home" onMouseMove={handleMouseMove}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="stitch-bg-video"
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
          <InteractiveGrid />

          <div className="stitch-hero-content">
            <h1 className="stitch-hero-heading">
              Launch Your Career With <br />Industry Mentors
            </h1>
            <p className="stitch-hero-subheading">
              Experience real-world projects, get direct referrals,
              and build your professional brand with Internify.
            </p>

            <div className="stitch-search-container">
              <div className="stitch-search-input-wrapper">
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  className="stitch-search-field"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0f172a',
                    width: '100%',
                    outline: 'none',
                    fontSize: '1.2rem'
                  }}
                />
              </div>
              <div className="stitch-search-actions">
                <div className="stitch-search-pills">
                  <span className="stitch-search-pill active" onClick={() => navigate('/explore')} style={{ cursor: 'pointer' }}>All Mentors</span>
                  <span className="stitch-search-pill" onClick={() => navigate('/explore')} style={{ cursor: 'pointer' }}>Popular</span>
                  <span className="stitch-search-pill" onClick={() => navigate('/explore')} style={{ cursor: 'pointer' }}>Rising</span>
                </div>
                <div className="stitch-search-btn-group">
                  <button className="stitch-search-btn" onClick={handleSearch}>
                    <span className="material-symbols-outlined">search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* ── Full-width marquee logo bar ── */}
        {/* <div className="hero-marquee-section">
          <p className="hero-marquee-label">Trusted by 3.7 million companies</p>
          <div className="hero-marquee-track-wrap">
            <div className="hero-marquee-track">
              {[0, 1].map((i) => (
                <div className="hero-marquee-set" key={i}>
                  <div className="hero-logo-item"><svg viewBox="0 0 130 32" height="28"><text x="0" y="24" fontFamily="'Inter',sans-serif" fontWeight="800" fontSize="21" fill="#8a95a3">Salesforce</text></svg></div>
                  <div className="hero-logo-item"><svg viewBox="0 0 115 32" height="28"><text x="0" y="24" fontFamily="'Inter',sans-serif" fontWeight="800" fontSize="21" fill="#8a95a3">Evernote</text></svg></div>
                  <div className="hero-logo-item"><svg viewBox="0 0 125 32" height="28"><text x="0" y="24" fontFamily="'Inter',sans-serif" fontWeight="800" fontSize="21" fill="#8a95a3">Microsoft</text></svg></div>
                  <div className="hero-logo-item"><svg viewBox="0 0 80 32" height="28"><text x="0" y="24" fontFamily="'Inter',sans-serif" fontWeight="800" fontSize="21" fill="#8a95a3">Adobe</text></svg></div>
                  <div className="hero-logo-item"><svg viewBox="0 0 95 32" height="28"><text x="0" y="24" fontFamily="'Inter',sans-serif" fontWeight="800" fontSize="21" fill="#8a95a3">Google</text></svg></div>
                  <div className="hero-logo-item"><svg viewBox="0 0 78 32" height="28"><text x="0" y="24" fontFamily="'Inter',sans-serif" fontWeight="800" fontSize="21" fill="#8a95a3">Slack</text></svg></div>
                  <div className="hero-logo-item"><svg viewBox="0 0 105 32" height="28"><text x="0" y="24" fontFamily="'Inter',sans-serif" fontWeight="800" fontSize="21" fill="#8a95a3">LinkedIn</text></svg></div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Popular Courses Section */}
        <section className="course-split-section stitch-courses-section" id="courses" style={{ backgroundColor: '#e5e7eb', margin: 0, paddingBottom: '60px', paddingTop: '60px' }}>
          <div className="stitch-courses-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', marginBottom: '1.5rem', width: '100%' }}>
            <h2 className="stitch-courses-title" style={{ margin: 0, padding: 0 }}>Get Started with Popular Courses</h2>
            <div className="stitch-carousel-nav" style={{ padding: '0 2rem' }}>
              <button className="stitch-nav-btn" onClick={() => scrollCarousel('left')}>
                <ArrowBackIcon />
              </button>
              <button className="stitch-nav-btn" onClick={() => scrollCarousel('right')}>
                <ArrowForwardIcon />
              </button>
            </div>
          </div>

          <div className="stitch-courses-carousel" ref={coursesCarouselRef}>
            {featuredPrograms.map((program, index) => {
              const isReverse = index % 2 !== 0;
              // Split title for styling (first word green, rest white/black)
              const titleWords = program.title.split(' ');
              const firstWord = titleWords[0];
              const restOfTitle = titleWords.slice(1).join(' ');

              return (
                <div 
                  key={program.id} 
                  className={`course-split-card`}
                  onClick={() => navigate(`/explore?q=${encodeURIComponent(program.title)}&tab=courses`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="course-split-image">
                    {program.video ? (
                      <video src={program.video} autoPlay loop muted playsInline />
                    ) : (
                      <img src={program.image} alt={program.title} />
                    )}
                  </div>

                  <div className="course-split-content">
                    <h4 className="course-split-category">{program.category}</h4>
                    <h2 className="course-split-title">
                      {firstWord} <span style={{ color: '#000' }}>{restOfTitle}</span>
                    </h2>
                    <p className="course-split-desc">
                      {program.growthStat}. Master {program.tags.join(', ')}. {program.ribbon}.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dark Bento Benefits Section */}
        <div className="premium-bento-transition"></div>
        <section className="premium-bento-section" id="benefits">
          <div className="premium-bento-container">
            <div className="premium-bento-header">
              <h2>Accelerate Your Career</h2>
              <p>Experience the future of mentorship and professional growth.</p>
            </div>
            
            <div className="premium-bento-grid">
              {stitchFeatures.map((feat, index) => (
                <div
                  key={feat.id}
                  className={`bento-card bento-${feat.size} feat-${feat.type}`}
                >
                  {/* Cursor Glow Effect */}
                  <div className="bento-glow"></div>
                  
                  {/* Content */}
                  <div className="bento-content">
                    <div className="bento-text">
                      <span className="bento-label">{feat.label}</span>
                      <h3 className="bento-title">{feat.title}</h3>
                      <p className="bento-desc">{feat.description}</p>
                    </div>
                    
                    {/* Architectural Visuals */}
                    <div className="bento-visual">
                      {feat.promptBar ? (
                        <div className="bento-mockup terminal">
                          <div className="terminal-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                          </div>
                          <div className="terminal-body">
                            <code> init career_accelerator</code>
                            <code className="success">✓ Mock Interviews Prepared</code>
                            <code className="success">✓ Resume Reviewed</code>
                            <code className="cursor-blink">_</code>
                          </div>
                        </div>
                      ) : feat.type === 'easy-edits' ? (
                         <div className="bento-mockup abstract-grid">
                           <div className="glow-orb"></div>
                           <div className="bento-profile-card">
                             <div className="bpc-avatar"></div>
                             <div className="bpc-lines">
                               <div className="bpc-line w-100"></div>
                               <div className="bpc-line w-60"></div>
                             </div>
                           </div>
                         </div>
                      ) : feat.type === 'verified' ? (
                         <div className="bento-mockup glass-certificate">
                           <feat.Icon className="bento-svg-accent" />
                           <div className="glass-lines">
                             <div className="g-line w-80"></div>
                             <div className="g-line w-40"></div>
                           </div>
                         </div>
                      ) : (
                         <div className="bento-mockup floating-nodes">
                           <div className="floating-node n1"><feat.Icon className="bento-svg-small" /></div>
                           <div className="floating-node n2"></div>
                           <div className="floating-node n3"></div>
                           <svg className="connecting-lines" viewBox="0 0 100 100">
                             <path d="M 20 50 Q 50 10 80 80" stroke="rgba(255,255,255,0.1)" fill="none" strokeWidth="2" strokeDasharray="4 4" />
                           </svg>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STITCH MENTOR CTA SECTION (Vibe Aesthetic) ─── */}
        <section className="stitch-cta-section">
          <InteractiveGrid type="attract" />
          <div className="cta-aura-wrapper">
            <div className="cta-blob cta-blob-1"></div>
            <div className="cta-blob cta-blob-2"></div>
            <div className="cta-blob cta-blob-3"></div>
            <div className="cta-blob cta-blob-4"></div>
          </div>

          <div className="stitch-cta-content">
            <h2 className="stitch-cta-title">Empower The Next Generation</h2>
            <p className="stitch-cta-subtitle">
              Share your industry expertise and help students bridge the gap to their dream careers.
              Join Internify's global network of expert mentors today.
            </p>
            <button className="stitch-cta-btn" onClick={() => navigate('/apply-mentor')}>
              Apply as a Mentor
            </button>
          </div>
        </section>



        {/* ─── STITCH MENTORS SECTION ─── */}
        <section className="stitch-mentors-section" id="mentors">
          <div className="stitch-mentors-container" style={{ maxWidth: '100%' }}>
            <div className="stitch-courses-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 4rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 className="stitch-courses-title" style={{ margin: 0, padding: 0, textAlign: 'left', color: '#f8fafc' }}>Meet Our Mentors</h2>
              </div>
            </div>

            <div className="mentor-accordion-wrapper" style={{ position: 'relative' }}>
              <button 
                className="mentor-scroll-btn left" 
                onClick={() => scrollMentorAccordion('left')}
                aria-label="Scroll left"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              <div className="mentor-accordion-container" ref={mentorAccordionRef}>
                {mentorsList.slice(0, 7).map((mentor, index) => (
                  <div 
                    key={`acc-${mentor.id}-${index}`} 
                    className="mentor-accordion-card"
                    onClick={() => handleMentorClick(mentor.id)}
                  >
                    <img src={mentor.image} alt={mentor.name} className="mentor-accordion-img" />
                    <div className="mentor-accordion-overlay"></div>
                    
                    <div className="mentor-accordion-content">
                      <div className="mentor-meta" style={{ marginBottom: '12px' }}>
                        <span className="mentor-company-pill">{mentor.company}</span>
                        <div className="mentor-card-rating-inline">
                          <StarRating rating={mentor.rating} />
                        </div>
                      </div>
                      <div className="mentor-accordion-text">
                        <h3>{mentor.name} <span className="material-symbols-outlined verified-icon" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginLeft: '4px' }}>verified</span></h3>
                        <p style={{ color: '#cbd5e1', fontWeight: '500', marginBottom: '12px' }}>{mentor.role}</p>
                        
                        {/* Extra details shown only on hover */}
                        <div className="mentor-accordion-details" style={{ display: 'flex', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px', marginTop: '4px' }}>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Experience</span>
                            <strong style={{ fontSize: '1rem', color: '#fff' }}>{mentor.experience}</strong>
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Mentees</span>
                            <strong style={{ fontSize: '1rem', color: '#fff' }}>{mentor.mentees}</strong>
                          </div>
                        </div>
                        <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.4', whiteSpace: 'normal', opacity: '0.9' }}>
                          "{mentor.about}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="mentor-scroll-btn right" 
                onClick={() => scrollMentorAccordion('right')}
                aria-label="Scroll right"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>







        {/* ─── STITCH FAQ SECTION ─── */}
        <section className="stitch-faq-section" id="faq">
          <div className="stitch-faq-container">
            <h2 className="stitch-faq-title">Questions?</h2>
            <div className="stitch-faq-list">
              {stitchFaqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`stitch-faq-item ${activeFaq === index ? 'is-active' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="stitch-faq-header">
                    <h3 className="stitch-faq-q">{faq.question}</h3>
                    <span className="material-symbols-outlined faq-icon">
                      {activeFaq === index ? 'close' : 'add'}
                    </span>
                  </div>
                  {activeFaq === index && (
                    <div className="stitch-faq-body">
                      <p className="stitch-faq-a">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>










      </main >

      <footer className="stitch-footer">
        <div className="stitch-footer-container">
          <div className="stitch-footer-labs">
            <span className="material-symbols-outlined lab-icon">science</span>
            <span className="lab-text">Internify Labs</span>
          </div>
          <div className="stitch-footer-links">
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className="footer-link">Privacy Notice</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className="footer-link">Terms of Service</a>
            <a href="#faq" className="footer-link">FAQ</a>
            <a href="/contact-us" onClick={(e) => { e.preventDefault(); navigate('/contact-us'); }} className="footer-link">Contact Us</a>
          </div>
        </div>
      </footer>
      <CourseModal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} />
    </div >
  )
}
