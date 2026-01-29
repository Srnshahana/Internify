
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
import { courses } from '../../data/staticData.js'
import { DashboardDataProvider, useDashboardData } from '../../contexts/DashboardDataContext.jsx'
// import Sidebar from '../../components/shared/Sidebar.jsx' // Removed
import '../../App.css'

function DashboardContent({ onLogout, activePage, setActivePage, isLiveClassroomActive, setIsLiveClassroomActive, isCourseDetailActive, setIsCourseDetailActive, selectedMentor, setSelectedMentor, navItems, searchQuery, setSearchQuery }) {
  const { loading, enrolledCourses } = useDashboardData()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#eff9ff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e0f2fe',
            borderTop: '4px solid #0ea5e9',
            borderRadius: '50%',
            animation: 'spinner 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#0ea5e9', fontSize: '16px', fontWeight: 500 }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const renderPage = (page) => {
    switch (page) {
      case 'Home':
        return <Home onNavigate={setActivePage} onMentorClick={setSelectedMentor} setIsCourseDetailActive={setIsCourseDetailActive} setSearchQuery={setSearchQuery} />
      case 'Classrooms':
        return (
          <MyCourses
            courses={enrolledCourses}
            onBack={() => setActivePage('Home')}
            onEnterClassroom={() => setIsLiveClassroomActive(true)}
            onMentorClick={setSelectedMentor}
            setIsCourseDetailActive={setIsCourseDetailActive}
          />
        )
      case 'Calendar':
        return <Calendar />
      case 'Explore':
        return selectedMentor ? (
          <MentorProfile mentor={selectedMentor} onBack={() => setSelectedMentor(null)} />
        ) : (
          <Explore
            onMentorClick={setSelectedMentor}
            initialQuery={searchQuery}
            onBack={() => {
              setActivePage('Home');
              setSearchQuery('');
            }}
          />
        )
      case 'Profile':
        return <Profile />
      case 'Notification':
        return <Notification />
      case 'Assessments':
        return <Assessments />
      default:
        return <Home onNavigate={setActivePage} onMentorClick={setSelectedMentor} setIsCourseDetailActive={setIsCourseDetailActive} setSearchQuery={setSearchQuery} />
    }
  }

  return (
    <div className={`dashboard-layout-new ${isLiveClassroomActive ? 'live-classroom-active' : ''}`}>
      {/* Top Header - Restored */}
      {!isLiveClassroomActive && (
        <StudentAppBar
          onLogout={onLogout}
          isTransparent={false} // Traditional opaque bar
          hideLogout={false}
          hideProfile={false} // Ensure profile is shown on left
        />
      )}

      {/* Main Content - Full Width */}
      <main className="dashboard-main-new full-width-main">
        <div className={`dashboard-content-new ${activePage === 'Profile' ? 'student-profile-no-padding' : ''}`}>
          {renderPage(activePage)}
        </div>
      </main>

      {/* Bottom Navigation for Mobile Only (optional if needed, user didn't mention it but requested traditional app bar, so assuming desktop focus) */}
      {!isLiveClassroomActive && !isCourseDetailActive && (
        <nav className="premium-bottom-nav">
          <div className="bottom-nav-container">
            <div
              className="nav-glass-highlight"
              style={{
                transform: `translateX(${navItems.findIndex(item => item.id === activePage) * 100}%)`
              }}
            />
            {navItems.map((item) => {
              const IconComponent = item.icon
              const isActive = activePage === item.id
              return (
                <button
                  key={item.id}
                  className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
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
  const [selectedMentor, setSelectedMentor] = useState(null)
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
        selectedMentor={selectedMentor}
        setSelectedMentor={setSelectedMentor}
        navItems={navItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </DashboardDataProvider>
  )
}

export default Dashboard
