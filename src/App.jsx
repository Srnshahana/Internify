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
import { courses, mentors } from './data/staticData.js'
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
            mentorCourseIds.includes(c.id) ||
            mentorCourseIds.includes(String(c.id))
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
      onBack={() => navigate(-1)}
      mentors={mentors}
      onMentorClick={handleMentorClick}
    />
  )
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
      try {
        const { data, error } = await supabase
          .from('mentors_details')
          .select('*')
          .or(`mentor_id.eq.${id}, id.eq.${id}`)
          .single()

        if (error) throw error

        if (data) {
          // Normalize the data using a similar logic as getMentorData
          const normalized = {
            id: data.mentor_id || data.id,
            name: data.name || data.full_name || 'Mentor',
            bio: data.about || data.bio || '',
            location: data.address || data.location || '',
            profileImage: data.profile_image || data.image || '',
            category: Array.isArray(data.category) ? data.category.join(', ') : data.category || '',
            coursesOffered: data.coursesOffered || data.courses || [],
            expertise: data.experties_in || [],
            skills: (data.skills || []).map(s => typeof s === 'string' ? s : (s.name || '')).filter(Boolean),
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
          setMentor(normalized)
        }
      } catch (err) {
        console.error('Error fetching mentor details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMentor()
  }, [id])

  if (loading) return <div className="loading-container">Loading mentor profile...</div>

  if (!mentor) {
    return (
      <div className="page" style={{ padding: '40px', textAlign: 'center' }}>
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>Mentor not found</h1>
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
