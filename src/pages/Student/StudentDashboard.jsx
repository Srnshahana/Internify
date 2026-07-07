
import Loading from '../../components/Loading'
import StudentAppBar from '../../components/shared/StudentAppBar.jsx'
import { useState, useEffect } from 'react'
import Home from './Home.jsx'
import MyCourses from './MyCourses.jsx'
import Calendar from './Calendar.jsx'
import Explore from '../Explore/Search.jsx'
import Profile from './Profile.jsx'
import Notification from './Notification.jsx'
import Assessments from './Assessments.jsx'
import MentorProfile from '../Explore/MentorProfileView.jsx'
import { HomeIcon, ProfileIcon, NotificationIcon, LogoutIcon, SunIcon, MoonIcon, GridIcon, FolderIcon, SettingsIcon, SearchIcon, CalendarIcon, ClassroomIcon } from '../../components/Icons.jsx'
import OnboardingModal from '../../components/shared/OnboardingModal.jsx'
import { courses } from '../../data/staticData.js'
import { DashboardDataProvider, useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom'
import CourseDetail from './CourseDetail.jsx'
import StudentLiveClassroom from './StudentLiveClassroom.jsx'
// import Sidebar from '../../components/shared/Sidebar.jsx' // Removed


function CourseDetailWrapper({ onMentorClick }) {
  const { id } = useParams();
  const { enrolledCourses } = useDashboardData();
  const navigate = useNavigate();
  // Find course or default to null
  const course = enrolledCourses.find(c => String(c.id) === id) || enrolledCourses.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === id) || enrolledCourses[0];
  
  if (!course) return <div style={{padding: '40px', textAlign: 'center'}}>Course not found</div>;
  
  return (
    <CourseDetail
      course={course}
      onBack={() => navigate(-1)}
      onEnterClassroom={(c) => navigate('/dashboard/classroom/' + c.id)}
      onMentorClick={onMentorClick}
    />
  );
}

function LiveClassroomWrapper() {
  const { id } = useParams();
  const { enrolledCourses } = useDashboardData();
  const navigate = useNavigate();
  const course = enrolledCourses.find(c => String(c.id) === id) || enrolledCourses.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === id) || enrolledCourses[0];
  
  if (!course) return <div style={{padding: '40px', textAlign: 'center'}}>Classroom not found</div>;

  return (
    <StudentLiveClassroom
      course={course}
      onBack={() => navigate(-1)}
    />
  );
}

