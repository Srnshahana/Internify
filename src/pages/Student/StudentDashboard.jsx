
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
import '../../App.css'

function DashboardContent({ onLogout, activePage, setActivePage, isLiveClassroomActive, setIsLiveClassroomActive, selectedMentor, setSelectedMentor, navItems, renderPage }) {
  const { loading } = useDashboardData()

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

  return (
    <div className={`dashboard-layout-new ${isLiveClassroomActive ? 'live-classroom-active' : ''}`}>
      {!isLiveClassroomActive && (
        <>
          {/* Bottom Navigation Bar */}
          <nav className="premium-bottom-nav">
            <div className="bottom-nav-container">
              {/* Sliding Glass Highlight */}
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

          {/* Top Header - Reused from Landing Page */}
          {activePage !== 'Profile' && activePage !== 'Home' && activePage !== 'Classrooms' && activePage !== 'Calendar' && (
            <StudentAppBar
              onLogout={onLogout}
              isTransparent={activePage === 'Home'}
              hideLogout={activePage === 'Home'}
            />
          )}
        </>
      )}

      <main className="dashboard-main-new">
        <div className={`dashboard-content-new ${activePage === 'Profile' ? 'student-profile-no-padding' : ''}`}>
          {renderPage(activePage, setActivePage)}
        </div>
      </main>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('Home')
  const [isLiveClassroomActive, setIsLiveClassroomActive] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('dashboard-theme')
    return savedTheme || 'light'
  })

  // Set theme for dashboard
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dashboard-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const navItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Classrooms', label: 'Classrooms', icon: ClassroomIcon },
    { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'Profile', label: 'Profile', icon: ProfileIcon },
  ]

  const renderPage = (page) => {
    switch (page) {
      case 'Home':
        return <Home onNavigate={setActivePage} onMentorClick={setSelectedMentor} />
      case 'Classrooms':
        return (
          <MyCourses
            courses={courses}
            onBack={() => setActivePage('Home')}
            onEnterClassroom={() => setIsLiveClassroomActive(true)}
            onMentorClick={setSelectedMentor}
          />
        )
      case 'Calendar':
        return <Calendar />
      case 'Explore':
        return selectedMentor ? (
          <MentorProfile mentor={selectedMentor} onBack={() => setSelectedMentor(null)} />
        ) : (
          <Explore onMentorClick={setSelectedMentor} />
        )
      case 'Profile':
        return <Profile />
      case 'Notification':
        return <Notification />
      case 'Assessments':
        return <Assessments />
      default:
        return <Home />
    }
  }

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
        selectedMentor={selectedMentor}
        setSelectedMentor={setSelectedMentor}
        navItems={navItems}
        renderPage={renderPage}
      />
    </DashboardDataProvider>
  )
}

export default Dashboard
