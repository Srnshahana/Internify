import { useState } from 'react'
import '../../App.css'

const mentorProfile = {
  name: 'Alex Johnson',
  role: 'Senior Software Engineer · React & Systems Design',
  location: 'Remote · Worldwide',
  bio: 'I help early-career engineers and freshers ship real projects, build confidence in system design, and crack product-company interviews.',
  experienceYears: 8,
  menteesCoached: 120,
  offersFrom: ['Google', 'Stripe', 'Swiggy'],
}

const mentorFocusAreas = ['Frontend (React)', 'System Design', 'Career strategy', 'Interview prep']

const mentorAvailability = [
  { day: 'Mon', slots: '6 – 9 PM IST' },
  { day: 'Wed', slots: '6 – 9 PM IST' },
  { day: 'Sat', slots: '10 AM – 1 PM IST' },
]

function MentorProfile() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="dashboard-page profile-page-linkedin">
      {/* Header */}
      <div className="profile-cover-section">
        <div className="profile-cover-photo mentor-cover"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar-large mentor-avatar">
              <span>AJ</span>
            </div>
          </div>
          <div className="profile-header-info">
            <h1>{mentorProfile.name}</h1>
            <p className="profile-role">{mentorProfile.role}</p>
            <p className="profile-location">{mentorProfile.location}</p>
            <button className="edit-profile-btn" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Save changes' : 'Edit mentor profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Mentor stats */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="stat-value">{mentorProfile.experienceYears}+</div>
          <div className="stat-label">Years of experience</div>
        </div>
        <div className="profile-stat-card">
          <div className="stat-value">{mentorProfile.menteesCoached}+</div>
          <div className="stat-label">Mentees coached</div>
        </div>
        <div className="profile-stat-card">
          <div className="stat-value">{mentorFocusAreas.length}</div>
          <div className="stat-label">Focus areas</div>
        </div>
        <div className="profile-stat-card">
          <div className="stat-value">{mentorProfile.offersFrom.length}</div>
          <div className="stat-label">Top companies</div>
        </div>
      </div>

      {/* About mentor */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>About mentor</h2>
          {isEditing && <button className="section-edit-btn">Edit</button>}
        </div>
        <p className="profile-bio-text">{mentorProfile.bio}</p>
      </div>

      {/* Focus areas */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>What I help with</h2>
        </div>
        <div className="mentor-focus-tags">
          {mentorFocusAreas.map((area) => (
            <span key={area} className="experience-type-badge" data-type="mentorship">
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <h2>Weekly availability</h2>
        </div>
        <div className="mentor-availability-grid">
          {mentorAvailability.map((slot) => (
            <div key={slot.day} className="availability-chip">
              <span className="availability-day">{slot.day}</span>
              <span className="availability-time">{slot.slots}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MentorProfile


