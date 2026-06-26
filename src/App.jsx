import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom'
import Explore from './pages/Explore/Search.jsx'
import Resources from './pages/Learning/Resources.jsx'
import MentorProfile from './pages/Explore/MentorProfileView.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
import Dashboard from './pages/Student/StudentDashboard.jsx'
import MentorDashboard from './pages/Mentor/MentorDashboard.jsx'
import Payment from './pages/Learning/Payment.jsx'
import LandingPage from './pages/Landing/LandingPage.jsx'
import ApplyMentor from './pages/Explore/ApplyMentor.jsx'
import Profile from './pages/Student/Profile.jsx'
import NotFound from './pages/NotFound.jsx'
import PrivacyPolicy from './pages/Legal/PrivacyPolicy.jsx'
import TermsConditions from './pages/Legal/TermsConditions.jsx'
import ContactUs from './pages/Legal/ContactUs.jsx'
import { courses, mentors } from './data/staticData.js'
import supabase from './supabaseClient'
import { getAuthenticatedUser, getStoredAuthData, clearAuthData } from './utils/auth.js'

// Helper function to render stars
const renderStars = (score) => {
  const full = Math.floor(score)
  const half = score - full >= 0.5
  const stars = Array(5).fill('☆').map((star, i) => {
    if (i < full) return '★'
    if (i === full && half) return '½'
    return '☆'
  }).join('')
  return stars
}

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = getStoredAuthData()

      if (storedAuth) {
        const authUser = await getAuthenticatedUser()

        if (authUser) {
          setIsLoggedIn(true)
          setUserRole(authUser.role)
        } else {
          clearAuthData()
          setIsLoggedIn(false)
          setUserRole(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

// Explore Page Wrapper
function ExplorePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [mentorData, setMentorData] = useState(null)
  const [courseData, setCourseData] = useState(null)
  const [isLoadingExplore, setIsLoadingExplore] = useState(false)
  const initialQuery = searchParams.get('q') || ''
  const initialTab = searchParams.get('tab') || 'mentors'

  useEffect(() => {
    const fetchExploreData = async () => {
      setIsLoadingExplore(true)

      // Fetch both in parallel
      const [mentorsRes, coursesRes] = await Promise.all([
        supabase.from('mentors_details').select('*'),
        supabase.from('courses').select('*')
      ])

      const { data: mentorsFromApi, error: mentorsError } = mentorsRes
      const { data: coursesFromApi, error: coursesError } = coursesRes

      if (mentorsError) console.error('Error fetching mentors:', mentorsError)
      if (coursesError) console.error('Error fetching courses:', coursesError)

      if (mentorsFromApi && coursesFromApi) {
        // Link mentors with their full course objects
        const linkedMentors = mentorsFromApi.map(mentor => {
          const mentorCourseIds = mentor.coursesOffered || mentor.courses || []
          const fullCourses = coursesFromApi.filter(c =>
            mentorCourseIds.includes(c.course_id) ||
            mentorCourseIds.includes(String(c.course_id))
          )
          return {
            ...mentor,
            fullCoursesOffered: fullCourses
          }
        })
        setMentorData(linkedMentors)
        setCourseData(coursesFromApi)
      } else if (mentorsFromApi) {
        setMentorData(mentorsFromApi)
      } else if (coursesFromApi) {
        setCourseData(coursesFromApi)
      }

      setIsLoadingExplore(false)
    }

    fetchExploreData()
  }, [])

  const mentorsToUse = mentorData || mentors
  const coursesToUse = courseData || courses

  const handleMentorClick = (mentor) => {
    const mentorId = mentor.mentor_id || mentor.id || mentor.name
    navigate(`/mentor/${mentorId}`, { state: { mentor } })
  }

  return (
    <Explore
      mentors={mentorsToUse}
      courses={coursesToUse}
      onBack={() => navigate(-1)}
      renderStars={renderStars}
      initialQuery={initialQuery}
      initialTab={initialTab}
      onMentorClick={handleMentorClick}
      isLoading={isLoadingExplore}
    />
  )
}

// Resources Page Wrapper
function ResourcesPage() {
  const navigate = useNavigate()

  const handleMentorClick = (mentor) => {
    const mentorId = mentor.mentor_id || mentor.id || mentor.name
    navigate(`/mentor/${mentorId}`, { state: { mentor } })
  }

  return (
    <Resources
      onBack={() => navigate('/')}
      mentors={mentors}
      onMentorClick={handleMentorClick}
    />
  )
}

// Helper to normalize mentor data from Supabase
const normalizeMentorData = (data) => {
  if (!data) return null;
  return {
    id: data.mentor_id || data.id,
    mentor_id: data.mentor_id || data.id,
    name: data.name || data.full_name || 'Mentor',
    bio: data.about || data.bio || '',
    location: data.address || data.location || '',
    profileImage: data.profile_image || data.image || '',
    category: Array.isArray(data.category) ? data.category.join(', ') : data.category || '',
    coursesOffered: data.coursesOffered || data.courses || [],
    expertise: data.experties_in || [],
    skills: (data.skills || []).map(s => typeof s === 'string' ? s : (s.name || s.skill_name || '')).filter(Boolean),
    education: data.education || [],
    experience: data.experience || [],
    testimonials: data.testimonial || data.testimonials || [],
    isVerified: data.is_verified || data.assured || false,
    platformAssured: data.is_platformAssured || false,
    role: data.role || (data.experience?.[0]?.role || ''),
    company: data.company || (data.experience?.[0]?.company || ''),
    experienceYears: data.experience?.[0]?.years || 5,
    rating: data.rating || data.avg_rating || 5.0,
  }
}

// Mentor Profile Page Wrapper
function MentorProfilePage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [mentor, setMentor] = useState(location.state?.mentor || null)
  const [loading, setLoading] = useState(!location.state?.mentor)

  useEffect(() => {
    const fetchMentor = async () => {
      if (mentor) {
        setLoading(false)
        return
      }

      setLoading(true)
      // First check static data
      const staticMentor = mentors.find(m =>
        (m.id && String(m.id) === id) ||
        (m.mentor_id && String(m.mentor_id) === id) ||
        (m.name && m.name === id)
      )

      if (staticMentor) {
        setMentor(staticMentor)
        setLoading(false)
        return
      }

      // If not in static, fetch from Supabase
        const isNumeric = /^\d+$/.test(id);
        const { data, error } = await supabase
          .from('mentors_details')
          .select('*')
          .or(isNumeric ? `mentor_id.eq.${id},id.eq.${id}` : `mentor_id.eq.${id}`)
          .maybeSingle()

        if (error) {
        console.error('Supabase fetch error:', error)
        // Fallback to searching by name if ID search fails
        const { data: nameData } = await supabase
          .from('mentors_details')
          .select('*')
          .eq('name', id)
          .maybeSingle()
        
        if (nameData) {
          setMentor(normalizeMentorData(nameData))
        }
      } else if (data) {
        setMentor(normalizeMentorData(data))
      }
      setLoading(false)
    }

    fetchMentor()
  }, [id])

  if (loading) return <div className="loading-container">Loading mentor profile...</div>

  if (!mentor) {
    return (
      <div className="resources-page-container font-sans" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', background: '#f8fafc' }}>
        <button 
          className="back-button-floating-premium" 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 100, background: 'white', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="resource-glass-card" style={{ padding: '4rem 3rem', textAlign: 'center', maxWidth: '500px', background: 'white', border: '1px solid rgba(15,23,42,0.05)', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>🔍</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>Mentor Not Found</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            We couldn't find the mentor you're looking for. They might have updated their profile or no longer be available.
          </p>
          <button 
            className="book-session-btn" 
            style={{ margin: '0 auto', width: 'auto', padding: '0.75rem 2rem' }} 
            onClick={() => navigate('/explore')}
          >
            Browse Mentors
          </button>
        </div>
      </div>
    )
  }

  return (
    <MentorProfile
      mentor={mentor}
      courses={courses}
      onBack={() => navigate(-1)}
      renderStars={renderStars}
    />
  )
}

// Login Page Wrapper
function LoginPage() {
  const navigate = useNavigate()

  return (
    <Login
      onBack={() => navigate('/')}
      onShowSignup={() => navigate('/signup')}
    />
  )
}

// Signup Page Wrapper
function SignupPage() {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = getStoredAuthData()
      if (storedAuth) {
        const authUser = await getAuthenticatedUser()
        if (authUser) {
          setIsLoggedIn(true)
          setUserRole(authUser.role)
        }
      }
    }
    checkAuth()
  }, [])

  const handleSignup = (user) => {
    console.log('Signup success:', user)
    setUserRole('student')
    setIsLoggedIn(true)
    
    const pendingCourse = sessionStorage.getItem('pendingCourse')
    if (pendingCourse && user.role !== 'mentor') {
      const course = JSON.parse(pendingCourse)
      sessionStorage.removeItem('pendingCourse')
      navigate('/payment', { state: { course } })
    } else {
      navigate('/dashboard')
    }
  }

  if (isLoggedIn) {
    if (userRole === 'mentor') {
      return <Navigate to="/mentor-dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Signup
      onBack={() => navigate('/login')}
      onSignup={handleSignup}
    />
  )
}

// Payment Page Wrapper
function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)

  // Extract course from navigation state
  const selectedCourse = location.state?.course

  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = getStoredAuthData()
      if (storedAuth) {
        const authUser = await getAuthenticatedUser()
        if (authUser) {
          // Security Check: Mentors cannot be here
          if (authUser.role === 'mentor') {
            alert("Mentors cannot access the payment page.")
            navigate('/mentor-dashboard')
            return
          }
          setIsLoggedIn(true)
          setUserRole(authUser.role)
        } else {
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    }
    checkAuth()
  }, [navigate])

  const handlePaymentSuccess = () => {
    setIsLoggedIn(true)
    navigate('/dashboard')
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <Payment
      course={selectedCourse}
      onBack={() => navigate(-1)}
      onPaymentSuccess={handlePaymentSuccess}
    />
  )
}

