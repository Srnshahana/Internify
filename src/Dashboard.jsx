import { useState, useEffect } from 'react'
import Home from './pages/student_dashboard/Home.jsx'
import Calendar from './pages/student_dashboard/Calendar.jsx'
import Profile from './pages/student_dashboard/Profile.jsx'
import Notification from './pages/student_dashboard/Notification.jsx'
import Assessments from './pages/student_dashboard/Assessments.jsx'
import MentorProfile from './mentorProfile.jsx'
import { HomeIcon, CalendarIcon, ProfileIcon, NotificationIcon, LogoutIcon, SunIcon, MoonIcon, GridIcon, FolderIcon, SettingsIcon, SearchIcon } from './components/Icons.jsx'
import { courses } from './Data.jsx'
import './App.css'

function Dashboard({ onLogout, onOpenExplore }) {
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

  const sidebarMenuItems = [
    { id: 'Home', icon: HomeIcon },
    { id: 'Calendar', icon: CalendarIcon },
    { id: 'Profile', icon: SettingsIcon },
  ]

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    return Array(5).fill(0).map((_, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
  }

  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor)
  }

  const handleBackFromProfile = () => {
    setSelectedMentor(null)
  }

  const renderPage = (page, setPage) => {
    switch (page) {
      case 'Home':
        return (
          <Home
            onNavigate={(pageName) => {
              if (pageName === 'Explore' && onOpenExplore) {
                onOpenExplore()
              } else {
                setPage(pageName)
              }
            }}
            onMentorClick={handleMentorClick}
          />
        )
      case 'Calendar':
        return <Calendar />
      case 'Assessments':
        return <Assessments onBack={() => setActivePage('Home')} />
      case 'Profile':
        return <Profile />
      case 'Notification':
        return <Notification />
      default:
        return <Home onNavigate={(pageName) => setPage(pageName)} onMentorClick={handleMentorClick} />
    }
  }

  if (selectedMentor) {
    return (
      <MentorProfile
        mentor={selectedMentor}
        courses={courses}
        onBack={handleBackFromProfile}
        renderStars={renderStars}
        onBookSession={() => {
          // Handle book session - could navigate to calendar or show modal
          console.log('Book session clicked')
        }}
      />
    )
  }
  return (
    <div className={`dashboard-layout-new ${isLiveClassroomActive ? 'live-classroom-active' : ''}`}>
      {!isLiveClassroomActive && (
        <>
          {/* Left Sidebar Navigation */}
          <aside className="dashboard-sidebar-nav">
            <div className="sidebar-nav-top">
              <button className="sidebar-nav-logo-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>
            <nav className="sidebar-nav-menu">
              {sidebarMenuItems.map((item) => {
                const IconComponent = item.icon
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActivePage(item.id)
                    }}
                    title={item.id}
                  >
                    <IconComponent />
                  </button>
                )
              })}
            </nav>
            <div className="sidebar-nav-bottom">
              <button className="sidebar-nav-item" onClick={onLogout} title="Logout">
                <LogoutIcon />
              </button>
            </div>
          </aside>

          {/* Top Header */}
          <header className="dashboard-header-new">
            <div className="header-left">
              <div className="brand-new">
                <span>Internify.</span>
              </div>
            </div>

            <div className="header-center">
              <div className="header-search">
                <SearchIcon />
                <input type="text" placeholder="Search" className="search-input" />
              </div>
            </div>

            <div className="header-right">
              <button
                className="header-icon-btn"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                className="header-icon-btn"
                onClick={() => setActivePage('Notification')}
                title="Notifications"
              >
                <NotificationIcon />
              </button>
              <button className="header-avatar-btn" title="Profile">
                <div className="avatar-circle">A</div>
              </button>
            </div>
          </header>
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

export default Dashboard
