import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RingsIcon, BadgeCheckIcon } from '../../components/Icons.jsx'
import { checkAuthSession, clearAuthData } from '../../utils/auth.js'
// Hero section images removed as assets - using inline styles or URLs if needed
import Loading from '../../components/Loading';
import CourseModal from '../../components/CourseModal';
import supabase from '../../supabaseClient'
import '../../App.css'
import dashboardImg from '../../assets/images/dashboard.png'
import classroomImg from '../../assets/images/clasroom.png'
import ethicalHackingImg from '../../assets/images/ethicalhacking.jpg'
import featMentors from '../../assets/images/feature-mentors.png'
import featCareer from '../../assets/images/feature-career.png'
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
    image: dashboardImg,
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
    accentColor: '#e05fa0'
  },
  {
    id: 'fp-3',
    title: 'Digital Security Specialist',
    category: 'Mobile Template',
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
const stitchFeatures = [
  {
    id: 'feat-1',
    title: '5+ year experienced mentors ',
    type: 'easy-edits',
    description: 'Learn directly from industry experts with 5+ years of hands-on experience in their respective fields.',
    image: classroomImg,
    mockupGrid: true,
    size: 'large'
  },
  {
    id: 'feat-2',
    title: '1-on-1 Guidance & flexibility ',
    type: 'guidance',
    description: 'Work on real-world projects with personal mentorship to bridge the theory-practice gap.',
    Icon: RingsIcon,
    image: featMentors,
    size: 'small'
  },
  {
    id: 'feat-3',
    title: 'Verified certificates and direct referals ',
    type: 'verified',
    description: 'Earn industry-recognized certificates and personalized referral letters for your career.',
    Icon: BadgeCheckIcon,
    image: null,
    size: 'small'
  },
  {
    id: 'feat-4',
    title: 'Career support',
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
      ctx.fillStyle = 'rgba(15, 23, 42, 0.32)' // Restored to subtle "normal" color

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

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      })
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
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const auraRef = useRef(null);
  const coursesCarouselRef = useRef(null);

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

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)

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

  const stitchFaqs = [
    {
      id: 1,
      question: "What is Internify?",
      answer: "Internify is an AI-native professional growth platform that bridges the gap between leaning and industry by connecting students with expert mentors for real-world projects, direct referrals, and career acceleration."
    },
    {
      id: 2,
      question: "Is Internify free of charge?",
      answer: "Internify offers a range of free introductory content and mentorship sessions. Our specialized project tracks and verified certification programs are premium offerings designed to support our expert mentor network."
    },
    {
      id: 3,
      question: "Where is Internify available?",
      answer: "Internify is available globally. Our mentors come from leading tech hubs like Silicon Valley, London, and Bangalore, providing students with world-class industry exposure regardless of their location."
    },
    {
      id: 4,
      question: "Can I export my project code?",
      answer: "Absolutely. All code written during your industry projects is yours to keep and export. We provide automated GitHub integration so you can easily showcase your work to potential recruiters."
    },
    {
      id: 5,
      question: "Does it guarantee working placement?",
      answer: "While we provide direct referrals and recruitment help through our mentor network and partners, placement depends on your performance in projects and interviews. Our goal is to make you the most competitive candidate in the market."
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
            <a href="/explore" onClick={(e) => { e.preventDefault(); navigate('/explore'); }}>Explore Courses</a>
            <a href="#faq">Resources</a>
            <a href="#faq">FAQ</a>
          </div>

          {/* Auxiliary Links (Right) */}
          <div className="nav-links-right">
            <button className="nav-aux-link" onClick={() => navigate('/apply-mentor')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Apply as Mentor</button>
            <button className="nav-login-btn-new" onClick={() => navigate('/login')}>Log in</button>
          </div>
        </div>
      </nav>

      <main className="landing-main-content">

        <section className="stitch-hero" id="home" onMouseMove={handleMouseMove}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="stitch-bg-video"
          >
            <source src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/89e9004d716a7803fc7c9aab18c985af783f5a36.mp4" type="video/mp4" />
          </video>
          <InteractiveGrid />

          <div className="stitch-hero-content">
            <h1 className="stitch-hero-heading">
              Launch Your Career with <br />Industry Mentors
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

        {/* Stitch-Inspired Featured Courses Section */}
        <section className="stitch-courses-section" id="courses">
          <InteractiveGrid />
          <div className="stitch-courses-header">
            <h2 className="stitch-courses-title">Get started with templates</h2>
            <div className="stitch-carousel-nav">
              <button className="stitch-nav-btn" onClick={() => scrollCarousel('left')}>
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button className="stitch-nav-btn" onClick={() => scrollCarousel('right')}>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="stitch-courses-carousel" ref={coursesCarouselRef}>
            {featuredPrograms.map((program, index) => (
              <div
                key={program.id}
                className={`stitch-course-card ${index === 0 ? 'is-first' : ''}`}
                onClick={() => navigate(`/course/${program.id}`)}
              >
                {/* Background Blur Layer */}
                <img src={program.image} alt="" className="stitch-card-bg-blur" />

                {/* Centered Main Image Layer */}
                <div className="stitch-card-inner">
                  <img src={program.image} alt={program.title} className="stitch-course-main-img" />
                </div>

                {/* Bottom Text Overlay */}
                <div className="stitch-course-overlay">
                  <span className="stitch-course-label">{program.category}</span>
                  <h3 className="stitch-course-title-card">{program.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── STITCH FEATURES BENTO GRID ─── */}
        <section className="stitch-features-section">
          <div className="stitch-features-grid">
            {stitchFeatures.map((feat) => (
              <div
                key={feat.id}
                className={`feature-card ${feat.size} feat-${feat.type}`}
              >
                Background Blur Layer (Stitch Aesthetic)
                {feat.type !== 'easy-edits' && (
                  <img src={feat.image} alt="" className="feature-bg-blur" />
                )}

                {/* Sharp Floating Inner UI Module (Mockup Grid Reconstruction) */}
                <div className="feature-card-inner">
                  {feat.mockupGrid ? (
                    <div className="mockup-grid">
                      <div className="mockup-slot m1"><img src={feat.image} alt="" /></div>
                      <div className="mockup-slot m2"><img src={feat.image} alt="" /></div>
                      <div className="mockup-slot m3"><img src={feat.image} alt="" /></div>
                    </div>
                  ) : feat.promptBar ? (
                    <div className="prompt-bar-mockup">
                      <div className="figma-grid-lines">
                        <div className="line-v v1"></div>
                        <div className="line-v v2"></div>
                        <div className="line-h h1"></div>
                        <div className="line-h h2"></div>
                      </div>
                      <div className="prompt-bar-capsule">
                        <span className="prompt-text">your dream internship</span>
                        <div className="prompt-btn">
                          <span className="material-symbols-outlined">keyboard_return</span>
                          <span className="prompt-return-text">_RETURN</span>
                        </div>
                      </div>
                    </div>
                  ) : feat.Icon ? (
                    <feat.Icon className="feature-inner-svg" />
                  ) : (
                    feat.image && <img src={feat.image} alt="" className="feature-inner-img" />
                  )}
                </div>

                {/* Text Layer (Bottom Left) */}
                <div className="feature-content">
                  <span className="feature-label">INTERNIFY FEATURE</span>
                  <h3 className="feature-title">{feat.title}</h3>
                  <p className="feature-desc">{feat.description}</p>
                </div>

                {/* Subtle Dot Grid Background */}
                <div className="card-dot-grid"></div>
              </div>
            ))}
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
            <h2 className="stitch-cta-title">Empower the Next Generation</h2>
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
          <div className="stitch-mentors-container">
            <div className="stitch-mentors-header">
              <span className="feature-label">EXPERT GUIDANCE</span>
              <h2 className="stitch-faq-title">Professionals </h2>
              <p className="stitch-faq-a" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                Our mentors are industry experts with 5+ years of real-world
                experience at leading companies like Google, Meta, and Netflix.
              </p>
            </div>

            <div className="stitch-mentors-grid">
              {[
                { id: 1, name: "Sarah Jenkins", role: "Senior UX Designer", company: "Google", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
                { id: 2, name: "David Chen", role: "Staff Engineer", company: "Netflix", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80" },
                { id: 3, name: "Emily Rodriguez", role: "Product Manager", company: "Airbnb", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80" },
                { id: 4, name: "Michael Chang", role: "Frontend Lead", company: "Meta", image: "https://ui-avatars.com/api/?name=Mentor&background=0D0D0D&color=fff" }
              ].map((mentor) => (
                <div key={mentor.id} className="mentor-stitch-card">
                  {/* Layer 1: Dot Grid Texture */}
                  <div className="card-dot-grid"></div>

                  {/* Layer 3: Floating Profile Module */}
                  <div className="mentor-card-inner">
                    <div className="mentor-image-frame">
                      <img src={mentor.image} alt={mentor.name} className="mentor-profile-img" />
                    </div>
                  </div>

                  {/* Layer 4: Minimalist Content */}
                  <div className="stitch-mentor-content">
                    <div className="mentor-meta">
                      <span className="mentor-company-pill">{mentor.company}</span>
                      <span className="material-symbols-outlined verified-icon">verified</span>
                    </div>
                    <h3 className="mentor-name">{mentor.name}</h3>
                    <p className="mentor-role">{mentor.role}</p>
                  </div>
                </div>
              ))}
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
