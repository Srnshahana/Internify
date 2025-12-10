import { useRef, useState } from 'react'
import Explore from './explore.jsx'
import './App.css'

const mentors = [
  {
    name: 'Aisha Khan',
    role: 'Product Designer, Figma',
    focus: 'Portfolio-ready UX projects and case studies',
    rating: 4.9,
    assured: true,
    experience: 6,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Ryan Patel',
    role: 'Software Engineer, Atlassian',
    focus: 'Full-stack skills, system design, interview prep',
    rating: 4.8,
    assured: false,
    experience: 5,
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Mei Chen',
    role: 'Data Scientist, Stripe',
    focus: 'Analytics projects, SQL, storytelling with data',
    rating: 5.0,
    assured: true,
    experience: 7,
    image:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Carlos Diaz',
    role: 'Marketing Lead, HubSpot',
    focus: 'Growth strategy, content that converts, GTM basics',
    rating: 4.7,
    assured: false,
    experience: 8,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
  },
]

const steps = [
  { title: 'Explore mentors', detail: 'Filter by role, industry, and goals.' },
  { title: 'Book a free intro', detail: 'Meet your mentor for 15 minutes to align.' },
  { title: 'Start guided path', detail: 'Weekly sessions + projects tailored to you.' },
  { title: 'Ship & get hired', detail: 'Build outcomes you can show recruiters.' },
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
    title: 'Skill clarity',
    text: 'Know exactly which skills matter for your target roles and how to stack them.',
  },
  {
    title: 'Portfolio projects',
    text: 'Ship real artifacts—apps, decks, case studies—that recruiters want to see.',
  },
  {
    title: 'Interview confidence',
    text: 'Mock interviews, feedback, and storytelling so you speak like a pro.',
  },
]

const courses = [
  {
    title: 'AI Product Builder',
    tag: '2026 • Product + AI',
    detail: 'Ship AI-first features, prompt patterns, evaluation, and launch stories.',
    durationWeeks: 10,
  },
  {
    title: 'Full-stack Systems',
    tag: '2026 • Eng + Systems',
    detail: 'Design, build, and deploy scalable services with API, DB, and observability.',
    durationWeeks: 12,
  },
  {
    title: 'Data Storytelling',
    tag: '2026 • Data + Biz',
    detail: 'SQL to stories: analytics, dashboards, and narratives that move decisions.',
    durationWeeks: 8,
  },
  {
    title: 'Design for Growth',
    tag: '2026 • UX + Growth',
    detail: 'Conversion-led UX, onboarding flows, and experiments that compound.',
    durationWeeks: 6,
  },
]