// Student Dashboard Wrapper
function StudentDashboardPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      clearAuthData()
      // Force clear Supabase tokens from localStorage
      localStorage.removeItem('sb-zupzvpepzkjeaelxczlz-auth-token')
      navigate('/')
    }
  }

  const openProfile = () => {
    navigate('/profile')
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      onOpenExplore={() => navigate('/explore')}
      onOpenProfile={openProfile} // pass the function to Dashboard
    />
  )
}

// Mentor Dashboard Wrapper
function MentorDashboardPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      clearAuthData()
      // Force clear Supabase tokens from localStorage
      localStorage.removeItem('sb-zupzvpepzkjeaelxczlz-auth-token')
      navigate('/')
    }
  }

  return <MentorDashboard onLogout={handleLogout} />
}

// Profile Page Wrapper
function ProfilePage() {
  const navigate = useNavigate();

  return (
    <Profile
      onBack={() => navigate('/dashboard')}
    />
  );
}

// Landing Page Wrapper
function LandingPageWrapper() {
  const [userRole, setUserRole] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = getStoredAuthData()
      if (storedAuth) {
        const authUser = await getAuthenticatedUser()
        if (authUser) {
          setIsLoggedIn(true)
          setUserRole(authUser.role)
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return null
  }

  if (isLoggedIn) {
    if (userRole === 'mentor') {
      return <Navigate to="/mentor-dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return (
    <LandingPage
      onOpenExplore={() => { }}
      onOpenResources={() => { }}
      onOpenLogin={() => { }}
      onMentorClick={() => { }}
      onBookSession={() => { }}
      renderStars={renderStars}
    />
  )
}

// Main App Component
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/apply-mentor" element={<ApplyMentor />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route path="/mentor/:id" element={<MentorProfilePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor-dashboard"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
