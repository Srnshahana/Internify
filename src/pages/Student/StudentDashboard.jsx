
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
import '../../App.css'

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
            onNavigate={(pageName) => setPage(pageName)}
            onLogout={onLogout}
            onMentorClick={handleMentorClick}
            renderStars={renderStars}
            onOpenExplore={() => setPage('Mentors')}
            onOpenResources={() => { }}
            onBookSession={() => setPage('Calendar')}
          />
        )
      case 'Classrooms':
        return (
          <MyCourses
            courses={courses}
            onBack={() => setPage('Home')}
            onEnterClassroom={() => setIsLiveClassroomActive(true)}
            onMentorClick={handleMentorClick}
          />
        )
      case 'Mentors':
        return (
          <Explore
            mentors={[]}
            courses={courses}
            onBack={() => setPage('Home')}
            renderStars={renderStars}
            onMentorClick={handleMentorClick}
          />
        )
      case 'Calendar':
        return <Calendar />
      case 'Profile':
        return <Profile />
      case 'Notification':
        return <Notification />
      default:
        return <Home onNavigate={(pageName) => setPage(pageName)} onMentorClick={handleMentorClick} renderStars={renderStars} />
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
          {activePage !== 'Profile' && (
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

export default Dashboard
