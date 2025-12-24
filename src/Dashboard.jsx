import { useState, useEffect } from 'react'
import Home from './pages/student_dashboard/Home.jsx'
import Calendar from './pages/student_dashboard/Calendar.jsx'
import Profile from './pages/student_dashboard/Profile.jsx'
import Notification from './pages/student_dashboard/Notification.jsx'
import Assessments from './pages/student_dashboard/Assessments.jsx'
import MentorProfile from './mentorProfile.jsx'
import { HomeIcon, CalendarIcon, ProfileIcon, NotificationIcon, LogoutIcon, SunIcon, MoonIcon } from './components/Icons.jsx'
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

  const menuItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'Assessments', label: 'Assessments', icon: HomeIcon },
    { id: 'Profile', label: 'Profile', icon: ProfileIcon },
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
    <div className={`dashboard-layout ${isLiveClassroomActive ? 'live-classroom-active' : ''}`}>
      {!isLiveClassroomActive && (
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <div className="brand">
              <span>Internify.</span>
            </div>
          </div>

          <nav className="dashboard-topnav">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                >
                  <span className="nav-icon">
                    <IconComponent />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="topbar-right">
            <button
              className="theme-toggle-dashboard"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon className="sun-icon-white" /> : <MoonIcon />}
            </button>
            <button className="notification-btn" onClick={() => setActivePage('Notification')}>
              <NotificationIcon />
            </button>
            <button className="logout-btn" onClick={onLogout}>
              <LogoutIcon />
            </button>
          </div>
        </header>
      )}

      <main className="dashboard-main">
        <div className="dashboard-content">
          {renderPage(activePage, setActivePage)}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