const DashboardContent = ({ onLogout, activePage, setActivePage, isLiveClassroomActive, setIsLiveClassroomActive, isCourseDetailActive, setIsCourseDetailActive, navItems, searchQuery, setSearchQuery }) => {
  const { loading, enrolledCourses, studentProfile, authUser, refetch } = useDashboardData()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [previousPage, setPreviousPage] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && (!studentProfile || !studentProfile.onboarding_completed)) {
      setShowOnboarding(true)
    } else {
      setShowOnboarding(false)
    }
  }, [loading, studentProfile])


  if (loading) {
    return <Loading fullScreen={true} />
  }

  const handleMentorClick = (mentor) => {
    navigate(`/mentor/${mentor.id || mentor.mentor_id || mentor.name}`)
  }
  
  const pathParts = location.pathname.split('/').filter(Boolean)
  const lastPart = pathParts[1] || 'home'
  
  let currentActivePage = 'Home'
  if (lastPart === 'classrooms') currentActivePage = 'Classrooms'
  else if (lastPart === 'calendar') currentActivePage = 'Calendar'
  else if (lastPart === 'explore') currentActivePage = 'Explore'
  else if (lastPart === 'profile') currentActivePage = 'Profile'
  else if (lastPart === 'notification') currentActivePage = 'Notification'
  else if (lastPart === 'assessments') currentActivePage = 'Assessments'
  else if (lastPart === 'course') currentActivePage = 'CourseDetail'
  else if (lastPart === 'classroom') currentActivePage = 'LiveClassroom'
  
  const handleNavigate = (page) => {
    switch (page) {
      case 'Home': navigate('/dashboard'); break;
      case 'Classrooms': navigate('/dashboard/classrooms'); break;
      case 'Calendar': navigate('/dashboard/calendar'); break;
      case 'Explore': navigate('/dashboard/explore'); break;
      case 'Profile': navigate('/dashboard/profile'); break;
      case 'Notification': navigate('/dashboard/notification'); break;
      case 'Assessments': navigate('/dashboard/assessments'); break;
      default: navigate('/dashboard'); break;
    }
  }

  const renderRoutes = () => (
    <Routes>
      <Route path="/" element={<Home onNavigate={handleNavigate} onMentorClick={handleMentorClick} setIsCourseDetailActive={() => {}} setSearchQuery={setSearchQuery} />} />
      <Route path="classrooms" element={<MyCourses courses={enrolledCourses} onBack={() => navigate('/dashboard')} onEnterClassroom={(c) => navigate('/dashboard/classroom/' + (c?.id || ''))} onMentorClick={handleMentorClick} setIsCourseDetailActive={() => {}} onNavigate={handleNavigate} />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="explore" element={<Explore onMentorClick={handleMentorClick} initialQuery={searchQuery} onBack={() => { navigate('/dashboard'); setSearchQuery(''); }} isLoading={loading} />} />
      <Route path="profile" element={<Profile onLogout={onLogout} onNavigate={handleNavigate} />} />
      <Route path="notification" element={<Notification />} />
      <Route path="assessments" element={<Assessments onBack={() => navigate('/dashboard')} />} />
      <Route path="course/:id" element={<CourseDetailWrapper onMentorClick={handleMentorClick} />} />
      <Route path="classroom/:id" element={<LiveClassroomWrapper />} />
      <Route path="*" element={<Home onNavigate={handleNavigate} onMentorClick={handleMentorClick} setIsCourseDetailActive={() => {}} setSearchQuery={setSearchQuery} />} />
    </Routes>
  );


  return (
    <div className={`dashboard-layout-new ${currentActivePage === 'LiveClassroom' ? 'live-classroom-active' : ''}`}>
      {showOnboarding && (
        <OnboardingModal
          user={authUser}
          profile={studentProfile}
          onComplete={async () => {
            await refetch()
            setShowOnboarding(false)
          }}
          onClose={() => setShowOnboarding(false)}
        />
      )}
      {/* Top Header - Restored */}
      {/* Top Header - Restored */}
      {/* Top Header - Restored */}
      {currentActivePage !== 'LiveClassroom' && currentActivePage !== 'Home' && currentActivePage !== 'Classrooms' && currentActivePage !== 'Profile' && currentActivePage !== 'Calendar' && currentActivePage !== 'Explore' && currentActivePage !== 'CourseDetail' && (
        <StudentAppBar
          onLogout={onLogout}
          isTransparent={false} // Traditional opaque bar
          hideLogout={false}
          hideProfile={false} // Ensure profile is shown on left
        />
      )}

      {/* Main Content - Full Width */}
      <main className="dashboard-main-new full-width-main" >
        <div 
          className={`dashboard-content-new ${currentActivePage === 'Profile' ? 'student-profile-no-padding' : ''}`} 
          style={{
            ...(currentActivePage === 'Home' || currentActivePage === 'Classrooms' || currentActivePage === 'Calendar' || currentActivePage === 'CourseDetail' || currentActivePage === 'LiveClassroom' ? { padding: 0, maxWidth: '100%' } : currentActivePage === 'Explore' ? { padding: '0 20px', maxWidth: '100%' } : {}),
            display: 'block'
          }}
        >
          {renderRoutes()}
        </div>
      </main>

      {/* Bottom Navigation for Mobile Only (optional if needed, user didn't mention it but requested traditional app bar, so assuming desktop focus) */}
      {currentActivePage !== 'LiveClassroom' && currentActivePage !== 'CourseDetail' && (
        <nav className="premium-bottom-nav">
          <div className="bottom-nav-container">
            <div
              className="nav-glass-highlight"
              style={{
                transform: `translateX(${navItems.findIndex(item => item.id === currentActivePage) * 100}%)`
              }}
            />
            {navItems.map((item) => {
              const IconComponent = item.icon
              const isActive = currentActivePage === item.id
              return (
                <button
                  key={item.id}
                  className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.id)}
                >
                  <div className="nav-icon-wrapper">
                    <IconComponent />
                  </div>
                  <span className="nav-label">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('Home')
  const [isLiveClassroomActive, setIsLiveClassroomActive] = useState(false)
  const [isCourseDetailActive, setIsCourseDetailActive] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [theme] = useState('light')

  // Set theme for dashboard
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
    localStorage.setItem('dashboard-theme', 'light')
  }, [])

  const toggleTheme = () => {
    // Theme toggle disabled
  }

  const navItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Classrooms', label: 'Classrooms', icon: ClassroomIcon },
    { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'Profile', label: 'Profile', icon: ProfileIcon },
  ]

  return (
    <DashboardDataProvider>
      <style>{`
        @keyframes spinner {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <DashboardContent
        onLogout={onLogout}
        activePage={activePage}
        setActivePage={setActivePage}
        isLiveClassroomActive={isLiveClassroomActive}
        setIsLiveClassroomActive={setIsLiveClassroomActive}
        isCourseDetailActive={isCourseDetailActive}
        setIsCourseDetailActive={setIsCourseDetailActive}
        navItems={navItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </DashboardDataProvider>
  )
}

export default Dashboard
