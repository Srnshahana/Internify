import { useRef, useState, useEffect } from 'react'
import Explore from './search.jsx'
import MentorProfile from './mentorProfile.jsx'
import Login from './login.jsx'
import Dashboard from './Dashboard.jsx'
import Payment from './payment.jsx'
import { courses, mentors } from './Data.jsx'
import './App.css'

const steps = [
  { title: 'Explore mentors', detail: 'Filter by role, industry, and goals.' },
  { title: 'Book a free intro', detail: 'Meet your mentor for 15 minutes to align.' },
  { title: 'Start guided path', detail: 'Weekly sessions + projects tailored to you.' },
  { title: 'Ship & get hired', detail: 'Build outcomes you can show recruiters.' },
]

const howItWorksSteps = [
  {
    number: 1,
    title: 'Browse Courses',
    description: 'Explore our curated selection of industry-relevant courses designed by experts',
  },
  {
    number: 2,
    title: 'Connect with Mentors',
    description: 'Get matched with experienced professionals who guide your learning journey',
  },
  {
    number: 3,
    title: 'Learn & Grow',
    description: 'Complete real projects and build skills that make you job-ready',
  },
]

const highlights = [
  'Freshers (main focus): Get job-ready with guided projects and interview prep.',
  'Upskillers: Close gaps fast with weekly mentor feedback.',
  'Hobby learning: Build portfolio-worthy side projects with expert guidance.',
  'Final-year projects: Ship capstones with industry-grade rigor and reviews.',
  'In any category above, Internify gives you real mentors, real direction.',
]

const outcomes = [
  {
    title: 'Course Packages',
    text: 'Structured courses focused on real, job-ready skills like mobile app development, web development, and more.',
    circleText: 'COURSE',
  },
  {
    title: 'Project Packages',
    text: 'Hands-on project building with mentor guidance to create real apps, case studies, and portfolio-ready work.',
    circleText: 'PROJECT',
  },
  {
    title: 'Career Guidance Sessions',
    text: 'One-on-one mentorship sessions to get career clarity, plan your path, and gain confidence — typically 1-hour focused calls.',
    circleText: 'CAREER',
  },
]

// Map courses to skills format for Latest Skills section
const latestSkills = courses.slice(0, 8).map((course) => ({
  id: course.id,
  name: course.name,
  image: course.image,
  category: course.category,
  description: course.description,
}))

