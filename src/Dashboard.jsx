
import StudentAppBar from './components/StudentAppBar.jsx'
import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import MyCourses from './pages/student_dashboard/MyCourses.jsx'
import Calendar from './pages/student_dashboard/Calendar.jsx'
import Explore from './search.jsx'
import Profile from './pages/student_dashboard/Profile.jsx'
import Notification from './pages/student_dashboard/Notification.jsx'
import Assessments from './pages/student_dashboard/Assessments.jsx'
import MentorProfile from './mentorProfile.jsx'
import { HomeIcon, ProfileIcon, NotificationIcon, LogoutIcon, SunIcon, MoonIcon, GridIcon, FolderIcon, SettingsIcon, SearchIcon, CalendarIcon, ClassroomIcon } from './components/Icons.jsx'
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
          <LandingPage
            onOpenExplore={() => setPage('Mentors')}
            onOpenResources={() => { }}
            onOpenLogin={() => { }}
            onMentorClick={handleMentorClick}
            onBookSession={() => setPage('Calendar')}
            renderStars={renderStars}
            showNavbar={false}
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
        return <LandingPage onMentorClick={handleMentorClick} renderStars={renderStars} />
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
                    {isActive && <div className="active-indicator" />}
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Top Header - Reused from Landing Page */}
          {activePage !== 'Profile' && <StudentAppBar onLogout={onLogout} />}
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
