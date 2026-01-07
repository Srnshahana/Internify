import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams, useParams } from 'react-router-dom'
import Explore from './search.jsx'
import Resources from './Resources.jsx'
import MentorProfile from './mentorProfile.jsx'
import Login from './login.jsx'
import Signup from './signup.jsx'
import Dashboard from './Dashboard.jsx'
import MentorDashboard from './pages/mentor_dashboard/MentorDashboard.jsx'
import Payment from './payment.jsx'
import LandingPage from './pages/LandingPage.jsx'
import ApplyMentor from './pages/ApplyMentor.jsx'
import { courses, mentors } from './Data.jsx'
import supabase from './supabaseClient'
import { getAuthenticatedUser, getStoredAuthData, clearAuthData } from './utils/auth.js'
import './App.css'

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

  useEffect(() => {
    const fetchExploreData = async () => {
      setIsLoadingExplore(true)

      const { data: mentorsFromApi, error: mentorsError } = await supabase
        .from('mentors_details')
        .select('*')

      if (mentorsError) console.error('Error fetching mentors:', mentorsError)
      else setMentorData(mentorsFromApi)

      const { data: coursesFromApi, error: coursesError } = await supabase
        .from('courses')
        .select('*')

      if (coursesError) console.error('Error fetching courses:', coursesError)
      else setCourseData(coursesFromApi)

      setIsLoadingExplore(false)
    }

    fetchExploreData()
  }, [])

  const mentorsToUse = mentorData || mentors
  const coursesToUse = courseData || courses

  const handleMentorClick = (mentor) => {
    const mentorId = mentor.mentor_id || mentor.id || mentor.name
    navigate(`/mentor/${mentorId}`)
  }

  const handleBookSession = () => {
    navigate('/login')
  }

  return (
    <Explore
      mentors={mentorsToUse}
      courses={coursesToUse}
      onBack={() => navigate('/')}
      renderStars={renderStars}
      initialQuery={initialQuery}
      onMentorClick={handleMentorClick}
      onBookSession={handleBookSession}
      isLoading={isLoadingExplore}
    />
  )
}

// Resources Page Wrapper
function ResourcesPage() {
  const navigate = useNavigate()

  const handleMentorClick = (mentor) => {
    const mentorId = mentor.mentor_id || mentor.id || mentor.name
    navigate(`/mentor/${mentorId}`)
  }

  const handleBookSession = () => {
    navigate('/login')
  }

  return (
    <Resources
      onBack={() => navigate('/')}
      mentors={mentors}
      onBookSession={handleBookSession}
      onMentorClick={handleMentorClick}
    />
  )
}

// Mentor Profile Page Wrapper
function MentorProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find mentor by ID
  const mentor = mentors.find(m =>
    (m.id && String(m.id) === id) ||
    (m.mentor_id && String(m.mentor_id) === id) ||
    (m.name && m.name === id)
  )

  if (!mentor) {
    return (
      <div className="page">
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
        <h1>Mentor not found</h1>
      </div>
    )
  }

  const handleBookSession = () => {
    navigate('/login')
  }

  return (
    <MentorProfile
      mentor={mentor}
      courses={courses}
      onBack={() => navigate(-1)}
      renderStars={renderStars}
      onBookSession={handleBookSession}
    />
  )
}

// Login Page Wrapper
function LoginPage() {
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

  const handleLogin = async (user) => {
    console.log('Login success:', user)
    const role = user?.role || 'student'
    setUserRole(role)
    setIsLoggedIn(true)
    navigate('/payment')
  }

  const handleSignup = (user) => {
    console.log('Signup success:', user)
    setUserRole('student')
    setIsLoggedIn(true)
    navigate('/payment')
  }

  if (isLoggedIn) {
    if (userRole === 'mentor') {
      return <Navigate to="/mentor-dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Login
      onBack={() => navigate('/')}
      onLogin={handleLogin}
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
    navigate('/payment')
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = getStoredAuthData()
      if (storedAuth) {
        const authUser = await getAuthenticatedUser()
        if (authUser) {
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
    if (userRole === 'mentor') {
      navigate('/mentor-dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <Payment
      onBack={() => navigate('/')}
      onPaymentSuccess={handlePaymentSuccess}
    />
  )
}

// Student Dashboard Wrapper
function StudentDashboardPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearAuthData()
    navigate('/')
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      onOpenExplore={() => navigate('/explore')}
    />
  )
}

// Mentor Dashboard Wrapper
function MentorDashboardPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearAuthData()
    navigate('/')
  }

  return <MentorDashboard onLogout={handleLogout} />
}

// Main App Component
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onOpenExplore={() => { }}
              onOpenResources={() => { }}
              onOpenLogin={() => { }}
              onMentorClick={() => { }}
              onBookSession={() => { }}
              renderStars={renderStars}
            />
          }
        />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