function App() {
  const mentorTrackRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showExplore, setShowExplore] = useState(false)
  const [exploreInitialQuery, setExploreInitialQuery] = useState('')

  const scrollMentors = (dir) => {
    const el = mentorTrackRef.current
    if (!el) return
    const distance = el.clientWidth * 0.8
    el.scrollBy({ left: dir === 'next' ? distance : -distance, behavior: 'smooth' })
  }

  const renderStars = (score) => {
    const full = Math.floor(score)
    const half = score - full >= 0.5
    const stars = '★★★★★'.slice(0, full) + (half ? '½' : '')
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

  if (showExplore) {
    return (
      <Explore
        mentors={mentors}
        onBack={() => setShowExplore(false)}
        renderStars={renderStars}
        initialQuery={exploreInitialQuery}
      />
    )
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">
          <span className="dot-logo" />
          <span>Internify</span>
        </div>
        <div className="search">
          <span className="search-icon">⌕</span>
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
          <button className="link">Login</button>
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
        <div className="badge">Internify • Career-ready mentorship</div>
        <h1>
          Believe in<br />
          your journey<br />
          <span className="muted-line">We’ll guide the rest</span>
        </h1>
        <p className="lead">
          Connect with industry mentors, learn the exact skills employers need, and ship
          projects you can show. Start with a free session to experience the teaching style
          before you choose your path.
        </p>
        <div className="hero-actions">
          <button className="primary">Find your career path</button>
          <button className="ghost">Browse mentors</button>
        </div>
        <div className="trust-bar">
          <span>Trusted by students from</span>
          <div className="trust-dots">
            <span className="dot">Stanford</span>
            <span className="dot">NYU</span>
            <span className="dot">IIT</span>
            <span className="dot">Waterloo</span>
          </div>
        </div>
      </header>

      <section className="mentors">
        <div className="section-head">
          <p className="eyebrow">Featured mentors</p>
          <h2>Pick the right guide for where you want to go.</h2>
          <p>
            Book a free intro to align on goals, then join a guided mentorship path with
            weekly sessions, async feedback, and career-ready projects.
          </p>
          <div className="mentor-nav">
            <button className="ghost tiny" onClick={() => scrollMentors('prev')}>
              ←
            </button>
            <button className="ghost tiny" onClick={() => scrollMentors('next')}>
              →
            </button>
            <button className="tiny" onClick={() => setShowExplore(true)}>
              View all
            </button>
          </div>
        </div>
        <div className="mentor-slider">
          <div className="mentor-track" ref={mentorTrackRef}>


            {mentors.map((mentor) => (
              <div className="mentor-card" key={mentor.name}>
                <div className="mentor-row1">
                  <div className="avatar-img">
                    <img src={mentor.image} alt={mentor.name} />
                  </div>
                  <div className="identity">
                    <h4>{mentor.name}</h4>
                    <p className="meta">{mentor.role}</p>
                    {mentor.assured && <span className="assured-pill">Platform assured</span>}
                  </div>
                </div>
                <div className="mentor-row2">
                  <p className="mentor-text">{mentor.focus}</p>
                  <span className="rating">
                    {renderStars(mentor.rating)} <span className="rating-num">{mentor.rating}</span>
                  </span>
                  <div className="mentor-actions">
                    <button className="tiny">Book your free session</button>
                  </div>
                </div>
              </div>
            ))}


          </div>
        </div>
      </section>

      <section className="grid highlights">
        <div className="panel">
          <p className="eyebrow">Who can join</p>
          <h2>Built for every student profile.</h2>
          <p>
            Whether you are starting out, leveling up, exploring as a hobby, or finishing
            your final-year project, Internify pairs you with mentors who build alongside
            you and keep you on track every week.
          </p>
          <div className="chips">
            {highlights.map((item) => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="panel steps">
          <p className="eyebrow">How it works</p>
          <h3>Get started in four steps</h3>
          <ul>
            {steps.map((step) => (
              <li key={step.title}>
                <div className="step-dot" />
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="courses">
        <div className="section-head">
          <p className="eyebrow">Latest for 2026</p>
          <h2>Top mentor-led paths for the year ahead.</h2>
          <p>Curated skills with real projects so you stay ahead of what teams need next.</p>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <div className="course-card" key={course.title}>
              <div className="course-top">
                <h4>{course.title}</h4>
                <span className="course-tag">{course.tag}</span>
              </div>
              <p className="course-detail">{course.detail}</p>
              <button className="tiny ghost">Explore path</button>
            </div>
          ))}
        </div>
      </section>

      <section className="outcomes">
        <div className="section-head">
          <p className="eyebrow">Outcomes that matter</p>
          <h2>Everything is built to get you job-ready.</h2>
        </div>
        <div className="outcome-grid">
          {outcomes.map((item) => (
            <div className="outcome-card" key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          ))}
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

      <section className="boost">
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

      <section className="cta">
        <div>
          <p className="eyebrow">Start free</p>
          <h2>Find your career path.</h2>
          <p>
            Start with a free session to feel the fit. If it clicks, we design your guided
            path together and start building real work.
          </p>
        </div>
        <div className="cta-actions">
          <button className="primary">Find your career path</button>
          <button className="ghost">See mentorship paths</button>
        </div>
      </section>

      <footer className="footer-rich">
        <div className="footer-brand">
          <div className="brand">
            <span className="dot-logo" />
            <span>Internify.</span>
          </div>
          <p>Bridging the gap between academic curriculum and industry demands.</p>
          <small>Internify powered by Gelora Technologies Pvt. Ltd.</small>
          <small>CIN: U63120KL2025PTC098876</small>
        </div>
        <div className="footer-column">
          <h4>Contact</h4>
          <p>internship@internify.online</p>
          <p>Ernakulam, Kerala 682016</p>
        </div>
        <div className="footer-column">
          <h4>Legal</h4>
          <p>Terms &amp; Conditions</p>
          <p>Privacy Policy</p>
          <p>Refund Policy</p>
        </div>
      </footer>
    </div>
  )
}

export default App
