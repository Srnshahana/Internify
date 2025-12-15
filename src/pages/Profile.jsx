import { useState } from 'react'
import '../App.css'

function Profile() {
  const [isEditing, setIsEditing] = useState(false)

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Software Developer',
    bio: 'Passionate about learning and building great products. Currently focusing on React and modern web development.',
    location: 'San Francisco, CA',
    joinedDate: 'January 2024',
    avatar: 'JD',
  }

  const stats = [
    { label: 'Courses Completed', value: '8' },
    { label: 'Projects', value: '12' },
    { label: 'Mentorship Sessions', value: '45' },
    { label: 'Certificates', value: '5' },
  ]

  const achievements = [
    { title: 'React Master', icon: '🏆', date: 'March 2024' },
    { title: 'Top Performer', icon: '⭐', date: 'February 2024' },
    { title: 'Early Adopter', icon: '🚀', date: 'January 2024' },
  ]

  return (
    <div className="dashboard-page">
      <div className="profile-header-section">
        <div className="profile-avatar-large">
          {userProfile.avatar}
        </div>
        <div className="profile-header-info">
          <div className="profile-header-top">
            <div>
              <h1>{userProfile.name}</h1>
              <p className="profile-role">{userProfile.role}</p>
              <p className="profile-location">📍 {userProfile.location}</p>
            </div>
            <button className="edit-profile-btn" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Save' : 'Edit Profile'}
            </button>
          </div>
          <p className="profile-bio">{userProfile.bio}</p>
          <div className="profile-meta">
            <span>Member since {userProfile.joinedDate}</span>
            <span>•</span>
            <span>{userProfile.email}</span>
          </div>
        </div>
      </div>

      <div className="profile-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="profile-stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h2>Personal Information</h2>
        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                defaultValue={userProfile.name}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                defaultValue={userProfile.email}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                defaultValue={userProfile.role}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                defaultValue={userProfile.location}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              defaultValue={userProfile.bio}
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <div className="achievement-icon">{achievement.icon}</div>
              <h4>{achievement.title}</h4>
              <p>{achievement.date}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Account Settings</h2>
        <div className="settings-list">
          <div className="setting-item">
            <div>
              <h4>Notifications</h4>
              <p>Manage your notification preferences</p>
            </div>
            <button className="ghost">Configure</button>
          </div>
          <div className="setting-item">
            <div>
              <h4>Privacy</h4>
              <p>Control your privacy settings</p>
            </div>
            <button className="ghost">Configure</button>
          </div>
          <div className="setting-item">
            <div>
              <h4>Change Password</h4>
              <p>Update your account password</p>
            </div>
            <button className="ghost">Change</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