function App() {
  const mentorTrackRef = useRef(null)
  const skillsTrackRef = useRef(null)
  const outcomesSectionRef = useRef(null)
  const highlightsSectionRef = useRef(null)
  const howItWorksSectionRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showExplore, setShowExplore] = useState(false)
  const [exploreInitialQuery, setExploreInitialQuery] = useState('')
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Scroll-triggered animations
  useEffect(() => {
    if (showExplore || selectedMentor || showLogin) {
      // On explore/profile pages, make sure all elements are visible
      const animatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
      )
      animatedElements.forEach((el) => el.classList.add('visible'))
      return
    }

    let observer
    let timeoutId

      const initAnimations = () => {
      // Get all animated elements, then filter out outcomes and how-it-works sections
      const allAnimatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
      )
      
      // Filter out outcomes and how-it-works section elements (they use scroll-based animation)
      const animatedElements = Array.from(allAnimatedElements).filter(
        (el) => !el.closest('.outcomes') && !el.closest('.how-it-works')
      )
      
      // First, check if elements are already in view and make them visible immediately
      animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        // Trigger 200px before element enters viewport
        const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200
        if (isVisible) {
          el.classList.add('visible')
        } else {
          el.classList.remove('visible')
        }
      })

      const observerOptions = {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '0px 0px 200px 0px', // Trigger 200px before element enters viewport
      }

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // Skip outcomes and how-it-works section elements
          if (entry.target.closest('.outcomes') || entry.target.closest('.how-it-works')) return
          
          // Trigger animation when element is approaching viewport
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.classList.add('visible')
          }
        })
      }, observerOptions)

      // Observe all elements (excluding outcomes section)
      animatedElements.forEach((el) => {
        if (!el.classList.contains('visible')) {
          observer.observe(el)
        }
      })
    }

    // Small delay to ensure DOM is ready
    timeoutId = setTimeout(initAnimations, 150)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (observer) {
        const animatedElements = document.querySelectorAll(
          '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
        )
        animatedElements.forEach((el) => observer.unobserve(el))
      }
    }
  }, [showExplore, selectedMentor, showLogin])

  // Intersection Observer for outcomes section animation (runs only once)
  useEffect(() => {
    if (showExplore || selectedMentor || showLogin || !outcomesSectionRef.current) return

    const outcomesSection = outcomesSectionRef.current
    const outcomesLeft = outcomesSection.querySelector('.outcomes-left.animate-section')
    const outcomesRightItems = outcomesSection.querySelectorAll('.outcomes-right .fade-in-right')

    if (outcomesRightItems.length === 0) {
      console.warn('No right items found for animation')
      return
    }

    const observerOptions = {
      threshold: 0.1, // Trigger when 10% of section is visible
      rootMargin: '0px 0px -50px 0px', // Trigger when section is 50px from entering viewport
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add visible class to animate-section (outcomes-left) - slides from left
          if (outcomesLeft) {
            outcomesLeft.classList.add('visible')
          }
          
          // Staggered animation for right items - slides from right
          // Course Packages (index 0) - immediate
          // Project Packages (index 1) - 200ms delay
          // Career Guidance Sessions (index 2) - 400ms delay
          outcomesRightItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible')
            }, index * 200) // 200ms delay between each item
          })
          
          // Unobserve to ensure animation runs only once per page load
          observer.unobserve(outcomesSection)
        }
      })
    }, observerOptions)

    observer.observe(outcomesSection)

    return () => {
      if (outcomesSection) {
        observer.unobserve(outcomesSection)
      }
    }
  }, [showExplore, selectedMentor, showLogin])

  // Intersection Observer for highlights section animation
  useEffect(() => {
    if (showExplore || selectedMentor || showLogin || !highlightsSectionRef.current) return

    const highlightsSection = highlightsSectionRef.current
    const highlightItems = highlightsSection.querySelectorAll('.highlight-animate')

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate each highlight item with staggered delay
          highlightItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible')
            }, index * 200) // 200ms delay between each item
          })
          
          // Unobserve to ensure animation runs only once
          observer.unobserve(highlightsSection)
        }
      })
    }, observerOptions)

    observer.observe(highlightsSection)

    return () => {
      if (highlightsSection) {
        observer.unobserve(highlightsSection)
      }
    }
  }, [showExplore, selectedMentor, showLogin])

  // Intersection Observer for How It Works section animation
  useEffect(() => {
    if (showExplore || selectedMentor || showLogin || !howItWorksSectionRef.current) return

    const howItWorksSection = howItWorksSectionRef.current
    const stepItems = howItWorksSection.querySelectorAll('.step-animate')

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate each step item with staggered delay
          stepItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible')
            }, index * 200) // 200ms delay between each item
          })
          
          // Unobserve to ensure animation runs only once
          observer.unobserve(howItWorksSection)
        }
      })
    }, observerOptions)

    observer.observe(howItWorksSection)

    return () => {
      if (howItWorksSection) {
        observer.unobserve(howItWorksSection)
      }
    }
  }, [showExplore, selectedMentor, showLogin])

  // Auto-scroll for skills slider
  useEffect(() => {
    const skillsTrack = skillsTrackRef.current
    if (!skillsTrack) return

    let scrollInterval
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (skillsTrack) {
          const maxScroll = skillsTrack.scrollWidth - skillsTrack.clientWidth
          const currentScroll = skillsTrack.scrollLeft
          
          if (currentScroll >= maxScroll - 10) {
            // Reset to beginning
            skillsTrack.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            // Scroll forward
            skillsTrack.scrollBy({ left: 300, behavior: 'smooth' })
          }
        }
      }, 3000) // Scroll every 3 seconds
    }

    startAutoScroll()

    // Pause on hover
    const handleMouseEnter = () => clearInterval(scrollInterval)
    const handleMouseLeave = () => startAutoScroll()

    skillsTrack.addEventListener('mouseenter', handleMouseEnter)
    skillsTrack.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearInterval(scrollInterval)
      skillsTrack.removeEventListener('mouseenter', handleMouseEnter)
      skillsTrack.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const scrollMentors = (dir) => {
    const el = mentorTrackRef.current
    if (!el) return
    const distance = el.clientWidth * 0.8
    el.scrollBy({ left: dir === 'next' ? distance : -distance, behavior: 'smooth' })
  }

  const renderStars = (score) => {
    const full = Math.floor(score)
    const half = score - full >= 0.5
    // Use outlined stars (☆) for empty, filled (★) for full
    const stars = Array(5).fill('☆').map((star, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
    return stars
  }

  const handleSearch = () => {
    const q = searchTerm.trim().toLowerCase()
    setExploreInitialQuery(q)
    setShowExplore(true)
  }

  const handleNavSearch = (term) => {
    const q = term.toLowerCase()
    setSearchTerm(term)
    setExploreInitialQuery(q)
    setShowExplore(true)
  }

  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor)
  }

  const handleBookSessionClick = () => {
    setShowLogin(true)
  }

  const handleBackFromProfile = () => {
    setSelectedMentor(null)
  }

  const handleLogin = (credentials) => {
    // Handle login logic here
    console.log('Login attempt:', credentials)
    setShowLogin(false)
    // After successful login, go to payment screen
    setShowPayment(true)
    // You can add actual authentication logic here
  }

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowLogin(false)
    // Restore the saved theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }

  if (showLogin) {
    return (
      <Login
        onBack={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    )
  }

  if (showPayment) {
    return (
      <Payment
        onBack={() => setShowPayment(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    )
  }

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />
  }

  if (selectedMentor) {
    return (
      <MentorProfile
        mentor={selectedMentor}
        courses={courses}
        onBack={handleBackFromProfile}
        renderStars={renderStars}
        onBookSession={handleBookSessionClick}
      />
    )
  }

  if (showExplore) {
    return (
      <Explore
        mentors={mentors}
        courses={courses}
        onBack={() => setShowExplore(false)}
        renderStars={renderStars}
        initialQuery={exploreInitialQuery}
        onMentorClick={handleMentorClick}
        onBookSession={handleBookSessionClick}
      />
    )
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">
          <span>Internify.</span>
        </div>
        <div className="search">
          <input
            placeholder="Search mentor skills or course"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          />
          <button className="mini search-go" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="top-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button className="link" onClick={() => setShowLogin(true)}>Login</button>
          <button className="pill">Apply as mentor</button>
        </div>
      </div>

      <div className="nav-links">
        <button className="nav-chip" onClick={() => handleNavSearch('engineering')}>
          Engineering mentors
        </button>
        <button className="nav-chip" onClick={() => handleNavSearch('design')}>
          Design mentors
        </button>
        <button className="nav-chip" onClick={() => handleNavSearch('ai')}>
          AI mentors
        </button>
        <button className="nav-chip" onClick={() => handleNavSearch('leadership')}>
          Leadership mentors
        </button>
        <button className="nav-chip" onClick={() => handleNavSearch('career guidance')}>
          Career guidance
        </button>
      </div>

      <header className="hero">
        <div className="badge-no-border">Internify • Career-ready mentorship</div>
        <h1>
          <span className="hero-line hero-line-1">Believe in</span>
          <br />
          <span className="hero-line hero-line-2">your journey</span>
          <br />
          <span className="hero-line hero-line-3 muted-line">We'll guide the rest</span>
        </h1>
        <p className="lead fade-in-up" style={{ animationDelay: '0.3s' }}>
          Connect with industry mentors, learn the exact skills employers need, and ship
          projects you can show. Start with a free session to experience the teaching style
          before you choose your path.
        </p>
        <div className="hero-actions fade-in-up" style={{ animationDelay: '0.5s' }}>
          <button className="primary">Find your career path</button>
          <button className="ghost">Browse mentors</button>
        </div>
      </header>

      <section className="mentors fade-in-up">
        <div className="section-head">
          <div className="section-head-top">
            <div>
              <p className="eyebrow white-text">Featured mentors</p>
              <h2 className="white-text">Pick the right guide for where you want to go.</h2>
              <p className="white-text">
                Book a free intro to align on goals, then join a guided mentorship path with
                weekly sessions, async feedback, and career-ready projects.
              </p>
            </div>
            <button className="tiny view-all-btn" onClick={() => setShowExplore(true)}>
              View all
            </button>
          </div>
          <div className="mentor-nav">
            <button className="ghost tiny" onClick={() => scrollMentors('prev')}>
              ←
            </button>
            <button className="ghost tiny" onClick={() => scrollMentors('next')}>
              →
            </button>
          </div>
        </div>
        <div className="mentor-slider">
          <div className="mentor-track" ref={mentorTrackRef}>
            {mentors.slice(0, 5).map((mentor) => (
              <div
                className="mentor-card"
                key={mentor.name}
                onClick={() => handleMentorClick(mentor)}
                style={{ cursor: 'pointer' }}
              >
                <div className="mentor-card-top">
                  <div className="avatar-img-left">
                    <img src={mentor.image} alt={mentor.name} />
                  </div>
                  <h4 className="mentor-name-right">{mentor.name}</h4>
                </div>
                <p className="meta-role">{mentor.role}</p>
                {mentor.assured && <span className="assured-pill">Platform assured</span>}
                <p className="mentor-text-small">{mentor.focus}</p>
                <div className="mentor-card-bottom">
                  <span className="rating-outlined">
                    {renderStars(mentor.rating)}
                  </span>
                  <div className="mentor-actions">
                    <button className="tiny book-session-btn" onClick={handleBookSessionClick}>Book your free session</button>
                  </div>
                </div>
              </div>
            ))}
            <div
              className="mentor-card explore-all-card"
              onClick={() => setShowExplore(true)}
              style={{ cursor: 'pointer' }}
            >
              <div className="explore-all-content">
                <h3>Explore All Mentors</h3>
                <p>Discover more mentors and find the perfect guide for your journey</p>
                <button className="primary">View All →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={howItWorksSectionRef} className="how-it-works">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">How It Works</h2>
          <p className="how-it-works-subtitle">Three simple steps to accelerate your career journey</p>
        </div>
        <div className="how-it-works-steps">
          {howItWorksSteps.map((step) => (
            <div className="how-it-works-step step-animate" key={step.number}>
              <div className="step-number-circle">
                <span className="step-number">{step.number}</span>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="latest-skills fade-in-up">
        <div className="page-content-wrapper">
          <div className="section-head">
            <p className="eyebrow">Latest skills in 2026</p>
            <h2>Master the skills that matter most this year</h2>
            <p>Learn in-demand technologies with expert guidance and real-world projects</p>
          </div>
        </div>
        <div className="skills-slider">
          <div className="skills-track" ref={skillsTrackRef}>
            {latestSkills.map((skill) => (
              <div className="skill-card" key={skill.id || skill.name}>
                <div className="skill-image">
                  <img src={skill.image} alt={skill.name} />
                </div>
                <div className="skill-content">
                  <div className="skill-header">
                    <h3 className="skill-name">{skill.name}</h3>
                    <span className="skill-category">{skill.category}</span>
                  </div>
                  <p className="skill-description">{skill.description}</p>
                  <button className="tiny ghost" onClick={() => handleNavSearch(`course:${skill.id}`)}>Learn {skill.name}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={highlightsSectionRef} className="highlights fade-in-up">
        <div className="panel">
          <p className="eyebrow">Who can join</p>
          <h2>Built for every student profile.</h2>
          <p>
            Whether you are starting out, leveling up, exploring as a hobby, or finishing
            your final-year project, Internify pairs you with mentors who build alongside
            you and keep you on track every week.
          </p>
          <ol className="highlights-list">
            {highlights.map((item, index) => (
              <li key={item} className="highlight-item highlight-animate">
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>


      <section className="career-path-cta scale-in">
        <div className="career-path-content">
          <h2>Not able to decide your career path?</h2>
          <p>Find your right path for career</p>
        </div>
        <div className="cta-actions">
          <button
            className="primary"
            onClick={() => {
              handleNavSearch('career guidance')
            }}
          >
            Find your career path
          </button>
        </div>
      </section>

      <section ref={outcomesSectionRef} className="outcomes">
        <div className="page-content-wrapper">
            <div className="outcomes-container">
              <div className="outcomes-left animate-section">
                <h2 className="outcomes-title">WHAT MENTORS PROVIDE</h2>
                <p className="outcomes-description">
                  Mentors offer flexible learning and guidance based on your needs — whether you want to learn a skill, build real projects, or get career clarity.
                  Each offering is designed to be practical, outcome-driven, and aligned with real industry expectations. You choose what you need, when you need it — from structured courses and hands-on projects to focused one-on-one guidance. Every session and package is built to help you move forward with confidence and direction.
                </p>
              </div>
              <div className="outcomes-right">
                {outcomes.map((item, index) => (
                  <div key={item.title} className="fade-in-right">
                    {index > 0 && <div className="outcome-divider">⸻</div>}
                    <div className="outcome-module">
                      <div className="outcome-module-content">
                        <div className="outcome-circle">
                          <span className="outcome-circle-text">{item.circleText}</span>
                        </div>
                        <div className="outcome-content">
                          <h4 className="outcome-module-title">{item.title}</h4>
                          <p className="outcome-module-text">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* <section className="quote">
        <div className="quote-card">
          <p>
            “The best way to prepare for the future is to learn by doing today. Real guidance
            and hands-on experience turn potential into success.” – Unknown
          </p>
        </div>
      </section> */}

      <section className="boost fade-in-up">
        <h3>How This Boosts Your Chances of Getting Hired</h3>
        <div className="boost-grid">
          <div className="boost-item">
            <div className="boost-number">80%</div>
            <p>higher chance of getting hired through real mentor-guided, practical learning.</p>
          </div>
          <div className="boost-item">
            <div className="boost-number">90%</div>
            <p>skill validation with mentor-issued reference letters and Internify certification.</p>
          </div>
          <div className="boost-item">
            <div className="boost-number">80%</div>
            <p>stronger portfolio by completing real-world projects guided by experts.</p>
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
              <a href="#">Browse Mentors</a>
              <a href="#">Book a Session</a>
              <a href="#">Become a Mentor</a>
              <a href="#">Mentorship for Teams</a>
              <a href="#">Testimonials</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
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

export default App
